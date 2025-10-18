import React from "react";
import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";

interface Props {
  selectedChainId: ChainId;
  onChainChange: (chainId: ChainId) => void;
  label?: string;
  disabled?: boolean;
}

export function NexusChainSelector({ 
  selectedChainId, 
  onChainChange, 
  label = "Select Network",
  disabled = false 
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedChainId}
          onChange={(e) => onChainChange(Number(e.target.value) as ChainId)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {NEXUS_CONFIG.supportedChains.map((chain) => (
            <option 
              key={chain.chain.id} 
              value={chain.chain.id}
              className="bg-gray-800 text-white"
            >
              {chain.icon} {chain.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Currency:</span>
        <span className="font-medium">
          {NEXUS_CONFIG.supportedChains.find(c => c.chain.id === selectedChainId)?.currency}
        </span>
      </div>
    </div>
  );
}
