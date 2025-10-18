import React from "react";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

interface Props {
  currentStep: 'idle' | 'validating' | 'bridging' | 'executing' | 'completed' | 'failed';
  progress: number;
  error?: string | null;
  txHash?: string | null;
}

const stepConfig = {
  idle: { label: 'Ready', icon: '🎯', color: 'text-gray-400' },
  validating: { label: 'Validating', icon: '🔍', color: 'text-blue-400' },
  bridging: { label: 'Bridging', icon: '🌉', color: 'text-purple-400' },
  executing: { label: 'Executing', icon: '⚡', color: 'text-yellow-400' },
  completed: { label: 'Completed', icon: '✅', color: 'text-green-400' },
  failed: { label: 'Failed', icon: '❌', color: 'text-red-400' },
};

export function BridgeProgressIndicator({ currentStep, progress, error, txHash }: Props) {
  const config = stepConfig[currentStep];

  return (
    <div className="w-full space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className={`text-lg font-semibold ${config.color}`}>
              {config.label}
            </h3>
            <p className="text-gray-400 text-sm">
              {currentStep === 'idle' && 'Ready to bridge and execute'}
              {currentStep === 'validating' && 'Validating parameters and wallet state'}
              {currentStep === 'bridging' && 'Bridging tokens across chains'}
              {currentStep === 'executing' && 'Executing dice game on destination chain'}
              {currentStep === 'completed' && 'Transaction completed successfully'}
              {currentStep === 'failed' && 'Transaction failed'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{progress}%</div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            currentStep === 'failed' ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {Object.entries(stepConfig).map(([step, stepInfo]) => {
          const isActive = step === currentStep;
          const isCompleted = ['validating', 'bridging', 'executing'].includes(currentStep) && 
                             ['validating', 'bridging', 'executing'].indexOf(step) <= 
                             ['validating', 'bridging', 'executing'].indexOf(currentStep);
          const isFailed = currentStep === 'failed';

          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isCompleted && !isFailed ? 'bg-green-500 text-white' :
                isActive ? 'bg-purple-500 text-white' :
                isFailed && step !== 'failed' ? 'bg-gray-600 text-gray-400' :
                'bg-gray-600 text-gray-400'
              }`}>
                {isCompleted && !isFailed ? '✓' : 
                 isActive ? stepInfo.icon : 
                 step === 'failed' && isFailed ? stepInfo.icon :
                 Object.keys(stepConfig).indexOf(step)}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-purple-400' : 
                isCompleted && !isFailed ? 'text-green-400' :
                isFailed && step === 'failed' ? 'text-red-400' :
                'text-gray-500'
              }`}>
                {stepInfo.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <h4 className="text-red-400 font-semibold">Transaction Failed</h4>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {currentStep === 'completed' && txHash && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-green-400 text-xl">🎉</span>
            <div className="flex-1">
              <h4 className="text-green-400 font-semibold">Transaction Successful!</h4>
              <p className="text-green-300 text-sm mt-1">
                Your dice game has been executed successfully on the destination chain.
              </p>
              <div className="mt-2">
                <span className="text-green-200 text-xs font-mono">
                  TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bridge Information */}
      {currentStep === 'bridging' && (
        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-xl">🌉</span>
            <div>
              <h4 className="text-blue-400 font-semibold">Bridging Tokens</h4>
              <p className="text-blue-300 text-sm mt-1">
                Your tokens are being bridged to the destination chain. This may take a few minutes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Execution Information */}
      {currentStep === 'executing' && (
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-xl">⚡</span>
            <div>
              <h4 className="text-yellow-400 font-semibold">Executing Game</h4>
              <p className="text-yellow-300 text-sm mt-1">
                Your dice game is being executed on the destination chain.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
