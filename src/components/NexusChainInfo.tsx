import React from "react";
import { useNexusChain } from "../hooks/useNexusChain";
import { NEXUS_CONFIG } from "../lib/nexus-config";

export function NexusChainInfo() {
  const { currentChain, isChainSupported, chainInfo } = useNexusChain();

  if (!currentChain) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
        <p className="text-gray-400 text-sm">No chain connected</p>
      </div>
    );
  }

  const supportedChainInfo = NEXUS_CONFIG.supportedChains.find(
    chain => chain.chain.id === currentChain.id
  );

  return (
    <div className="p-4 bg-gradient-to-br from-gray-800/50 to-purple-800/30 rounded-lg border border-purple-500/30">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>🌐</span>
        <span>Current Network</span>
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Network:</span>
          <span className="text-white font-medium">{currentChain.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Chain ID:</span>
          <span className="text-white font-mono text-sm">{currentChain.id}</span>
        </div>
        
        {supportedChainInfo && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Currency:</span>
              <span className="text-white font-medium">{supportedChainInfo.currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Explorer:</span>
              <a
                href={supportedChainInfo.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm underline"
              >
                View Explorer
              </a>
            </div>
          </>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Nexus Support:</span>
          <span className={`font-medium ${isChainSupported ? 'text-green-400' : 'text-red-400'}`}>
            {isChainSupported ? '✅ Supported' : '❌ Not Supported'}
          </span>
        </div>
      </div>
      
      {!isChainSupported && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-xs">
          This chain is not supported by Nexus SDK. Please switch to a supported network.
        </div>
      )}
    </div>
  );
}
