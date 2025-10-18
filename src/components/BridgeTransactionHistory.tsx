import React, { useState, useEffect } from "react";
import { bridgeService } from "../services/bridgeService";
import { NEXUS_CONFIG } from "../lib/nexus-config";
import { getChainCurrency, getTransactionUrl } from "../utils/chainUtils";
import { type ChainId } from "../lib/nexus-config";

interface BridgeTransaction {
  id: string;
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  token: string;
  recipient: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
  estimatedTime?: number;
}

export function BridgeTransactionHistory() {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      const activeBridges = bridgeService.getActiveBridges();
      setTransactions(activeBridges);
      setIsLoading(false);
    };

    loadTransactions();

    // Refresh every 5 seconds
    const interval = setInterval(loadTransactions, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'bridging': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'bridging': return '🌉';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-400">Loading transaction history...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🌉</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Bridge Transactions</h3>
        <p className="text-gray-400">Start bridging tokens across chains to see your transaction history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Bridge Transaction History</h3>
        <span className="text-sm text-gray-400">{transactions.length} transactions</span>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => {
          const sourceChain = NEXUS_CONFIG.supportedChains.find(c => c.chain.id === tx.sourceChain);
          const destChain = NEXUS_CONFIG.supportedChains.find(c => c.chain.id === tx.destinationChain);
          const sourceCurrency = getChainCurrency(tx.sourceChain);
          const destCurrency = getChainCurrency(tx.destinationChain);

          return (
            <div
              key={tx.id}
              className="bg-gradient-to-br from-gray-800/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {sourceChain?.icon} → {destChain?.icon}
                  </div>
                  
                  <div>
                    <div className="text-white font-semibold">
                      {sourceChain?.name} → {destChain?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tx.amount} {sourceCurrency} → {destCurrency}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(tx.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(tx.status)}`}>
                    <span className="mr-1">{getStatusIcon(tx.status)}</span>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </div>

                  {tx.txHash && (
                    <button
                      onClick={() => window.open(getTransactionUrl(tx.destinationChain, tx.txHash!), '_blank')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-all"
                    >
                      View TX
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar for active transactions */}
              {(tx.status === 'pending' || tx.status === 'bridging') && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        tx.status === 'bridging' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: tx.status === 'bridging' ? '75%' : '25%' 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Bridge Progress</span>
                    <span>{tx.status === 'bridging' ? '75%' : '25%'}</span>
                  </div>
                </div>
              )}

              {/* Transaction details */}
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Bridge ID:</span>
                    <div className="text-white font-mono text-xs">
                      {tx.id.slice(0, 8)}...{tx.id.slice(-4)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <div className="text-white font-semibold">
                      {tx.amount} {sourceCurrency}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Recipient:</span>
                    <div className="text-white font-mono text-xs">
                      {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className="text-white">
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bridge Statistics */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h4 className="text-white font-semibold mb-3">Bridge Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {(() => {
            const stats = bridgeService.getBridgeStats();
            return (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalBridges}</div>
                  <div className="text-gray-400">Total Bridges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.completedBridges}</div>
                  <div className="text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.failedBridges}</div>
                  <div className="text-gray-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.pendingBridges}</div>
                  <div className="text-gray-400">Pending</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
