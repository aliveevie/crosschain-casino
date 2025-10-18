// Nexus SDK Type Definitions

export interface NexusChain {
  id: number;
  name: string;
  icon: string;
  currency: string;
  explorer: string;
  rpcUrl: string;
}

export interface NexusWalletState {
  isConnected: boolean;
  isNexusReady: boolean;
  address: string | undefined;
  chainId: number | undefined;
  error: string | null;
}

export interface NexusTransaction {
  hash: string;
  chainId: number;
  from: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface NexusBridgeConfig {
  sourceChain: NexusChain;
  destinationChain: NexusChain;
  amount: string;
  token?: string;
  recipient?: string;
}

export interface NexusGameBet {
  guess: number;
  amount: string;
  chainId: number;
  player: string;
  timestamp: number;
}

export interface NexusGameResult {
  bet: NexusGameBet;
  roll: number;
  payout: string;
  won: boolean;
  transactionHash: string;
}

export type NexusEventType = 
  | 'WALLET_CONNECTED'
  | 'WALLET_DISCONNECTED'
  | 'CHAIN_CHANGED'
  | 'TRANSACTION_STARTED'
  | 'TRANSACTION_COMPLETED'
  | 'TRANSACTION_FAILED'
  | 'BRIDGE_STARTED'
  | 'BRIDGE_COMPLETED'
  | 'BRIDGE_FAILED';

export interface NexusEvent {
  type: NexusEventType;
  data?: any;
  timestamp: number;
}
