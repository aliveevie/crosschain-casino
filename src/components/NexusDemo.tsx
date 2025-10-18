import React, { useState } from "react";
import { useNexusWalletContext } from "./NexusWalletProvider";
import { NexusChainSelector } from "./NexusChainSelector";
import { NexusWalletStatus, NexusSupportedChains } from "./NexusWalletStatus";
import { NexusChainInfo } from "./NexusChainInfo";
import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";
import { getChainCurrency, getChainName } from "../utils/chainUtils";

export function NexusDemo() {
  const { isNexusReady, nexusError } = useNexusWalletContext();
  const [selectedChain, setSelectedChain] = useState<ChainId>(137); // Default to Polygon

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          🌉 Nexus SDK Integration Demo
        </h1>
        <p className="text-gray-300 text-lg">
          Demonstrating meaningful use of Nexus SDK with multi-chain support
        </p>
      </div>

      {/* Wallet Status */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 border-2 border-purple-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔗</span>
          <span>Wallet Connection Status</span>
        </h2>
        <NexusWalletStatus />
        
        {nexusError && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">
              <strong>Error:</strong> {nexusError}
            </p>
          </div>
        )}
      </div>

      {/* Chain Selection Demo */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 border-2 border-blue-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🌐</span>
          <span>Multi-Chain Selection</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NexusChainSelector
            selectedChainId={selectedChain}
            onChainChange={setSelectedChain}
            label="Select Network for Demo"
          />
          
          <NexusChainInfo />
        </div>
      </div>

      {/* Supported Chains Display */}
      <div className="bg-gradient-to-br from-gray-900 to-green-900 rounded-2xl p-6 border-2 border-green-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>✅</span>
          <span>Nexus SDK Supported Networks</span>
        </h2>
        <NexusSupportedChains />
      </div>

      {/* SDK Features Demo */}
      <div className="bg-gradient-to-br from-gray-900 to-pink-900 rounded-2xl p-6 border-2 border-pink-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Nexus SDK Features</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Available Features</h3>
            <div className="space-y-3">
              {[
                "Multi-chain wallet connection",
                "Cross-chain transaction support",
                "Automatic chain switching",
                "Bridge & Execute functionality",
                "Real-time chain state monitoring",
                "Unified transaction interface"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">SDK Status</h3>
            <div className="bg-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Nexus SDK:</span>
                <span className={`font-medium ${isNexusReady ? 'text-green-400' : 'text-red-400'}`}>
                  {isNexusReady ? 'Ready' : 'Not Ready'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Supported Chains:</span>
                <span className="text-white font-medium">{NEXUS_CONFIG.supportedChains.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Contract Address:</span>
                <span className="text-white font-mono text-xs">
                  {NEXUS_CONFIG.contract.address.slice(0, 6)}...{NEXUS_CONFIG.contract.address.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-gray-900 to-yellow-900 rounded-2xl p-6 border-2 border-yellow-500/50">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📖</span>
          <span>How to Use Nexus SDK</span>
        </h2>
        
        <div className="space-y-4">
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <span>Connect your wallet using the wallet connection button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <span>Select your preferred network from the dropdown above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <span>Nexus SDK will automatically handle chain switching and provider setup</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
              <span>Use the Bridge & Execute feature for cross-chain transactions</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
