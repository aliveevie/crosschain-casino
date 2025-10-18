// Nexus SDK Constants

export const NEXUS_CONSTANTS = {
  // Event types
  EVENTS: {
    WALLET_CONNECTED: 'WALLET_CONNECTED',
    WALLET_DISCONNECTED: 'WALLET_DISCONNECTED',
    CHAIN_CHANGED: 'CHAIN_CHANGED',
    TRANSACTION_STARTED: 'TRANSACTION_STARTED',
    TRANSACTION_COMPLETED: 'TRANSACTION_COMPLETED',
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',
    BRIDGE_STARTED: 'BRIDGE_STARTED',
    BRIDGE_COMPLETED: 'BRIDGE_COMPLETED',
    BRIDGE_FAILED: 'BRIDGE_FAILED',
  } as const,

  // Chain IDs
  CHAIN_IDS: {
    ETHEREUM: 1,
    POLYGON: 137,
    ARBITRUM: 42161,
    OPTIMISM: 10,
    BASE: 8453,
  } as const,

  // Gas limits for different operations
  GAS_LIMITS: {
    BRIDGE: 50000,
    EXECUTE: 100000,
    BRIDGE_AND_EXECUTE: 150000,
    DICE_GAME: 200000,
  } as const,

  // Timeouts in milliseconds
  TIMEOUTS: {
    TRANSACTION: 30000, // 30 seconds
    BRIDGE: 60000, // 1 minute
    WALLET_CONNECTION: 10000, // 10 seconds
    CHAIN_SWITCH: 15000, // 15 seconds
  } as const,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 2000, // 2 seconds
    BACKOFF_MULTIPLIER: 2,
  } as const,

  // UI Constants
  UI: {
    NOTIFICATION_DURATION: 5000, // 5 seconds
    MODAL_ANIMATION_DURATION: 300, // 300ms
    LOADING_SPINNER_SIZE: 24,
    CHAIN_SELECTOR_MAX_HEIGHT: 200,
  } as const,

  // Error messages
  ERROR_MESSAGES: {
    WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
    UNSUPPORTED_CHAIN: 'This chain is not supported by Nexus SDK',
    TRANSACTION_FAILED: 'Transaction failed. Please try again',
    BRIDGE_FAILED: 'Bridge operation failed. Please try again',
    INSUFFICIENT_FUNDS: 'Insufficient funds for this operation',
    NETWORK_ERROR: 'Network error. Please check your connection',
    INVALID_AMOUNT: 'Please enter a valid amount',
    INVALID_DICE_GUESS: 'Dice guess must be between 1 and 6',
  } as const,

  // Success messages
  SUCCESS_MESSAGES: {
    WALLET_CONNECTED: 'Wallet connected successfully',
    TRANSACTION_SUCCESS: 'Transaction completed successfully',
    BRIDGE_SUCCESS: 'Bridge operation completed successfully',
    CHAIN_SWITCHED: 'Network switched successfully',
  } as const,
} as const;

export type NexusEventType = typeof NEXUS_CONSTANTS.EVENTS[keyof typeof NEXUS_CONSTANTS.EVENTS];
export type ChainId = typeof NEXUS_CONSTANTS.CHAIN_IDS[keyof typeof NEXUS_CONSTANTS.CHAIN_IDS];
