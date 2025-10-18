import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";
import { type NexusTransaction, type NexusEvent, type NexusEventType } from "../types/nexus";

/**
 * Create a Nexus transaction object
 */
export function createNexusTransaction(
  hash: string,
  chainId: number,
  from: string,
  to: string,
  value: string,
  data?: string
): NexusTransaction {
  return {
    hash,
    chainId,
    from,
    to,
    value,
    data,
  };
}

/**
 * Emit a Nexus event
 */
export function emitNexusEvent(type: NexusEventType, data?: any): NexusEvent {
  const event: NexusEvent = {
    type,
    data,
    timestamp: Date.now(),
  };

  // Dispatch custom event for other components to listen
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexus-event', { detail: event }));
  }

  return event;
}

/**
 * Validate if a chain ID is supported by Nexus
 */
export function validateNexusChain(chainId: number): boolean {
  return NEXUS_CONFIG.supportedChains.some(chain => chain.chain.id === chainId);
}

/**
 * Get Nexus configuration for a specific chain
 */
export function getNexusChainConfig(chainId: ChainId) {
  return NEXUS_CONFIG.supportedChains.find(chain => chain.chain.id === chainId);
}

/**
 * Format transaction for Nexus SDK
 */
export function formatTransactionForNexus(tx: any): NexusTransaction {
  return {
    hash: tx.hash,
    chainId: tx.chainId,
    from: tx.from,
    to: tx.to,
    value: tx.value?.toString() || '0',
    data: tx.data,
    gasLimit: tx.gasLimit?.toString(),
    gasPrice: tx.gasPrice?.toString(),
  };
}

/**
 * Calculate gas estimation for cross-chain operations
 */
export function estimateNexusGas(
  sourceChain: ChainId,
  destinationChain: ChainId,
  operation: 'bridge' | 'execute' | 'bridgeAndExecute'
): number {
  const baseGas = {
    bridge: 50000,
    execute: 100000,
    bridgeAndExecute: 150000,
  };

  // Add chain-specific multipliers
  const chainMultipliers = {
    [1]: 1.0,      // Ethereum
    [137]: 0.8,    // Polygon
    [42161]: 0.9,  // Arbitrum
    [10]: 0.85,    // Optimism
    [8453]: 0.75,  // Base
  };

  const sourceMultiplier = chainMultipliers[sourceChain] || 1.0;
  const destMultiplier = chainMultipliers[destinationChain] || 1.0;

  return Math.round(baseGas[operation] * sourceMultiplier * destMultiplier);
}

/**
 * Generate unique transaction ID for tracking
 */
export function generateNexusTxId(): string {
  return `nexus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse Nexus error messages
 */
export function parseNexusError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.reason) return error.reason;
  return 'Unknown Nexus SDK error occurred';
}
