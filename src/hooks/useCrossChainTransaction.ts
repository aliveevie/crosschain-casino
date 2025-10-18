import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { type ChainId } from "../lib/nexus-config";
import { bridgeService } from "../services/bridgeService";
import { emitNexusEvent } from "../utils/nexusHelpers";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

interface CrossChainTransactionState {
  isProcessing: boolean;
  currentStep: 'idle' | 'validating' | 'bridging' | 'executing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  txHash: string | null;
  bridgeId: string | null;
  estimatedTime: number;
  startTime: number | null;
}

interface TransactionParams {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  recipient: string;
  token?: string;
}

export function useCrossChainTransaction() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<CrossChainTransactionState>({
    isProcessing: false,
    currentStep: 'idle',
    progress: 0,
    error: null,
    txHash: null,
    bridgeId: null,
    estimatedTime: 0,
    startTime: null,
  });

  const updateState = useCallback((updates: Partial<CrossChainTransactionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      currentStep: 'idle',
      progress: 0,
      error: null,
      txHash: null,
      bridgeId: null,
      estimatedTime: 0,
      startTime: null,
    });
  }, []);

  const executeTransaction = useCallback(async (params: TransactionParams) => {
    if (!isConnected || !address) {
      updateState({ error: NEXUS_CONSTANTS.ERROR_MESSAGES.WALLET_NOT_CONNECTED });
      return;
    }

    try {
      updateState({ 
        isProcessing: true, 
        currentStep: 'validating', 
        progress: 0,
        error: null,
        txHash: null,
        startTime: Date.now(),
      });

      emitNexusEvent('CROSS_CHAIN_TRANSACTION_STARTED', {
        params,
        timestamp: Date.now(),
      });

      // Step 1: Validate transaction parameters
      if (params.sourceChain === params.destinationChain) {
        throw new Error('Source and destination chains must be different');
      }

      if (parseFloat(params.amount) <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      updateState({ currentStep: 'bridging', progress: 25 });

      // Step 2: Estimate bridge operation
      const estimate = await bridgeService.estimateBridge(
        params.sourceChain,
        params.destinationChain,
        params.amount,
        params.token || 'native'
      );

      if (!estimate.canBridge) {
        throw new Error(estimate.error || 'Bridge operation not available');
      }

      updateState({ 
        estimatedTime: estimate.estimatedTime,
        progress: 40,
      });

      // Step 3: Execute bridge operation
      const bridgeResult = await bridgeService.executeBridge(
        params.sourceChain,
        params.destinationChain,
        params.amount,
        params.recipient || address,
        params.token || 'native'
      );

      if (!bridgeResult.success) {
        throw new Error(bridgeResult.error || 'Bridge operation failed');
      }

      updateState({ 
        bridgeId: bridgeResult.bridgeId,
        currentStep: 'executing',
        progress: 70,
      });

      // Step 4: Monitor bridge progress
      await monitorBridgeProgress(bridgeResult.bridgeId!);

      updateState({ 
        currentStep: 'completed', 
        progress: 100,
        txHash: bridgeResult.bridgeId, // Using bridge ID as transaction reference
      });

      emitNexusEvent('CROSS_CHAIN_TRANSACTION_COMPLETED', {
        bridgeId: bridgeResult.bridgeId,
        params,
        timestamp: Date.now(),
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateState({ 
        currentStep: 'failed', 
        error: errorMessage,
        isProcessing: false,
      });

      emitNexusEvent('CROSS_CHAIN_TRANSACTION_FAILED', {
        error: errorMessage,
        params,
        timestamp: Date.now(),
      });
    }
  }, [isConnected, address, updateState]);

  const monitorBridgeProgress = useCallback(async (bridgeId: string): Promise<void> => {
    const maxAttempts = 30; // 30 attempts with 2-second intervals = 1 minute max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const bridgeStatus = bridgeService.getBridgeStatus(bridgeId);
        
        if (!bridgeStatus) {
          throw new Error('Bridge status not found');
        }

        if (bridgeStatus.status === 'completed') {
          updateState({ txHash: bridgeStatus.txHash || bridgeId });
          return;
        }

        if (bridgeStatus.status === 'failed') {
          throw new Error('Bridge operation failed');
        }

        // Update progress based on bridge status
        const progress = bridgeStatus.status === 'bridging' ? 85 : 70;
        updateState({ progress });

        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;

      } catch (error) {
        throw error;
      }
    }

    throw new Error('Bridge monitoring timeout');
  }, [updateState]);

  const cancelTransaction = useCallback(async () => {
    if (!state.bridgeId) return;

    try {
      const result = await bridgeService.cancelBridge(state.bridgeId);
      
      if (result.success) {
        updateState({ 
          currentStep: 'failed',
          error: 'Transaction cancelled by user',
          isProcessing: false,
        });

        emitNexusEvent('CROSS_CHAIN_TRANSACTION_FAILED', {
          error: 'Cancelled by user',
          timestamp: Date.now(),
        });
      } else {
        throw new Error(result.error || 'Failed to cancel transaction');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateState({ error: errorMessage });
    }
  }, [state.bridgeId, updateState]);

  const getEstimatedTimeRemaining = useCallback((): number => {
    if (!state.startTime || state.estimatedTime === 0) return 0;
    
    const elapsed = Date.now() - state.startTime;
    const remaining = state.estimatedTime - elapsed;
    
    return Math.max(0, remaining);
  }, [state.startTime, state.estimatedTime]);

  const getProgressPercentage = useCallback((): number => {
    return Math.min(100, Math.max(0, state.progress));
  }, [state.progress]);

  // Auto-reset after completion or failure
  useEffect(() => {
    if (state.currentStep === 'completed' || state.currentStep === 'failed') {
      const timer = setTimeout(() => {
        resetState();
      }, 10000); // Reset after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [state.currentStep, resetState]);

  // Cleanup completed bridges periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      bridgeService.cleanupCompletedBridges();
    }, 300000); // Cleanup every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    ...state,
    executeTransaction,
    cancelTransaction,
    resetState,
    getEstimatedTimeRemaining,
    getProgressPercentage,
    isConnected,
    canExecute: isConnected && !state.isProcessing,
  };
}
