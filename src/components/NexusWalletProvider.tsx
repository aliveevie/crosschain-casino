import React, { createContext, useContext, ReactNode } from "react";
import { useNexusWallet } from "../hooks/useNexusWallet";

interface NexusWalletContextType {
  isNexusReady: boolean;
  nexusError: string | null;
  walletAddress: string | undefined;
  isConnected: boolean;
}

const NexusWalletContext = createContext<NexusWalletContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function NexusWalletProvider({ children }: Props) {
  const nexusWallet = useNexusWallet();

  return (
    <NexusWalletContext.Provider value={nexusWallet}>
      {children}
    </NexusWalletContext.Provider>
  );
}

export function useNexusWalletContext() {
  const context = useContext(NexusWalletContext);
  if (context === undefined) {
    throw new Error('useNexusWalletContext must be used within a NexusWalletProvider');
  }
  return context;
}
