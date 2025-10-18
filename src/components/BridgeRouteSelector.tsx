import React, { useState, useEffect } from "react";
import { type ChainId } from "../lib/nexus-config";
import { NEXUS_CONFIG } from "../lib/nexus-config";
import { 
  getAvailableRoutes, 
  getBridgeQuote, 
  validateBridgeRoute,
  formatBridgeTime,
  getOptimalRoute,
  type BridgeRoute,
  type BridgeQuote 
} from "../utils/bridgeHelpers";
import { emitNexusEvent } from "../utils/nexusHelpers";

interface Props {
  sourceChain: ChainId;
  amount: string;
  onRouteSelect: (route: BridgeRoute, quote: BridgeQuote) => void;
  selectedRoute?: BridgeRoute;
  disabled?: boolean;
}

export function BridgeRouteSelector({ 
  sourceChain, 
  amount, 
  onRouteSelect, 
  selectedRoute,
  disabled = false 
}: Props) {
  const [routes, setRoutes] = useState<BridgeRoute[]>([]);
  const [quotes, setQuotes] = useState<Map<string, BridgeQuote>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'fee' | 'reliability'>('time');

  useEffect(() => {
    loadRoutes();
  }, [sourceChain]);

  useEffect(() => {
    if (routes.length > 0 && amount) {
      loadQuotes();
    }
  }, [routes, amount]);

  const loadRoutes = () => {
    try {
      const availableRoutes = getAvailableRoutes(sourceChain);
      setRoutes(availableRoutes);
      
      emitNexusEvent('BRIDGE_ROUTES_LOADED', {
        sourceChain,
        routeCount: availableRoutes.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to load bridge routes:', error);
    }
  };

  const loadQuotes = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      const quotePromises = routes.map(async (route) => {
        const quote = getBridgeQuote(route.sourceChain, route.destinationChain, amount);
        return [route.routeId, quote] as [string, BridgeQuote];
      });

      const quoteResults = await Promise.all(quotePromises);
      const quotesMap = new Map(quoteResults);
      setQuotes(quotesMap);

      emitNexusEvent('BRIDGE_QUOTES_LOADED', {
        sourceChain,
        amount,
        quoteCount: quoteResults.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to load bridge quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (route: BridgeRoute) => {
    const quote = quotes.get(route.routeId);
    if (quote) {
      onRouteSelect(route, quote);
      
      emitNexusEvent('BRIDGE_ROUTE_SELECTED', {
        route,
        quote,
        timestamp: Date.now(),
      });
    }
  };

  const getSortedRoutes = (): BridgeRoute[] => {
    const sortedRoutes = [...routes].sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return a.estimatedTime - b.estimatedTime;
        case 'fee':
          return parseFloat(a.estimatedFee) - parseFloat(b.estimatedFee);
        case 'reliability':
          // For demo, use estimated time as reliability metric
          return a.estimatedTime - b.estimatedTime;
        default:
          return 0;
      }
    });

    return sortedRoutes;
  };

  const getChainInfo = (chainId: ChainId) => {
    return NEXUS_CONFIG.supportedChains.find(c => c.chain.id === chainId);
  };

  if (routes.length === 0) {
    return (
      <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">🌉</div>
          <p className="text-gray-400">No bridge routes available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Select Bridge Route</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'time' | 'fee' | 'reliability')}
            disabled={disabled}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="time">Time</option>
            <option value="fee">Fee</option>
            <option value="reliability">Reliability</option>
          </select>
        </div>
      </div>

      {/* Route List */}
      <div className="space-y-3">
        {getSortedRoutes().map((route) => {
          const destChain = getChainInfo(route.destinationChain);
          const quote = quotes.get(route.routeId);
          const isSelected = selectedRoute?.routeId === route.routeId;
          
          return (
            <div
              key={route.routeId}
              onClick={() => !disabled && handleRouteSelect(route)}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-purple-500/20 border-purple-500/50' 
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {getChainInfo(route.sourceChain)?.icon} → {destChain?.icon}
                  </div>
                  
                  <div>
                    <div className="text-white font-semibold">
                      {getChainInfo(route.sourceChain)?.name} → {destChain?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {destChain?.name} • {route.destinationChain}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {quote ? (
                    <div className="space-y-1">
                      <div className="text-white font-semibold">
                        {formatBridgeTime(route.estimatedTime)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Fee: {quote.fee} {route.sourceChain === 137 ? 'POL' : 'ETH'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Output: {quote.outputAmount} {route.destinationChain === 137 ? 'POL' : 'ETH'}
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-400">Loading quote...</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      {formatBridgeTime(route.estimatedTime)}
                    </div>
                  )}
                </div>
              </div>

              {/* Route Status */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400">🌉</span>
                    <span className="text-gray-400">Bridge</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="text-purple-400 text-sm font-medium">
                    Selected ✓
                  </div>
                )}
              </div>

              {/* Quote Details */}
              {quote && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Input:</span>
                      <div className="text-white font-medium">
                        {quote.inputAmount} {route.sourceChain === 137 ? 'POL' : 'ETH'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Fee:</span>
                      <div className="text-white font-medium">
                        {quote.fee} {route.sourceChain === 137 ? 'POL' : 'ETH'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Output:</span>
                      <div className="text-white font-medium">
                        {quote.outputAmount} {route.destinationChain === 137 ? 'POL' : 'ETH'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Route Options */}
      <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className="text-blue-400 font-semibold mb-3">Quick Route Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              const fastest = getOptimalRoute(sourceChain, amount, 'fastest');
              if (fastest) {
                const quote = quotes.get(fastest.routeId);
                if (quote) handleRouteSelect(fastest);
              }
            }}
            disabled={disabled || !amount}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            🚀 Fastest Route
          </button>
          <button
            onClick={() => {
              const cheapest = getOptimalRoute(sourceChain, amount, 'cheapest');
              if (cheapest) {
                const quote = quotes.get(cheapest.routeId);
                if (quote) handleRouteSelect(cheapest);
              }
            }}
            disabled={disabled || !amount}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            💰 Cheapest Route
          </button>
          <button
            onClick={() => {
              const reliable = getOptimalRoute(sourceChain, amount, 'most_reliable');
              if (reliable) {
                const quote = quotes.get(reliable.routeId);
                if (quote) handleRouteSelect(reliable);
              }
            }}
            disabled={disabled || !amount}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            🛡️ Most Reliable
          </button>
        </div>
      </div>
    </div>
  );
}
