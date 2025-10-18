import { polygon, arbitrum, optimism, base } from "wagmi/chains";

// Nexus SDK Configuration
export const NEXUS_CONFIG = {
  // Supported chains for cross-chain operations
  supportedChains: [
    {
      chain: polygon,
      name: "Polygon",
      icon: "🟣",
      currency: "POL",
      explorer: "https://polygonscan.com",
    },
    {
      chain: arbitrum,
      name: "Arbitrum", 
      icon: "🔵",
      currency: "ETH",
      explorer: "https://arbiscan.io",
    },
    {
      chain: optimism,
      name: "Optimism",
      icon: "🔴", 
      currency: "ETH",
      explorer: "https://optimistic.etherscan.io",
    },
    {
      chain: base,
      name: "Base",
      icon: "🔷",
      currency: "ETH", 
      explorer: "https://basescan.org",
    },
  ],
  
  // Contract configuration
  contract: {
    address: "0xeBD8Ebee953d79881109979C2c365D609983cC8f" as const,
    abi: [
      {
        type: "function",
        name: "placeBet",
        stateMutability: "payable",
        inputs: [{ name: "guess", type: "uint256" }],
        outputs: [],
      },
      {
        type: "event",
        name: "Bet",
        inputs: [
          { name: "player", type: "address", indexed: true },
          { name: "guess", type: "uint256", indexed: false },
          { name: "roll", type: "uint256", indexed: false },
          { name: "payout", type: "uint256", indexed: false },
        ],
      },
    ] as const,
  },
  
  // Nexus SDK specific settings
  nexus: {
    // RPC endpoints for different chains
    rpcEndpoints: {
      [polygon.id]: "https://polygon-rpc.com",
      [arbitrum.id]: "https://arb1.arbitrum.io/rpc",
      [optimism.id]: "https://mainnet.optimism.io",
      [base.id]: "https://mainnet.base.org",
    },
    
    // Bridge configuration
    bridgeConfig: {
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      gasMultiplier: 1.2,
    },
  },
} as const;

export type SupportedChain = typeof NEXUS_CONFIG.supportedChains[number];
export type ChainId = typeof NEXUS_CONFIG.supportedChains[number]["chain"]["id"];
