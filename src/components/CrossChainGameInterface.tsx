import React, { useState } from "react";
import { useBridgeExecute } from "../hooks/useBridgeExecute";
import { BridgeExecuteButton } from "./BridgeExecuteButton";
import { BridgeProgressIndicator } from "./BridgeProgressIndicator";
import { NexusChainSelector } from "./NexusChainSelector";
import { useNexusChain } from "../hooks/useNexusChain";
import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";
import { getChainCurrency } from "../utils/chainUtils";

const DICE_FACES = {
  1: "⚀",
  2: "⚁", 
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

export function CrossChainGameInterface() {
  const [sourceChainId, setSourceChainId] = useState<ChainId>(137); // Default to Polygon
  const [destinationChainId, setDestinationChainId] = useState<ChainId>(42161); // Default to Arbitrum
  const [amount, setAmount] = useState("0.01");
  const [guess, setGuess] = useState(3);
  const [showResults, setShowResults] = useState(false);

  const { currentChain } = useNexusChain();
  const {
    isProcessing,
    currentStep,
    progress,
    error,
    txHash,
    executeBridgeAndExecute,
    cancelOperation,
    canExecute,
  } = useBridgeExecute();

  const isCrossChain = sourceChainId !== destinationChainId;
  const sourceCurrency = getChainCurrency(sourceChainId);
  const destCurrency = getChainCurrency(destinationChainId);

  const handlePlay = async () => {
    try {
      await executeBridgeAndExecute({
        sourceChainId,
        destinationChainId,
        amount,
        guess,
      });
      setShowResults(true);
    } catch (err) {
      console.error('Failed to execute bridge and play:', err);
    }
  };

  const handlePlayAgain = () => {
    setShowResults(false);
  };

  if (showResults && currentStep === 'completed') {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            🎉 Cross-Chain Game Complete!
          </h2>
          <p className="text-gray-300 mb-6">
            Your dice game has been successfully executed across chains
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-400/50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Game Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Guess:</span>
                  <span className="text-white font-medium">
                    {DICE_FACES[guess as keyof typeof DICE_FACES]} {guess}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Bet Amount:</span>
                  <span className="text-white font-medium">{amount} {sourceCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Source Chain:</span>
                  <span className="text-white font-medium">
                    {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === sourceChainId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Destination Chain:</span>
                  <span className="text-white font-medium">
                    {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === destinationChainId)?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Transaction</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-green-400 font-medium">✅ Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">TX Hash:</span>
                  <span className="text-white font-mono text-sm">
                    {txHash ? `${txHash.slice(0, 8)}...${txHash.slice(-6)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Bridged:</span>
                  <span className="text-white font-medium">{amount} {sourceCurrency} → {destCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Executed On:</span>
                  <span className="text-white font-medium">
                    {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === destinationChainId)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePlayAgain}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all"
            >
              Play Again 🎲
            </button>
            {txHash && (
              <button
                onClick={() => window.open(`https://polygonscan.com/tx/${txHash}`, '_blank')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
              >
                View TX 📊
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          🌉 Cross-Chain Dice Game
        </h2>
        <p className="text-gray-300 mb-6">
          Bridge tokens across chains and play dice games with Avail Nexus SDK
        </p>
      </div>

      {/* Chain Selection */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 border-2 border-blue-500/50">
        <h3 className="text-xl font-semibold text-white mb-4">Chain Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NexusChainSelector
            selectedChainId={sourceChainId}
            onChainChange={setSourceChainId}
            label="Source Chain"
            disabled={isProcessing}
          />
          
          <NexusChainSelector
            selectedChainId={destinationChainId}
            onChainChange={setDestinationChainId}
            label="Destination Chain"
            disabled={isProcessing}
          />
        </div>

        {isCrossChain && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">🌉</span>
              <div>
                <h4 className="text-blue-400 font-semibold">Cross-Chain Operation</h4>
                <p className="text-blue-300 text-sm">
                  Tokens will be bridged from {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === sourceChainId)?.name} to {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === destinationChainId)?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Configuration */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 border-2 border-purple-500/50">
        <h3 className="text-xl font-semibold text-white mb-4">Game Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bet Amount ({sourceCurrency})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.001"
                step="0.001"
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dice Guess (1-6)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setGuess(num)}
                    disabled={isProcessing}
                    className={`p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                      guess === num
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-white/20 bg-white/10 text-white hover:border-purple-400'
                    }`}
                  >
                    <div className="text-2xl">{DICE_FACES[num as keyof typeof DICE_FACES]}</div>
                    <div className="text-sm font-medium">{num}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isProcessing && (
        <div className="bg-gradient-to-br from-gray-900 to-yellow-900 rounded-2xl p-6 border-2 border-yellow-500/50">
          <BridgeProgressIndicator
            currentStep={currentStep}
            progress={progress}
            error={error}
            txHash={txHash}
          />
          
          {currentStep !== 'completed' && currentStep !== 'failed' && (
            <div className="mt-4 text-center">
              <button
                onClick={cancelOperation}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Cancel Operation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!isProcessing && (
        <div className="text-center">
          <BridgeExecuteButton
            sourceChainId={sourceChainId}
            destinationChainId={destinationChainId}
            amount={amount}
            guess={guess}
            onSuccess={() => setShowResults(true)}
            onError={(error) => console.error('Bridge & Execute Error:', error)}
          />
        </div>
      )}

      {/* Current Chain Warning */}
      {currentChain && currentChain.id !== sourceChainId && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <div>
              <h4 className="text-yellow-400 font-semibold">Chain Mismatch</h4>
              <p className="text-yellow-300 text-sm">
                You're connected to {currentChain.name} but the game is configured for {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === sourceChainId)?.name}. 
                Please switch chains or update your configuration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
