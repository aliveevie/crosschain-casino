import React from "react";
import { useNexusWalletContext } from "./NexusWalletProvider";
import { useNexusChain } from "../hooks/useNexusChain";

export function NexusStatusIndicator() {
  const { isNexusReady, nexusError } = useNexusWalletContext();
  const { isChainSupported, chainInfo } = useNexusChain();

  const getStatusColor = () => {
    if (nexusError) return "bg-red-500";
    if (!isNexusReady) return "bg-yellow-500";
    if (!isChainSupported) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (nexusError) return "Nexus Error";
    if (!isNexusReady) return "Initializing...";
    if (!isChainSupported) return "Unsupported Chain";
    return "Nexus Ready";
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <span className="text-white text-sm font-medium">{getStatusText()}</span>
      {chainInfo && (
        <span className="text-gray-300 text-xs">
          ({chainInfo.icon} {chainInfo.name})
        </span>
      )}
    </div>
  );
}
