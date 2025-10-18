import React from "react";
import { useCrossChainBalance } from "../hooks/useCrossChainBalance";
import { type ChainId } from "../lib/nexus-config";
import { NEXUS_CONFIG } from "../lib/nexus-config";

interface Props {
  selectedChainId?: ChainId;
  onChainSelect?: (chainId: ChainId) => void;
  showRefreshButton?: boolean;
  compact?: boolean;
}

export function CrossChainBalanceDisplay({ 
  selectedChainId, 
  onChainSelect, 
  showRefreshButton = true,
  compact = false 
}: Props) {
  const {
    balances,
    totalValue,
    isLoading,
    error,
    lastUpdated,
    refreshBalances,
    getBalanceForChain,
    isConnected,
    canFetchBalances,
  } = useCrossChainBalance();

  const formatBalance = (balance: string, currency: string): string => {
    const num = parseFloat(balance);
    if (num < 0.001) return `<0.001 ${currency}`;
    return `${num.toFixed(4)} ${currency}`;
  };

  const formatLastUpdated = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (!isConnected) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-gray-800/50 border border-gray-700/50 rounded-lg`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🔗</div>
          <p className="text-gray-400">Connect wallet to view cross-chain balances</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-red-500/20 border border-red-500/30 rounded-lg`}>
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <h4 className="text-red-400 font-semibold">Balance Error</h4>
            <p className="text-red-300 text-sm">{error}</p>
            {showRefreshButton && (
              <button
                onClick={refreshBalances}
                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-all"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    const selectedBalance = selectedChainId ? getBalanceForChain(selectedChainId) : null;
    
    return (
      <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            {selectedBalance ? (
              <>
                <div className="text-white font-semibold">
                  {formatBalance(selectedBalance.balance, selectedBalance.currency)}
                </div>
                <div className="text-xs text-gray-400">{selectedBalance.chainName}</div>
              </>
            ) : (
              <>
                <div className="text-white font-semibold">
                  Total: {totalValue.toFixed(4)} (Multi-chain)
                </div>
                <div className="text-xs text-gray-400">
                  {balances.length} chains
                </div>
              </>
            )}
          </div>
        </div>
        
        {showRefreshButton && (
          <button
            onClick={refreshBalances}
            disabled={isLoading}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-all"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>🔄</span>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Cross-Chain Balances</h3>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-gray-400">
              Updated {formatLastUpdated(lastUpdated)}
            </span>
          )}
          {showRefreshButton && (
            <button
              onClick={refreshBalances}
              disabled={isLoading}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>🔄</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Total Value */}
      <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌐</span>
          <div>
            <h4 className="text-purple-400 font-semibold">Total Cross-Chain Value</h4>
            <p className="text-2xl font-bold text-white">
              {totalValue.toFixed(4)} (Multi-chain)
            </p>
            <p className="text-sm text-gray-400">
              Across {balances.length} supported networks
            </p>
          </div>
        </div>
      </div>

      {/* Individual Chain Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {balances.map((balance) => {
          const chainConfig = NEXUS_CONFIG.supportedChains.find(c => c.chain.id === balance.chainId);
          const isSelected = selectedChainId === balance.chainId;
          
          return (
            <div
              key={balance.chainId}
              onClick={() => onChainSelect?.(balance.chainId)}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-purple-500/20 border-purple-500/50' 
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chainConfig?.icon || '⛓️'}</span>
                  <div>
                    <h5 className="text-white font-semibold">{balance.chainName}</h5>
                    <p className="text-sm text-gray-400">{chainConfig?.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatBalance(balance.balance, balance.currency)}
                  </div>
                  {balance.error && (
                    <div className="text-xs text-red-400">Error</div>
                  )}
                  {balance.isLoading && (
                    <div className="text-xs text-blue-400">Loading...</div>
                  )}
                </div>
              </div>

              {/* Progress bar for loading state */}
              {balance.isLoading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {/* Error state */}
              {balance.error && (
                <div className="mt-2 text-xs text-red-400 bg-red-500/20 border border-red-500/30 rounded p-2">
                  {balance.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gray-800/30 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="text-sm text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'} • {balances.length} chains monitored
        </span>
      </div>
    </div>
  );
}
