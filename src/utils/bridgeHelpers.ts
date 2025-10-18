import { type ChainId } from "../lib/nexus-config";
import { emitNexusEvent } from "./nexusHelpers";

export interface BridgeRoute {
  sourceChain: ChainId;
  destinationChain: ChainId;
  estimatedTime: number;
  estimatedFee: string;
  isAvailable: boolean;
  routeId: string;
}

export interface BridgeQuote {
  inputAmount: string;
  outputAmount: string;
  fee: string;
  estimatedTime: number;
  route: BridgeRoute;
  expiry: number;
}

/**
 * Calculate estimated bridge time between chains
 */
export function calculateBridgeTime(sourceChain: ChainId, destinationChain: ChainId): number {
  const timeMatrix: Record<string, number> = {
    // Polygon routes
    '137-42161': 120000, // Polygon to Arbitrum: ~2 minutes
    '137-10': 90000,     // Polygon to Optimism: ~1.5 minutes
    '137-8453': 60000,   // Polygon to Base: ~1 minute
    
    // Arbitrum routes
    '42161-137': 120000, // Arbitrum to Polygon: ~2 minutes
    '42161-10': 150000,  // Arbitrum to Optimism: ~2.5 minutes
    '42161-8453': 120000, // Arbitrum to Base: ~2 minutes
    
    // Optimism routes
    '10-137': 90000,     // Optimism to Polygon: ~1.5 minutes
    '10-42161': 150000,  // Optimism to Arbitrum: ~2.5 minutes
    '10-8453': 90000,    // Optimism to Base: ~1.5 minutes
    
    // Base routes
    '8453-137': 60000,   // Base to Polygon: ~1 minute
    '8453-42161': 120000, // Base to Arbitrum: ~2 minutes
    '8453-10': 90000,    // Base to Optimism: ~1.5 minutes
  };

  const routeKey = `${sourceChain}-${destinationChain}`;
  return timeMatrix[routeKey] || 120000; // Default 2 minutes
}

/**
 * Calculate bridge fee based on amount and route
 */
export function calculateBridgeFee(amount: string, sourceChain: ChainId, destinationChain: ChainId): string {
  const amountNum = parseFloat(amount);
  
  // Base fee structure (0.1% of amount)
  const baseFeeRate = 0.001;
  const baseFee = amountNum * baseFeeRate;
  
  // Additional fees based on chain complexity
  const complexityFees: Record<string, number> = {
    '137-42161': 0.0005, // Polygon to Arbitrum
    '42161-137': 0.0005, // Arbitrum to Polygon
    '137-10': 0.0003,    // Polygon to Optimism
    '10-137': 0.0003,    // Optimism to Polygon
    '137-8453': 0.0002,  // Polygon to Base
    '8453-137': 0.0002,  // Base to Polygon
    '42161-10': 0.0007,  // Arbitrum to Optimism
    '10-42161': 0.0007,  // Optimism to Arbitrum
    '42161-8453': 0.0005, // Arbitrum to Base
    '8453-42161': 0.0005, // Base to Arbitrum
    '10-8453': 0.0003,   // Optimism to Base
    '8453-10': 0.0003,   // Base to Optimism
  };

  const routeKey = `${sourceChain}-${destinationChain}`;
  const complexityFee = complexityFees[routeKey] || 0.0005;
  
  const totalFee = baseFee + (amountNum * complexityFee);
  return totalFee.toFixed(6);
}

/**
 * Get available bridge routes for a source chain
 */
export function getAvailableRoutes(sourceChain: ChainId): BridgeRoute[] {
  const allChains: ChainId[] = [137, 42161, 10, 8453]; // Polygon, Arbitrum, Optimism, Base
  
  return allChains
    .filter(chain => chain !== sourceChain)
    .map(destinationChain => ({
      sourceChain,
      destinationChain,
      estimatedTime: calculateBridgeTime(sourceChain, destinationChain),
      estimatedFee: calculateBridgeFee("0.01", sourceChain, destinationChain),
      isAvailable: true,
      routeId: `route_${sourceChain}_${destinationChain}`,
    }));
}

