export const BRIDGE_CONSTANTS = {
  // Supported chains for bridging
  SUPPORTED_CHAINS: [137, 42161, 10, 8453] as const, // Polygon, Arbitrum, Optimism, Base

  // Bridge operation statuses
  BRIDGE_STATUS: {
    PENDING: 'pending',
    BRIDGING: 'bridging',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  } as const,

  // Bridge transaction types
  BRIDGE_TYPES: {
    NATIVE_TOKEN: 'native',
    ERC20_TOKEN: 'erc20',
    NFT: 'nft',
  } as const,

  // Default bridge settings
  DEFAULT_SETTINGS: {
    SLIPPAGE_TOLERANCE: 0.5, // 0.5%
    DEADLINE_MINUTES: 20,
    MAX_RETRIES: 3,
    TIMEOUT_MINUTES: 10,
  },

  // Bridge fee structure
  FEE_STRUCTURE: {
    BASE_FEE_RATE: 0.001, // 0.1% base fee
    MIN_FEE: 0.0001, // Minimum fee
    MAX_FEE: 0.01, // Maximum fee
    COMPLEXITY_MULTIPLIER: {
      SAME_ROLLUP: 1.0, // Same rollup family
      CROSS_ROLLUP: 1.5, // Different rollup families
      L1_L2: 2.0, // L1 to L2 or L2 to L1
    },
  },

  // Estimated bridge times (in milliseconds)
  BRIDGE_TIMES: {
    POLYGON_TO_ARBITRUM: 120000, // 2 minutes
    ARBITRUM_TO_POLYGON: 120000, // 2 minutes
    POLYGON_TO_OPTIMISM: 90000,  // 1.5 minutes
    OPTIMISM_TO_POLYGON: 90000,  // 1.5 minutes
    POLYGON_TO_BASE: 60000,      // 1 minute
    BASE_TO_POLYGON: 60000,      // 1 minute
    ARBITRUM_TO_OPTIMISM: 150000, // 2.5 minutes
    OPTIMISM_TO_ARBITRUM: 150000, // 2.5 minutes
    ARBITRUM_TO_BASE: 120000,    // 2 minutes
    BASE_TO_ARBITRUM: 120000,    // 2 minutes
    OPTIMISM_TO_BASE: 90000,     // 1.5 minutes
    BASE_TO_OPTIMISM: 90000,     // 1.5 minutes
    DEFAULT: 120000,             // 2 minutes default
  },

  // Bridge route priorities
  ROUTE_PRIORITIES: {
    FASTEST: 'fastest',
    CHEAPEST: 'cheapest',
    MOST_RELIABLE: 'most_reliable',
    LEAST_CONGESTED: 'least_congested',
  } as const,

  // Error messages
  ERROR_MESSAGES: {
    WALLET_NOT_CONNECTED: 'Wallet not connected',
    INSUFFICIENT_BALANCE: 'Insufficient balance for bridge operation',
    INVALID_CHAIN: 'Invalid or unsupported chain',
    INVALID_AMOUNT: 'Invalid amount specified',
    INVALID_RECIPIENT: 'Invalid recipient address',
    BRIDGE_ROUTE_UNAVAILABLE: 'Bridge route not available',
    BRIDGE_TIMEOUT: 'Bridge operation timed out',
    BRIDGE_FAILED: 'Bridge operation failed',
    INVALID_BRIDGE_ID: 'Invalid bridge transaction ID',
    BRIDGE_CANCELLED: 'Bridge operation was cancelled',
    NETWORK_ERROR: 'Network error occurred during bridge operation',
    INSUFFICIENT_GAS: 'Insufficient gas for bridge operation',
    BRIDGE_MAINTENANCE: 'Bridge service is under maintenance',
    UNSUPPORTED_TOKEN: 'Token type not supported for bridging',
    EXCEEDS_MAX_AMOUNT: 'Amount exceeds maximum bridge limit',
    BELOW_MIN_AMOUNT: 'Amount below minimum bridge limit',
    INVALID_SLIPPAGE: 'Invalid slippage tolerance',
    EXPIRED_QUOTE: 'Bridge quote has expired',
    BRIDGE_QUEUE_FULL: 'Bridge queue is full, please try again later',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    BRIDGE_INITIATED: 'Bridge operation initiated successfully',
    BRIDGE_COMPLETED: 'Bridge operation completed successfully',
    BRIDGE_CANCELLED: 'Bridge operation cancelled successfully',
    QUOTE_GENERATED: 'Bridge quote generated successfully',
    ROUTES_LOADED: 'Bridge routes loaded successfully',
    BALANCE_UPDATED: 'Balance updated successfully',
  },

  // Bridge operation steps
  BRIDGE_STEPS: {
    VALIDATING: 'validating',
    PREPARING: 'preparing',
    BRIDGING: 'bridging',
    CONFIRMING: 'confirming',
    COMPLETED: 'completed',
    FAILED: 'failed',
  } as const,

  // Bridge monitoring intervals
  MONITORING_INTERVALS: {
    STATUS_CHECK: 2000, // 2 seconds
    PROGRESS_UPDATE: 1000, // 1 second
    BALANCE_REFRESH: 30000, // 30 seconds
    CLEANUP_INTERVAL: 300000, // 5 minutes
  },

  // Bridge limits
  BRIDGE_LIMITS: {
    MIN_AMOUNT: {
      POLYGON: 0.001,
      ARBITRUM: 0.001,
      OPTIMISM: 0.001,
      BASE: 0.001,
    },
    MAX_AMOUNT: {
      POLYGON: 1000,
      ARBITRUM: 1000,
      OPTIMISM: 1000,
      BASE: 1000,
    },
    DAILY_LIMIT: {
      POLYGON: 10000,
      ARBITRUM: 10000,
      OPTIMISM: 10000,
      BASE: 10000,
    },
  },

  // Bridge retry configuration
  RETRY_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000, // 5 seconds
    EXPONENTIAL_BACKOFF: true,
    RETRYABLE_ERRORS: [
      'NETWORK_ERROR',
      'TIMEOUT',
      'TEMPORARY_FAILURE',
    ],
  },

  // Bridge analytics events
  ANALYTICS_EVENTS: {
    BRIDGE_INITIATED: 'bridge_initiated',
    BRIDGE_COMPLETED: 'bridge_completed',
    BRIDGE_FAILED: 'bridge_failed',
    BRIDGE_CANCELLED: 'bridge_cancelled',
    QUOTE_REQUESTED: 'quote_requested',
    ROUTE_SELECTED: 'route_selected',
    BALANCE_CHECKED: 'balance_checked',
    BRIDGE_MONITORED: 'bridge_monitored',
  },

  // Bridge UI configuration
  UI_CONFIG: {
    PROGRESS_BAR_UPDATE_INTERVAL: 100, // 100ms
    TOAST_DURATION: 5000, // 5 seconds
    MODAL_AUTO_CLOSE_DELAY: 10000, // 10 seconds
    ANIMATION_DURATION: 300, // 300ms
    REFRESH_INTERVAL: 5000, // 5 seconds
  },

  // Bridge validation rules
  VALIDATION_RULES: {
    ADDRESS_FORMAT: /^0x[a-fA-F0-9]{40}$/,
    AMOUNT_PRECISION: 6,
    MAX_DECIMAL_PLACES: 18,
    MIN_CONFIRMATIONS: 1,
    MAX_CONFIRMATIONS: 12,
  },

  // Bridge status colors
  STATUS_COLORS: {
    PENDING: 'yellow',
    BRIDGING: 'blue',
    COMPLETED: 'green',
    FAILED: 'red',
    CANCELLED: 'gray',
  },

  // Bridge status icons
  STATUS_ICONS: {
    PENDING: '⏳',
    BRIDGING: '🌉',
    COMPLETED: '✅',
    FAILED: '❌',
    CANCELLED: '🚫',
  },
} as const;

