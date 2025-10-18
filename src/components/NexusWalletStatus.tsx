import React from "react";
import { useNexusWalletContext } from "./NexusWalletProvider";
import { NEXUS_CONFIG } from "../lib/nexus-config";

export function NexusWalletStatus() {
  const { isNexusReady, nexusError, walletAddress, isConnected } = useNexusWalletContext();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-300 text-sm font-medium">Wallet Not Connected</span>
      </div>
    );
  }

  if (nexusError) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <span className="text-yellow-300 text-sm font-medium">Nexus SDK Error</span>
        <span className="text-yellow-200 text-xs">({nexusError})</span>
      </div>
    );
  }

  if (!isNexusReady) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-blue-300 text-sm font-medium">Initializing Nexus SDK...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-green-300 text-sm font-medium">Nexus SDK Ready</span>
      {walletAddress && (
        <span className="text-green-200 text-xs">
          ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})
        </span>
      )}
    </div>
  );
}

export function NexusSupportedChains() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-300">Supported Networks</h3>
      <div className="grid grid-cols-2 gap-2">
        {NEXUS_CONFIG.supportedChains.map((chain) => (
          <div 
            key={chain.chain.id}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
          >
            <span className="text-lg">{chain.icon}</span>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{chain.name}</div>
              <div className="text-gray-400 text-xs">{chain.currency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
