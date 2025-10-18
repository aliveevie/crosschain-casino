import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { emitNexusEvent } from "../utils/nexusHelpers";
import { nexusService } from "../services/nexusService";
import { validateCrossChainParams, validateAmount, validateDiceGuess } from "../utils/nexusValidation";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

interface BridgeExecuteState {
  isProcessing: boolean;
  currentStep: 'idle' | 'validating' | 'bridging' | 'executing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  txHash: string | null;
}

interface BridgeExecuteParams {
  sourceChainId: number;
  destinationChainId: number;
  amount: string;
  guess: number;
  recipient?: string;
}

export function useBridgeExecute() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<BridgeExecuteState>({
    isProcessing: false,
    currentStep: 'idle',
    progress: 0,
    error: null,
    txHash: null,
  });

  const updateState = useCallback((updates: Partial<BridgeExecuteState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      currentStep: 'idle',
      progress: 0,
      error: null,
      txHash: null,
    });
  }, []);

  const executeBridgeAndExecute = useCallback(async (params: BridgeExecuteParams) => {
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
      });

      // Step 1: Validate parameters
      emitNexusEvent('TRANSACTION_STARTED', {
        type: 'bridge_and_execute',
        params,
        timestamp: Date.now(),
      });

      const validation = validateCrossChainParams(
        params.sourceChainId as any,
        params.destinationChainId as any,
        params.amount
      );

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      if (!validateDiceGuess(params.guess)) {
        throw new Error(NEXUS_CONSTANTS.ERROR_MESSAGES.INVALID_DICE_GUESS);
      }

      if (!validateAmount(params.amount)) {
        throw new Error(NEXUS_CONSTANTS.ERROR_MESSAGES.INVALID_AMOUNT);
      }

      updateState({ currentStep: 'bridging', progress: 25 });

      // Step 2: Prepare cross-chain transaction
      const bridgePrep = await nexusService.prepareCrossChainTransaction(
        params.sourceChainId,
        params.destinationChainId,
        params.amount
      );

      if (!bridgePrep.isValid) {
        throw new Error(bridgePrep.errors.join(', '));
      }

      updateState({ currentStep: 'executing', progress: 50 });

      // Step 3: Execute dice game transaction
      const gameResult = await nexusService.executeDiceGame(
        params.guess,
        params.amount,
        params.destinationChainId
      );

      if (!gameResult.success) {
        throw new Error(gameResult.error || 'Dice game execution failed');
      }

      updateState({ 
        currentStep: 'completed', 
        progress: 100,
        txHash: gameResult.txHash || null,
      });

      emitNexusEvent('TRANSACTION_COMPLETED', {
        type: 'bridge_and_execute',
        txHash: gameResult.txHash,
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

      emitNexusEvent('TRANSACTION_FAILED', {
        type: 'bridge_and_execute',
        error: errorMessage,
        params,
        timestamp: Date.now(),
      });
    }
  }, [isConnected, address, updateState]);

  const cancelOperation = useCallback(() => {
    updateState({ 
      isProcessing: false, 
      currentStep: 'idle', 
      progress: 0,
      error: 'Operation cancelled by user',
    });

    emitNexusEvent('TRANSACTION_FAILED', {
      type: 'bridge_and_execute',
      error: 'Cancelled by user',
      timestamp: Date.now(),
    });
  }, [updateState]);

  // Auto-reset after completion or failure
  useEffect(() => {
    if (state.currentStep === 'completed' || state.currentStep === 'failed') {
      const timer = setTimeout(() => {
        resetState();
      }, 5000); // Reset after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [state.currentStep, resetState]);

  return {
    ...state,
    executeBridgeAndExecute,
    cancelOperation,
    resetState,
    isConnected,
    canExecute: isConnected && !state.isProcessing,
  };
}