// Type definitions for better TypeScript support
export type BridgeStatus = typeof BRIDGE_CONSTANTS.BRIDGE_STATUS[keyof typeof BRIDGE_CONSTANTS.BRIDGE_STATUS];
export type BridgeType = typeof BRIDGE_CONSTANTS.BRIDGE_TYPES[keyof typeof BRIDGE_CONSTANTS.BRIDGE_TYPES];
export type RoutePriority = typeof BRIDGE_CONSTANTS.ROUTE_PRIORITIES[keyof typeof BRIDGE_CONSTANTS.ROUTE_PRIORITIES];
export type BridgeStep = typeof BRIDGE_CONSTANTS.BRIDGE_STEPS[keyof typeof BRIDGE_CONSTANTS.BRIDGE_STEPS];
export type AnalyticsEvent = typeof BRIDGE_CONSTANTS.ANALYTICS_EVENTS[keyof typeof BRIDGE_CONSTANTS.ANALYTICS_EVENTS];

// Helper functions
export function getBridgeTime(sourceChain: number, destinationChain: number): number {
  const routeKey = `${sourceChain}_TO_${destinationChain}`.toUpperCase();
  const timeKey = routeKey.replace('_TO_', '_TO_');
  
  // Try to find specific route time
  const specificTime = BRIDGE_CONSTANTS.BRIDGE_TIMES[timeKey as keyof typeof BRIDGE_CONSTANTS.BRIDGE_TIMES];
  if (specificTime) return specificTime;
  
  // Return default time
  return BRIDGE_CONSTANTS.BRIDGE_TIMES.DEFAULT;
}

export function getBridgeFee(amount: number, sourceChain: number, destinationChain: number): number {
  const baseFee = amount * BRIDGE_CONSTANTS.FEE_STRUCTURE.BASE_FEE_RATE;
  
  // Apply complexity multiplier based on chain relationship
  let multiplier = 1.0;
  if (sourceChain !== destinationChain) {
    // This is a simplified logic - in real implementation, you'd check actual chain relationships
    multiplier = BRIDGE_CONSTANTS.FEE_STRUCTURE.COMPLEXITY_MULTIPLIER.CROSS_ROLLUP;
  }
  
  const totalFee = baseFee * multiplier;
  
  // Ensure fee is within limits
  return Math.max(
    BRIDGE_CONSTANTS.FEE_STRUCTURE.MIN_FEE,
    Math.min(totalFee, BRIDGE_CONSTANTS.FEE_STRUCTURE.MAX_FEE)
  );
}

export function isValidBridgeChain(chainId: number): boolean {
  return BRIDGE_CONSTANTS.SUPPORTED_CHAINS.includes(chainId as any);
}

export function getStatusColor(status: BridgeStatus): string {
  return BRIDGE_CONSTANTS.STATUS_COLORS[status] || 'gray';
}

export function getStatusIcon(status: BridgeStatus): string {
  return BRIDGE_CONSTANTS.STATUS_ICONS[status] || '❓';
}
