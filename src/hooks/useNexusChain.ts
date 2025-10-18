import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";
import { getChainInfo, isChainSupported } from "../utils/chainUtils";

/**
 * Hook for managing current chain state and switching
 */
export function useNexusChain() {
  const { chain } = useAccount();
  const [isChainSupported, setIsChainSupported] = useState(false);
  const [chainInfo, setChainInfo] = useState<ReturnType<typeof getChainInfo>>(null);

  useEffect(() => {
    if (chain?.id) {
      const supported = isChainSupported(chain.id);
      setIsChainSupported(supported);
      
      if (supported) {
        const info = getChainInfo(chain.id as ChainId);
        setChainInfo(info);
      } else {
        setChainInfo(null);
      }
    } else {
      setIsChainSupported(false);
      setChainInfo(null);
    }
  }, [chain?.id]);

  const getSupportedChains = () => {
    return NEXUS_CONFIG.supportedChains;
  };

  const switchToChain = async (chainId: ChainId) => {
    if (!window.ethereum) {
      throw new Error("Ethereum provider not available");
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If chain is not added to wallet, try to add it
      if (error.code === 4902) {
        const chainInfo = getChainInfo(chainId);
        if (chainInfo) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: chainInfo.name,
              nativeCurrency: {
                name: chainInfo.currency,
                symbol: chainInfo.currency,
                decimals: 18,
              },
              rpcUrls: [NEXUS_CONFIG.nexus.rpcEndpoints[chainId]],
              blockExplorerUrls: [chainInfo.explorer],
            }],
          });
        }
      } else {
        throw error;
      }
    }
  };

  return {
    currentChain: chain,
    isChainSupported,
    chainInfo,
    getSupportedChains,
    switchToChain,
  };
}
