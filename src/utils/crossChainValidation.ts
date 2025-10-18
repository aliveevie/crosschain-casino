import { type ChainId } from "../lib/nexus-config";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CrossChainValidationParams {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  recipient?: string;
  token?: string;
}

/**
 * Validate cross-chain transaction parameters
 */
export function validateCrossChainTransaction(params: CrossChainValidationParams): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate source chain
  if (!params.sourceChain) {
    errors.push("Source chain is required");
  } else if (!isValidChainId(params.sourceChain)) {
    errors.push(`Invalid source chain ID: ${params.sourceChain}`);
  }

  // Validate destination chain
  if (!params.destinationChain) {
    errors.push("Destination chain is required");
  } else if (!isValidChainId(params.destinationChain)) {
    errors.push(`Invalid destination chain ID: ${params.destinationChain}`);
  }

  // Validate chain pair
  if (params.sourceChain && params.destinationChain) {
    if (params.sourceChain === params.destinationChain) {
      errors.push("Source and destination chains must be different");
    }

    if (!isValidChainPair(params.sourceChain, params.destinationChain)) {
      errors.push(`Bridge route not available between chains ${params.sourceChain} and ${params.destinationChain}`);
    }
  }

  // Validate amount
  if (!params.amount) {
    errors.push("Amount is required");
  } else {
    const amount = parseFloat(params.amount);
    if (isNaN(amount)) {
      errors.push("Amount must be a valid number");
    } else if (amount <= 0) {
      errors.push("Amount must be greater than zero");
    } else if (amount < 0.001) {
      warnings.push("Amount is very small, consider using a larger amount");
    } else if (amount > 1000) {
      warnings.push("Large amount detected, please double-check the value");
    }
  }

  // Validate recipient
  if (params.recipient) {
    if (!isValidAddress(params.recipient)) {
      errors.push("Invalid recipient address format");
    }
  }

  // Validate token
  if (params.token && params.token !== 'native') {
    if (!isValidTokenAddress(params.token)) {
      errors.push("Invalid token address format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate bridge route availability
 */
export function validateBridgeRoute(sourceChain: ChainId, destinationChain: ChainId): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValidChainId(sourceChain)) {
    errors.push(`Invalid source chain ID: ${sourceChain}`);
  }

  if (!isValidChainId(destinationChain)) {
    errors.push(`Invalid destination chain ID: ${destinationChain}`);
  }

  if (sourceChain === destinationChain) {
    errors.push("Source and destination chains must be different");
  }

  if (!isValidChainPair(sourceChain, destinationChain)) {
    errors.push(`Bridge route not available between chains ${sourceChain} and ${destinationChain}`);
  }

  // Check for maintenance or known issues
  if (isChainUnderMaintenance(sourceChain)) {
    warnings.push(`Source chain ${sourceChain} may be under maintenance`);
  }

  if (isChainUnderMaintenance(destinationChain)) {
    warnings.push(`Destination chain ${destinationChain} may be under maintenance`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate bridge amount and fees
 */
export function validateBridgeAmount(amount: string, sourceChain: ChainId): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    errors.push("Amount must be a valid number");
    return { isValid: false, errors, warnings };
  }

  if (numAmount <= 0) {
    errors.push("Amount must be greater than zero");
  }

  // Check minimum amount for chain
  const minAmount = getMinimumBridgeAmount(sourceChain);
  if (numAmount < minAmount) {
    errors.push(`Minimum bridge amount for chain ${sourceChain} is ${minAmount}`);
  }

  // Check maximum amount for chain
  const maxAmount = getMaximumBridgeAmount(sourceChain);
  if (numAmount > maxAmount) {
    errors.push(`Maximum bridge amount for chain ${sourceChain} is ${maxAmount}`);
  }

  // Check if amount is sufficient to cover fees
  const estimatedFee = getEstimatedBridgeFee(amount, sourceChain);
  if (numAmount <= estimatedFee) {
    errors.push(`Amount must be greater than estimated bridge fee (${estimatedFee})`);
  }

  // Warnings for unusual amounts
  if (numAmount < 0.01) {
    warnings.push("Very small amount, consider if this is intentional");
  }

  if (numAmount > 100) {
    warnings.push("Large amount detected, please verify this is correct");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate wallet connection and permissions
 */
export function validateWalletConnection(chainId?: ChainId): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if wallet is connected
  if (typeof window !== 'undefined' && !window.ethereum) {
    errors.push("Wallet not detected. Please install a compatible wallet.");
    return { isValid: false, errors, warnings };
  }

  // Check if wallet is connected to the correct chain
  if (chainId && !isValidChainId(chainId)) {
    errors.push(`Invalid chain ID: ${chainId}`);
  }

  // Check if user has granted necessary permissions
  if (typeof window !== 'undefined' && window.ethereum && !window.ethereum.isConnected?.()) {
    warnings.push("Wallet may not be properly connected");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate dice game parameters
 */
export function validateDiceGameParams(guess: number, amount: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate dice guess
  if (!Number.isInteger(guess) || guess < 1 || guess > 6) {
    errors.push("Dice guess must be an integer between 1 and 6");
  }

  // Validate amount
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    errors.push("Amount must be a valid number");
  } else if (numAmount <= 0) {
    errors.push("Amount must be greater than zero");
  } else if (numAmount < 0.001) {
    warnings.push("Very small bet amount");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Helper functions

function isValidChainId(chainId: ChainId): boolean {
  const supportedChains = [137, 42161, 10, 8453]; // Polygon, Arbitrum, Optimism, Base
  return supportedChains.includes(chainId);
}

function isValidChainPair(sourceChain: ChainId, destinationChain: ChainId): boolean {
  // For demo, all supported chains can bridge to each other
  return isValidChainId(sourceChain) && isValidChainId(destinationChain);
}

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isValidTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isChainUnderMaintenance(chainId: ChainId): boolean {
  // Mock maintenance check - in real implementation, this would check actual chain status
  const maintenanceChains: ChainId[] = [];
  return maintenanceChains.includes(chainId);
}

function getMinimumBridgeAmount(chainId: ChainId): number {
  const minAmounts: Record<number, number> = {
    137: 0.001,   // Polygon
    42161: 0.001, // Arbitrum
    10: 0.001,    // Optimism
    8453: 0.001,  // Base
  };
  return minAmounts[chainId] || 0.001;
}

function getMaximumBridgeAmount(chainId: ChainId): number {
  const maxAmounts: Record<number, number> = {
    137: 1000,   // Polygon
    42161: 1000, // Arbitrum
    10: 1000,    // Optimism
    8453: 1000,  // Base
  };
  return maxAmounts[chainId] || 1000;
}

function getEstimatedBridgeFee(amount: string, sourceChain: ChainId): number {
  const amountNum = parseFloat(amount);
  const feeRate = 0.001; // 0.1% fee
  return amountNum * feeRate;
}

/**
 * Comprehensive validation for bridge and execute operations
 */
export function validateBridgeAndExecute(params: {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  guess: number;
  recipient?: string;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate cross-chain transaction
  const crossChainValidation = validateCrossChainTransaction({
    sourceChain: params.sourceChain,
    destinationChain: params.destinationChain,
    amount: params.amount,
    recipient: params.recipient,
  });

  errors.push(...crossChainValidation.errors);
  warnings.push(...crossChainValidation.warnings);

  // Validate bridge route
  const routeValidation = validateBridgeRoute(params.sourceChain, params.destinationChain);
  errors.push(...routeValidation.errors);
  warnings.push(...routeValidation.warnings);

  // Validate bridge amount
  const amountValidation = validateBridgeAmount(params.amount, params.sourceChain);
  errors.push(...amountValidation.errors);
  warnings.push(...amountValidation.warnings);

  // Validate dice game parameters
  const diceValidation = validateDiceGameParams(params.guess, params.amount);
  errors.push(...diceValidation.errors);
  warnings.push(...diceValidation.warnings);

  return {
    isValid: errors.length === 0,
    errors: [...new Set(errors)], // Remove duplicates
    warnings: [...new Set(warnings)], // Remove duplicates
  };
}
