import { type ChainId } from "../lib/nexus-config";

export interface BridgeTransaction {
  id: string;
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  token: string;
  recipient: string;
  status: BridgeStatus;
  txHash?: string;
  timestamp: number;
  estimatedTime?: number;
  actualTime?: number;
  fee?: string;
  gasUsed?: string;
  blockNumber?: number;
  confirmationCount?: number;
}

export interface BridgeRoute {
  sourceChain: ChainId;
  destinationChain: ChainId;
  estimatedTime: number;
  estimatedFee: string;
  isAvailable: boolean;
  routeId: string;
  priority: RoutePriority;
  gasEstimate: number;
  slippageTolerance: number;
}

export interface BridgeQuote {
  inputAmount: string;
  outputAmount: string;
  fee: string;
  estimatedTime: number;
  route: BridgeRoute;
  expiry: number;
  slippage: number;
  minimumReceived: string;
  priceImpact: number;
}

export interface BridgeEstimate {
  estimatedTime: number;
  gasEstimate: number;
  feeEstimate: string;
  canBridge: boolean;
  error?: string;
  warnings?: string[];
  routeOptions: BridgeRoute[];
  recommendedRoute: BridgeRoute;
}

export interface CrossChainBalance {
  chainId: ChainId;
  chainName: string;
  balance: string;
  currency: string;
  isLoading: boolean;
  error?: string;
  lastUpdated: number;
  usdValue?: number;
  change24h?: number;
}

export interface BridgeOperation {
  id: string;
  type: BridgeOperationType;
  status: BridgeStatus;
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  token: string;
  recipient: string;
  txHash?: string;
  startTime: number;
  endTime?: number;
  estimatedTime: number;
  progress: number;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface BridgeConfig {
  slippageTolerance: number;
  deadline: number;
  maxRetries: number;
  timeout: number;
  autoRetry: boolean;
  notifications: boolean;
  defaultRoute: RoutePriority;
}

export interface BridgeStats {
  totalBridges: number;
  completedBridges: number;
  failedBridges: number;
  pendingBridges: number;
  averageBridgeTime: number;
  totalVolume: string;
  totalFees: string;
  successRate: number;
  lastBridgeTime?: number;
}

export interface BridgeEvent {
  type: BridgeEventType;
  bridgeId: string;
  timestamp: number;
  data: Record<string, any>;
  chainId?: ChainId;
  txHash?: string;
  error?: string;
}

export interface BridgeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
  estimatedCost: string;
  estimatedTime: number;
}

// Enums and Union Types
export type BridgeStatus = 'pending' | 'bridging' | 'completed' | 'failed' | 'cancelled';
export type BridgeOperationType = 'bridge' | 'bridge_and_execute' | 'estimate' | 'quote';
export type RoutePriority = 'fastest' | 'cheapest' | 'most_reliable' | 'least_congested';
export type BridgeEventType = 
  | 'bridge_started'
  | 'bridge_progress'
  | 'bridge_completed'
  | 'bridge_failed'
  | 'bridge_cancelled'
  | 'quote_generated'
  | 'route_selected'
  | 'balance_updated'
  | 'validation_failed'
  | 'retry_attempted'
  | 'timeout_reached';

// Utility Types
export interface BridgeContextType {
  transactions: BridgeTransaction[];
  activeOperations: BridgeOperation[];
  balances: CrossChainBalance[];
  config: BridgeConfig;
  stats: BridgeStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  executeBridge: (params: BridgeParams) => Promise<BridgeResult>;
  cancelBridge: (bridgeId: string) => Promise<boolean>;
  retryBridge: (bridgeId: string) => Promise<BridgeResult>;
  updateConfig: (config: Partial<BridgeConfig>) => void;
  refreshBalances: () => Promise<void>;
  getQuote: (params: QuoteParams) => Promise<BridgeQuote>;
  validateBridge: (params: BridgeParams) => BridgeValidation;
}

export interface BridgeParams {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  recipient?: string;
  token?: string;
  slippage?: number;
  deadline?: number;
}

export interface QuoteParams {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  token?: string;
  slippage?: number;
}

export interface BridgeResult {
  success: boolean;
  bridgeId?: string;
  txHash?: string;
  error?: string;
  estimatedTime?: number;
}

// Hook Return Types
export interface UseBridgeExecuteReturn {
  isProcessing: boolean;
  currentStep: BridgeStep;
  progress: number;
  error: string | null;
  txHash: string | null;
  bridgeId: string | null;
  estimatedTime: number;
  startTime: number | null;
  
  executeBridgeAndExecute: (params: BridgeParams & { guess: number }) => Promise<void>;
  cancelTransaction: () => Promise<void>;
  resetState: () => void;
  getEstimatedTimeRemaining: () => number;
  getProgressPercentage: () => number;
  isConnected: boolean;
  canExecute: boolean;
}

export interface UseCrossChainBalanceReturn {
  balances: CrossChainBalance[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  fetchAllBalances: () => Promise<void>;
  refreshBalances: () => void;
  getBalanceForChain: (chainId: ChainId) => CrossChainBalance | null;
  hasSufficientBalance: (chainId: ChainId, amount: string) => boolean;
  getTotalBalanceInCurrency: (currency: 'POL' | 'ETH') => number;
  isConnected: boolean;
  canFetchBalances: boolean;
}

export interface UseCrossChainTransactionReturn {
  isProcessing: boolean;
  currentStep: BridgeStep;
  progress: number;
  error: string | null;
  txHash: string | null;
  bridgeId: string | null;
  estimatedTime: number;
  startTime: number | null;
  
  executeTransaction: (params: TransactionParams) => Promise<void>;
  cancelTransaction: () => Promise<void>;
  resetState: () => void;
  getEstimatedTimeRemaining: () => number;
  getProgressPercentage: () => number;
  isConnected: boolean;
  canExecute: boolean;
}

export type BridgeStep = 'idle' | 'validating' | 'bridging' | 'executing' | 'completed' | 'failed';

export interface TransactionParams {
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  recipient: string;
  token?: string;
}
