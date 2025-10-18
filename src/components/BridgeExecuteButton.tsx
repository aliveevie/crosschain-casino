import React, { useState, useCallback } from "react";
import { BridgeAndExecuteButton } from "@avail-project/nexus-widgets";
import { useNexusWalletContext } from "./NexusWalletProvider";
import { useNexusLoading } from "../hooks/useNexusLoading";
import { emitNexusEvent } from "../utils/nexusHelpers";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";
import { validateCrossChainParams, validateAmount, validateDiceGuess } from "../utils/nexusValidation";

interface Props {
  sourceChainId: number;
  destinationChainId: number;
  amount: string;
  guess: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
}

export function BridgeExecuteButton({ 
  sourceChainId, 
  destinationChainId, 
  amount, 
  guess,
  onSuccess,
  onError 
}: Props) {
  const { isNexusReady, nexusError } = useNexusWalletContext();
  const { startLoading, stopLoading, updateLoading } = useNexusLoading();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBridgeAndExecute = useCallback(async () => {
    try {
      // Validate parameters
      const validation = validateCrossChainParams(
        sourceChainId as any,
        destinationChainId as any,
        amount
      );

      if (!validation.isValid) {
        onError?.(validation.errors.join(', '));
        return;
      }

      const diceValidation = validateDiceGuess(guess);
      if (!diceValidation) {
        onError?.(NEXUS_CONSTANTS.ERROR_MESSAGES.INVALID_DICE_GUESS);
        return;
      }

      setIsProcessing(true);
      startLoading('Preparing cross-chain transaction...');

      // Emit bridge started event
      emitNexusEvent('BRIDGE_STARTED', {
        sourceChain: sourceChainId,
        destinationChain: destinationChainId,
        amount,
        guess,
        timestamp: Date.now(),
      });

      updateLoading('Bridging tokens across chains...', 25);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
      emitNexusEvent('BRIDGE_FAILED', {
        error: errorMessage,
        timestamp: Date.now(),
      });
      setIsProcessing(false);
      stopLoading();
    }
  }, [sourceChainId, destinationChainId, amount, guess, onSuccess, onError, startLoading, updateLoading, stopLoading]);

  const handleSuccess = useCallback((txHash: string) => {
    emitNexusEvent('BRIDGE_COMPLETED', {
      txHash,
      sourceChain: sourceChainId,
      destinationChain: destinationChainId,
      amount,
      guess,
      timestamp: Date.now(),
    });

    setIsProcessing(false);
    stopLoading();
    onSuccess?.(txHash);
  }, [sourceChainId, destinationChainId, amount, guess, onSuccess, stopLoading]);

  const handleError = useCallback((error: string) => {
    emitNexusEvent('BRIDGE_FAILED', {
      error,
      timestamp: Date.now(),
    });

    setIsProcessing(false);
    stopLoading();
    onError?.(error);
  }, [onError, stopLoading]);

  if (!isNexusReady) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 bg-gray-600 text-gray-400 rounded-xl font-bold cursor-not-allowed"
      >
        {nexusError ? 'Nexus SDK Error' : 'Initializing Nexus SDK...'}
      </button>
    );
  }

  if (sourceChainId === destinationChainId) {
    return (
      <button
        onClick={handleBridgeAndExecute}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg"
      >
        🎲 Play Dice Game
      </button>
    );
  }

  return (
    <BridgeAndExecuteButton
      sourceChainId={sourceChainId}
      destinationChainId={destinationChainId}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {({ execute, isLoading }) => (
        <button
          onClick={() => {
            handleBridgeAndExecute();
            execute();
          }}
          disabled={isProcessing || isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold transition-all shadow-lg disabled:cursor-not-allowed"
        >
          {isProcessing || isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>🌉 Bridging & Playing...</span>
            </div>
          ) : (
            <span>🌉 Bridge & Execute</span>
          )}
        </button>
      )}
    </BridgeAndExecuteButton>
  );
}
