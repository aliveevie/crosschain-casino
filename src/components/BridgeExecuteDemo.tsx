import React, { useState } from "react";
import { CrossChainGameInterface } from "./CrossChainGameInterface";
import { BridgeTransactionHistory } from "./BridgeTransactionHistory";
import { CrossChainBalanceDisplay } from "./CrossChainBalanceDisplay";
import { BridgeRouteSelector } from "./BridgeRouteSelector";
import { type ChainId } from "../lib/nexus-config";
import { NEXUS_CONFIG } from "../lib/nexus-config";

export function BridgeExecuteDemo() {
  const [activeTab, setActiveTab] = useState<'game' | 'balance' | 'history' | 'routes'>('game');
  const [selectedSourceChain, setSelectedSourceChain] = useState<ChainId>(137); // Polygon
  const [selectedDestChain, setSelectedDestChain] = useState<ChainId>(42161); // Arbitrum

  const tabs = [
    { id: 'game', label: 'Cross-Chain Game', icon: '🎲', description: 'Play dice games across chains' },
    { id: 'balance', label: 'Balances', icon: '💰', description: 'View cross-chain balances' },
    { id: 'routes', label: 'Bridge Routes', icon: '🌉', description: 'Explore bridge routes and quotes' },
    { id: 'history', label: 'Transaction History', icon: '📊', description: 'View bridge transaction history' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🌉 Bridge & Execute Demo
        </h1>
        <p className="text-gray-300 mb-6">
          Experience seamless cross-chain operations with Avail Nexus SDK
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.concat(tabs.map(tab => ({ ...tab, id: `${tab.id}-mobile` }))).map((tab, index) => {
          if (index >= tabs.length) return null; // Only show original tabs
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 border-2 border-purple-500/50">
        {activeTab === 'game' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Cross-Chain Dice Game</h2>
              <p className="text-gray-300">
                Bridge tokens across chains and play dice games seamlessly
              </p>
            </div>
            
            {/* Chain Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Source Chain
                </label>
                <select
                  value={selectedSourceChain}
                  onChange={(e) => setSelectedSourceChain(Number(e.target.value) as ChainId)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {NEXUS_CONFIG.supportedChains.map((chain) => (
                    <option key={chain.chain.id} value={chain.chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Destination Chain
                </label>
                <select
                  value={selectedDestChain}
                  onChange={(e) => setSelectedDestChain(Number(e.target.value) as ChainId)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {NEXUS_CONFIG.supportedChains
                    .filter(chain => chain.chain.id !== selectedSourceChain)
                    .map((chain) => (
                      <option key={chain.chain.id} value={chain.chain.id}>
                        {chain.icon} {chain.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <CrossChainGameInterface />
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Cross-Chain Balances</h2>
              <p className="text-gray-300">
                Monitor your balances across all supported networks
              </p>
            </div>
            
            <CrossChainBalanceDisplay />
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Bridge Routes & Quotes</h2>
              <p className="text-gray-300">
                Explore available bridge routes and get real-time quotes
              </p>
            </div>
            
            <BridgeRouteSelector
              sourceChain={selectedSourceChain}
              amount="0.01"
              onRouteSelect={(route, quote) => {
                console.log('Route selected:', route, quote);
                // Handle route selection
              }}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Bridge Transaction History</h2>
              <p className="text-gray-300">
                Track all your cross-chain bridge operations
              </p>
            </div>
            
            <BridgeTransactionHistory />
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6">
          <div className="text-4xl mb-3">🌉</div>
          <h3 className="text-xl font-semibold text-white mb-2">Seamless Bridging</h3>
          <p className="text-gray-300 text-sm">
            Bridge tokens across multiple chains with optimal routes and competitive fees.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-xl font-semibold text-white mb-2">Bridge & Execute</h3>
          <p className="text-gray-300 text-sm">
            Execute transactions immediately after bridging with a single operation.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">Real-time Tracking</h3>
          <p className="text-gray-300 text-sm">
            Monitor your cross-chain operations with detailed progress tracking.
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gradient-to-br from-gray-800/50 to-purple-800/30 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Bridge & Execute Technical Implementation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-purple-400 mb-3">Supported Chains</h4>
            <ul className="space-y-2">
              {NEXUS_CONFIG.supportedChains.map((chain) => (
                <li key={chain.chain.id} className="flex items-center gap-2 text-gray-300">
                  <span>{chain.icon}</span>
                  <span>{chain.name} ({chain.chain.name})</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-purple-400 mb-3">Key Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Cross-chain balance monitoring</li>
              <li>• Real-time bridge route optimization</li>
              <li>• Automatic transaction execution</li>
              <li>• Progress tracking and status updates</li>
              <li>• Transaction history and analytics</li>
              <li>• Error handling and recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