/**
 * Get bridge quote for a specific route
 */
export function getBridgeQuote(
  sourceChain: ChainId,
  destinationChain: ChainId,
  amount: string
): BridgeQuote {
  const estimatedTime = calculateBridgeTime(sourceChain, destinationChain);
  const fee = calculateBridgeFee(amount, sourceChain, destinationChain);
  const inputAmount = parseFloat(amount);
  const outputAmount = inputAmount - parseFloat(fee);

  return {
    inputAmount,
    outputAmount: outputAmount.toString(),
    fee,
    estimatedTime,
    route: {
      sourceChain,
      destinationChain,
      estimatedTime,
      estimatedFee: fee,
      isAvailable: true,
      routeId: `route_${sourceChain}_${destinationChain}`,
    },
    expiry: Date.now() + 300000, // 5 minutes
  };
}

/**
 * Validate bridge route
 */
export function validateBridgeRoute(sourceChain: ChainId, destinationChain: ChainId): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (sourceChain === destinationChain) {
    errors.push("Source and destination chains must be different");
  }

  const supportedChains: ChainId[] = [137, 42161, 10, 8453];
  if (!supportedChains.includes(sourceChain)) {
    errors.push(`Source chain ${sourceChain} is not supported`);
  }

  if (!supportedChains.includes(destinationChain)) {
    errors.push(`Destination chain ${destinationChain} is not supported`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format bridge time for display
 */
export function formatBridgeTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Get bridge status emoji
 */
export function getBridgeStatusEmoji(status: 'pending' | 'bridging' | 'completed' | 'failed'): string {
  const emojis = {
    pending: '⏳',
    bridging: '🌉',
    completed: '✅',
    failed: '❌',
  };
  
  return emojis[status] || '❓';
}

/**
 * Simulate bridge progress
 */
export function simulateBridgeProgress(
  onProgress: (progress: number) => void,
  onComplete: () => void,
  estimatedTime: number = 120000
): () => void {
  let progress = 0;
  const interval = 1000; // Update every second
  const increment = (interval / estimatedTime) * 100;

  const progressInterval = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      onProgress(progress);
      onComplete();
      clearInterval(progressInterval);
    } else {
      onProgress(progress);
    }
  }, interval);

  // Return cleanup function
  return () => clearInterval(progressInterval);
}

/**
 * Track bridge operation
 */
export function trackBridgeOperation(
  bridgeId: string,
  sourceChain: ChainId,
  destinationChain: ChainId,
  amount: string
): void {
  emitNexusEvent('BRIDGE_OPERATION_TRACKED', {
    bridgeId,
    sourceChain,
    destinationChain,
    amount,
    timestamp: Date.now(),
  });
}

/**
 * Get optimal bridge route based on criteria
 */
export function getOptimalRoute(
  sourceChain: ChainId,
  amount: string,
  criteria: 'fastest' | 'cheapest' | 'most_reliable' = 'fastest'
): BridgeRoute | null {
  const routes = getAvailableRoutes(sourceChain);
  
  if (routes.length === 0) return null;

  switch (criteria) {
    case 'fastest':
      return routes.reduce((fastest, route) => 
        route.estimatedTime < fastest.estimatedTime ? route : fastest
      );
    
    case 'cheapest':
      return routes.reduce((cheapest, route) => {
        const routeFee = parseFloat(route.estimatedFee);
        const cheapestFee = parseFloat(cheapest.estimatedFee);
        return routeFee < cheapestFee ? route : cheapest;
      });
    
    case 'most_reliable':
      // For demo, return the route with shortest estimated time
      return routes.reduce((mostReliable, route) => 
        route.estimatedTime < mostReliable.estimatedTime ? route : mostReliable
      );
    
    default:
      return routes[0];
  }
}
