import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";

/**
 * Get chain information by chain ID
 */
export function getChainInfo(chainId: ChainId) {
  return NEXUS_CONFIG.supportedChains.find(chain => chain.chain.id === chainId);
}

/**
 * Get chain name by chain ID
 */
export function getChainName(chainId: ChainId): string {
  const chainInfo = getChainInfo(chainId);
  return chainInfo?.name || "Unknown Chain";
}

/**
 * Get chain currency by chain ID
 */
export function getChainCurrency(chainId: ChainId): string {
  const chainInfo = getChainInfo(chainId);
  return chainInfo?.currency || "ETH";
}

/**
 * Get chain explorer URL by chain ID
 */
export function getChainExplorer(chainId: ChainId): string {
  const chainInfo = getChainInfo(chainId);
  return chainInfo?.explorer || "https://etherscan.io";
}

/**
 * Get transaction URL for a specific chain
 */
export function getTransactionUrl(chainId: ChainId, txHash: string): string {
  const explorer = getChainExplorer(chainId);
  return `${explorer}/tx/${txHash}`;
}

/**
 * Check if chain ID is supported by Nexus SDK
 */
export function isChainSupported(chainId: number): chainId is ChainId {
  return NEXUS_CONFIG.supportedChains.some(chain => chain.chain.id === chainId);
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): ChainId[] {
  return NEXUS_CONFIG.supportedChains.map(chain => chain.chain.id);
}

/**
 * Format currency amount with appropriate symbol
 */
export function formatCurrency(amount: number, chainId: ChainId): string {
  const currency = getChainCurrency(chainId);
  return `${amount.toFixed(4)} ${currency}`;
}

/**
 * Convert wei to readable format
 */
export function weiToReadable(wei: string, decimals: number = 18): number {
  return Number(wei) / Math.pow(10, decimals);
}

/**
 * Convert readable amount to wei
 */
export function readableToWei(amount: number, decimals: number = 18): string {
  return (amount * Math.pow(10, decimals)).toString();
}
