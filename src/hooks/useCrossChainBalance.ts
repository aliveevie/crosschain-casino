import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { type ChainId } from "../lib/nexus-config";
import { emitNexusEvent } from "../utils/nexusHelpers";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

interface ChainBalance {
  chainId: ChainId;
  chainName: string;
  balance: string;
  currency: string;
  isLoading: boolean;
  error?: string;
}

interface CrossChainBalanceState {
  balances: ChainBalance[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useCrossChainBalance() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<CrossChainBalanceState>({
    balances: [],
    totalValue: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const updateState = useCallback((updates: Partial<CrossChainBalanceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchBalanceForChain = useCallback(async (chainId: ChainId): Promise<ChainBalance> => {
    try {
      emitNexusEvent('BALANCE_CHECK_STARTED', {
        chainId,
        address,
        timestamp: Date.now(),
      });

      // Mock balance fetching - in real implementation, this would call the appropriate RPC
      const mockBalances: Record<number, string> = {
        137: "0.5",    // Polygon
        42161: "0.3",  // Arbitrum
        10: "0.2",     // Optimism
        8453: "0.1",   // Base
      };

      const balance = mockBalances[chainId] || "0";
      const currency = chainId === 137 ? "POL" : "ETH";

      emitNexusEvent('BALANCE_CHECK_COMPLETED', {
        chainId,
        balance,
        currency,
        timestamp: Date.now(),
      });

      return {
        chainId,
        chainName: getChainName(chainId),
        balance,
        currency,
        isLoading: false,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      emitNexusEvent('BALANCE_CHECK_FAILED', {
        chainId,
        error: errorMessage,
        timestamp: Date.now(),
      });

      return {
        chainId,
        chainName: getChainName(chainId),
        balance: "0",
        currency: chainId === 137 ? "POL" : "ETH",
        isLoading: false,
        error: errorMessage,
      };
    }
  }, [address]);

  const fetchAllBalances = useCallback(async () => {
    if (!isConnected || !address) {
      updateState({ error: NEXUS_CONSTANTS.ERROR_MESSAGES.WALLET_NOT_CONNECTED });
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      const supportedChains: ChainId[] = [137, 42161, 10, 8453]; // Polygon, Arbitrum, Optimism, Base
      
      emitNexusEvent('CROSS_CHAIN_BALANCE_STARTED', {
        address,
        chains: supportedChains,
        timestamp: Date.now(),
      });

      // Fetch balances for all chains in parallel
      const balancePromises = supportedChains.map(chainId => 
        fetchBalanceForChain(chainId)
      );

      const balances = await Promise.all(balancePromises);

      // Calculate total value (simplified - assumes 1:1 ratio for demo)
      const totalValue = balances.reduce((sum, balance) => {
        return sum + parseFloat(balance.balance);
      }, 0);

      updateState({
        balances,
        totalValue,
        isLoading: false,
        lastUpdated: Date.now(),
      });

      emitNexusEvent('CROSS_CHAIN_BALANCE_COMPLETED', {
        balances,
        totalValue,
        timestamp: Date.now(),
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateState({ 
        isLoading: false, 
        error: errorMessage,
      });

      emitNexusEvent('CROSS_CHAIN_BALANCE_FAILED', {
        error: errorMessage,
        timestamp: Date.now(),
      });
    }
  }, [isConnected, address, fetchBalanceForChain, updateState]);

  const refreshBalances = useCallback(() => {
    fetchAllBalances();
  }, [fetchAllBalances]);

  // Auto-fetch balances when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchAllBalances();
    }
  }, [isConnected, address, fetchAllBalances]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(fetchAllBalances, 30000);
    return () => clearInterval(interval);
  }, [isConnected, address, fetchAllBalances]);

  const getBalanceForChain = useCallback((chainId: ChainId): ChainBalance | null => {
    return state.balances.find(balance => balance.chainId === chainId) || null;
  }, [state.balances]);

  const hasSufficientBalance = useCallback((chainId: ChainId, amount: string): boolean => {
    const balance = getBalanceForChain(chainId);
    if (!balance) return false;
    
    return parseFloat(balance.balance) >= parseFloat(amount);
  }, [getBalanceForChain]);

  const getTotalBalanceInCurrency = useCallback((currency: 'POL' | 'ETH'): number => {
    return state.balances
      .filter(balance => balance.currency === currency)
      .reduce((sum, balance) => sum + parseFloat(balance.balance), 0);
  }, [state.balances]);

  return {
    ...state,
    fetchAllBalances,
    refreshBalances,
    getBalanceForChain,
    hasSufficientBalance,
    getTotalBalanceInCurrency,
    isConnected,
    canFetchBalances: isConnected && !!address,
  };
}

// Helper function to get chain name
function getChainName(chainId: ChainId): string {
  const chainNames: Record<number, string> = {
    137: "Polygon",
    42161: "Arbitrum",
    10: "Optimism",
    8453: "Base",
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
}
