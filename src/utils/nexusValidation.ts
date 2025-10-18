import { NEXUS_CONFIG, type ChainId } from "../lib/nexus-config";

/**
 * Validate wallet address format
 */
export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate chain ID is supported by Nexus SDK
 */
export function validateChainId(chainId: number): chainId is ChainId {
  return NEXUS_CONFIG.supportedChains.some(chain => chain.chain.id === chainId);
}

/**
 * Validate transaction hash format
 */
export function validateTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate amount is positive number
 */
export function validateAmount(amount: string | number): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0 && isFinite(numAmount);
}

/**
 * Validate dice guess is valid (1-6)
 */
export function validateDiceGuess(guess: number): boolean {
  return Number.isInteger(guess) && guess >= 1 && guess <= 6;
}

/**
 * Validate contract address format
 */
export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address) && 
         address.toLowerCase() === NEXUS_CONFIG.contract.address.toLowerCase();
}

/**
 * Validate cross-chain operation parameters
 */
export function validateCrossChainParams(
  sourceChain: ChainId,
  destinationChain: ChainId,
  amount: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validateChainId(sourceChain)) {
    errors.push('Invalid source chain ID');
  }

  if (!validateChainId(destinationChain)) {
    errors.push('Invalid destination chain ID');
  }

  if (sourceChain === destinationChain) {
    errors.push('Source and destination chains must be different');
  }

  if (!validateAmount(amount)) {
    errors.push('Invalid amount - must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Nexus SDK configuration
 */
export function validateNexusConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!NEXUS_CONFIG.contract.address) {
    errors.push('Contract address is required');
  }

  if (!validateContractAddress(NEXUS_CONFIG.contract.address)) {
    errors.push('Invalid contract address format');
  }

  if (NEXUS_CONFIG.supportedChains.length === 0) {
    errors.push('At least one supported chain is required');
  }

  for (const chain of NEXUS_CONFIG.supportedChains) {
    if (!chain.chain.id || chain.chain.id <= 0) {
      errors.push(`Invalid chain ID for ${chain.name}`);
    }
    if (!chain.currency || chain.currency.length === 0) {
      errors.push(`Invalid currency for ${chain.name}`);
    }
    if (!chain.explorer || !chain.explorer.startsWith('http')) {
      errors.push(`Invalid explorer URL for ${chain.name}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
