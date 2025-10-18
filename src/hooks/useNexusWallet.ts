import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

/**
 * Custom hook for managing Nexus SDK wallet integration
 * Handles wallet connection state and provider initialization
 */
export function useNexusWallet() {
  const { address, isConnected, connector } = useAccount();
  const [isNexusReady, setIsNexusReady] = useState(false);
  const [nexusError, setNexusError] = useState<string | null>(null);

  useEffect(() => {
    const initializeNexusWallet = async () => {
      if (!isConnected || !address || !connector) {
        setIsNexusReady(false);
        return;
      }

      try {
        // Check if window.ethereum is available
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found");
        }

        // Initialize Nexus SDK wallet provider
        if (window.ethereum && typeof window.ethereum.request === 'function') {
          // Verify wallet connection
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            setIsNexusReady(true);
            setNexusError(null);
            console.log('✅ Nexus wallet initialized successfully');
          } else {
            throw new Error("No wallet accounts found");
          }
        }
      } catch (error) {
        console.error('❌ Nexus wallet initialization failed:', error);
        setNexusError(error instanceof Error ? error.message : 'Unknown error');
        setIsNexusReady(false);
      }
    };

    initializeNexusWallet();
  }, [isConnected, address, connector]);

  return {
    isNexusReady,
    nexusError,
    walletAddress: address,
    isConnected,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
