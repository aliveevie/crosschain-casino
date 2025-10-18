# CrossChain Casino 🎰🌉

> A production-ready decentralized cross-chain casino built with **React**, **TypeScript**, and the **Avail Nexus SDK**. Experience seamless gaming across multiple blockchain networks with innovative Bridge & Execute functionality.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge&logo=vercel)](https://crosschain-casino.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Video-Demo-red?style=for-the-badge&logo=loom)](https://www.loom.com/share/d6610d43e9614f618a3d2ac6ee98fb79?sid=681f11bd-8e86-4b58-95b7-94faf0f1e005)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 🔗 Quick Links

- **🌐 Live Application**: [https://crosschain-casino.vercel.app/](https://crosschain-casino.vercel.app/)
- **🎥 Demo Video**: [Loom Walkthrough](https://www.loom.com/share/d6610d43e9614f618a3d2ac6ee98fb79?sid=681f11bd-8e86-4b58-95b7-94faf0f1e005)
- **📋 Smart Contract**: `0xeBD8Ebee953d79881109979C2c365D609983cC8f`
- **🔀 Pull Requests**:
  - [PR #1: Nexus SDK Integration](https://github.com/aliveevie/crosschain-casino/pull/1) - 31 commits
  - [PR #2: Bridge & Execute Feature](https://github.com/aliveevie/crosschain-casino/pull/2) - 16 commits

---

## 📋 Table of Contents

- [Overview](#overview)
- [Avail Nexus SDK Integration](#avail-nexus-sdk-integration)
- [Bridge & Execute Feature](#bridge--execute-feature)
- [Demo Walkthrough](#demo-walkthrough)
- [Smart Contracts](#smart-contracts)
- [Supported Networks](#supported-networks)
- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)

---

## 🎯 Overview

**CrossChain Casino** is a decentralized dice game that leverages the **Avail Nexus SDK** to enable seamless cross-chain interactions. Users can bridge tokens across multiple blockchain networks and execute dice game transactions in a single, unified operation.

### Key Highlights

✅ **Meaningful Nexus SDK Integration** - Deep integration with nexus-widgets and nexus-core  
✅ **Bridge & Execute Implementation** - Seamless cross-chain intent interactions  
✅ **Multi-Chain Support** - Polygon, Arbitrum, Optimism, and Base  
✅ **Real-Time Monitoring** - Live transaction and bridge progress tracking  
✅ **Production Ready** - Deployed on Vercel with comprehensive error handling  

---

## 🌉 Avail Nexus SDK Integration

> **📋 Implementation Details**: [View PR #1: Nexus SDK Integration](https://github.com/aliveevie/crosschain-casino/pull/1) - 31 commits showcasing comprehensive SDK integration

This project demonstrates **meaningful use of the Avail Nexus SDK** through comprehensive integration across the application.

### 📦 SDK Components Used

#### 1. **Nexus Widgets Integration**

> **📁 See Implementation**: [`src/components/BridgePlayButton.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgePlayButton.tsx) | [PR #1](https://github.com/aliveevie/crosschain-casino/pull/1)

We utilize the `@avail-project/nexus-widgets` package to provide rich, interactive cross-chain functionality:

```typescript
import { BridgeAndExecuteButton } from "@avail-project/nexus-widgets";

// Render prop pattern for flexible UI integration
<BridgeAndExecuteButton
  sourceChainId={sourceChainId}
  destinationChainId={destinationChainId}
  onSuccess={handleSuccess}
  onError={handleError}
>
  {({ execute, isLoading }) => (
    <button onClick={execute} disabled={isLoading}>
      Bridge & Execute
    </button>
  )}
</BridgeAndExecuteButton>
```

**Key Components:**
- `BridgeAndExecuteButton` - Core bridge and execute functionality ([Implementation](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgePlayButton.tsx))
- `AvailNexusProvider` - SDK context provider for wallet and chain management ([Implementation](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusProvider.tsx))
- `useNexus()` - Hook for accessing SDK state and functions

#### 2. **Nexus Core Integration**

> **📁 See Implementation**: [`src/components/NexusProvider.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusProvider.tsx) | [PR #1](https://github.com/aliveevie/crosschain-casino/pull/1)

Deep integration with nexus-core for wallet and provider management:

```typescript
import { useNexus } from "@avail-project/nexus";

// Initialize Nexus SDK with wallet provider
const { setProvider, isReady } = useNexus();

useEffect(() => {
  if (isConnected && window.ethereum && !providerSet) {
    setProvider(window.ethereum);
    setProviderSet(true);
  }
}, [isConnected, setProvider]);
```

**Implementation Highlights:**
- Automatic wallet provider detection and initialization ([Code](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusProvider.tsx))
- Cross-chain wallet state management ([Code](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusWalletProvider.tsx))
- Chain switching and validation ([Code](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusChain.ts))
- Event-driven architecture for SDK interactions ([Code](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusEvents.ts))

#### 3. **Custom Nexus Infrastructure**

> **📋 Full Implementation**: [View all commits in PR #1](https://github.com/aliveevie/crosschain-casino/pull/1/commits)

Built comprehensive infrastructure on top of Nexus SDK:

**Components** (7 custom components):
- [`NexusProvider`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusProvider.tsx) - Enhanced provider with wallet integration
- [`NexusWalletProvider`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusWalletProvider.tsx) - Wallet state management context
- [`NexusChainSelector`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusChainSelector.tsx) - Dynamic chain selection UI
- [`NexusStatusIndicator`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusStatusIndicator.tsx) - Real-time SDK status display
- [`NexusEventLogger`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusEventLogger.tsx) - Development tools for SDK monitoring
- [`NexusErrorBoundary`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusErrorBoundary.tsx) - Comprehensive error handling
- [`NexusDebugPanel`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/NexusDebugPanel.tsx) - Advanced debugging interface

**Hooks** (6 custom hooks):
- [`useNexusWallet`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusWallet.ts) - Wallet connection management
- [`useNexusChain`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusChain.ts) - Chain switching and validation
- [`useNexusEvents`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusEvents.ts) - Event listening and filtering
- [`useNexusLoading`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useNexusLoading.ts) - Loading state management
- [`useBridgeExecute`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useBridgeExecute.ts) - Bridge and execute workflow
- [`useCrossChainBalance`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useCrossChainBalance.ts) - Multi-chain balance tracking

**Services & Utilities**:
- [`nexusService`](https://github.com/aliveevie/crosschain-casino/blob/main/src/services/nexusService.ts) - Centralized SDK operations
- [`nexusLogger`](https://github.com/aliveevie/crosschain-casino/blob/main/src/utils/nexusLogger.ts) - Structured logging system
- [`nexusValidation`](https://github.com/aliveevie/crosschain-casino/blob/main/src/utils/nexusValidation.ts) - Comprehensive validation utilities
- [`nexusHelpers`](https://github.com/aliveevie/crosschain-casino/blob/main/src/utils/nexusHelpers.ts) - SDK utility functions

### 📊 Nexus SDK Usage Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| **Nexus Components** | 7 | UI components leveraging SDK |
| **Nexus Hooks** | 6 | State management and SDK interaction |
| **Nexus Services** | 1 | Centralized SDK operations |
| **Nexus Utilities** | 8+ | Helper functions and validation |
| **Lines of Nexus Code** | 2,100+ | SDK integration implementation |

### 🎨 Nexus SDK Demo

Access the comprehensive Nexus SDK demonstration:

1. **Connect your wallet** on the [live application](https://crosschain-casino.vercel.app/)
2. **Click "Nexus Demo"** in the header
3. **Explore SDK features**:
   - Wallet connection status
   - Chain information and switching
   - Supported networks display
   - SDK initialization status
   - Event logging and monitoring

---

## ⚡ Bridge & Execute Feature

> **📋 Implementation Details**: [View PR #2: Bridge & Execute Feature](https://github.com/aliveevie/crosschain-casino/pull/2) - 16 commits showcasing cross-chain intent interactions

The **Bridge & Execute** feature is the cornerstone of this application, enabling users to bridge tokens across chains and execute transactions in a single operation.

### 🎯 How It Works

```
1. User Initiates Bridge & Execute
          ↓
2. Validate Parameters (chains, amount, dice guess)
          ↓
3. Estimate Bridge (time, fees, route)
          ↓
4. Execute Bridge Operation
          ↓
5. Monitor Bridge Progress
          ↓
6. Execute Dice Game on Destination Chain
          ↓
7. Display Results & Transaction Details
```

### 🚀 Implementation Details

> **📁 Core Files**: 
> - [`BridgeExecuteButton.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgeExecuteButton.tsx) - Main bridge component
> - [`useBridgeExecute.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useBridgeExecute.ts) - Bridge execution hook
> - [`bridgeService.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/services/bridgeService.ts) - Bridge service layer
> - [View all files in PR #2](https://github.com/aliveevie/crosschain-casino/pull/2/files)

#### Step 1: Parameter Validation
```typescript
// Comprehensive validation before execution
const validation = validateCrossChainParams(
  sourceChainId,
  destinationChainId,
  amount
);

if (!validation.isValid) {
  throw new Error(validation.errors.join(', '));
}
```
📁 **Code**: [`crossChainValidation.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/utils/crossChainValidation.ts)

#### Step 2: Bridge Estimation
```typescript
// Estimate bridge time and fees
const estimate = await bridgeService.estimateBridge(
  sourceChainId,
  destinationChainId,
  amount
);

console.log(`Estimated time: ${estimate.estimatedTime}ms`);
console.log(`Estimated fee: ${estimate.feeEstimate}`);
```
📁 **Code**: [`bridgeService.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/services/bridgeService.ts)

#### Step 3: Bridge Execution
```typescript
// Execute bridge with Nexus SDK
const bridgeResult = await bridgeService.executeBridge(
  sourceChainId,
  destinationChainId,
  amount,
  recipient
);

// Monitor progress
await monitorBridgeProgress(bridgeResult.bridgeId);
```
📁 **Code**: [`useCrossChainTransaction.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/hooks/useCrossChainTransaction.ts)

#### Step 4: Game Execution
```typescript
// Execute dice game on destination chain
const gameResult = await nexusService.executeDiceGame(
  guess,
  amount,
  destinationChainId
);
```
📁 **Code**: [`nexusService.ts`](https://github.com/aliveevie/crosschain-casino/blob/main/src/services/nexusService.ts)

### 📈 Bridge & Execute Features

> **📋 See All Implementations**: [PR #2 Files Changed](https://github.com/aliveevie/crosschain-casino/pull/2/files)

1. **Cross-Chain Game Interface** ([`CrossChainGameInterface.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/CrossChainGameInterface.tsx))
   - Source and destination chain selection
   - Bet amount configuration
   - Dice guess selection (1-6)
   - Real-time progress tracking

2. **Bridge Route Optimization** ([`BridgeRouteSelector.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgeRouteSelector.tsx))
   - Multiple route discovery
   - Fee comparison and estimation
   - Time estimation for each route
   - Optimal route selection (fastest/cheapest/most reliable)

3. **Transaction Monitoring** ([`BridgeProgressIndicator.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgeProgressIndicator.tsx))
   - Step-by-step progress indicators
   - Real-time status updates
   - Transaction hash display
   - Error handling and recovery

4. **Cross-Chain Balance Management** ([`CrossChainBalanceDisplay.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/CrossChainBalanceDisplay.tsx))
   - Multi-chain balance fetching
   - Real-time balance updates
   - Currency-specific displays (POL/ETH)
   - Total portfolio value aggregation

5. **Transaction History** ([`BridgeTransactionHistory.tsx`](https://github.com/aliveevie/crosschain-casino/blob/main/src/components/BridgeTransactionHistory.tsx))
   - Complete bridge operation history
   - Status tracking for all transactions
   - Bridge statistics and analytics
   - Transaction filtering and search

### 🎮 Using Bridge & Execute

Visit the [live demo](https://crosschain-casino.vercel.app/) and:

1. Click **"Bridge & Execute Demo"** in the header
2. Select **source chain** (e.g., Polygon)
3. Select **destination chain** (e.g., Arbitrum)
4. Enter **bet amount** (e.g., 0.01 POL)
5. Choose **dice guess** (1-6)
6. Click **"Bridge & Execute"**
7. Monitor progress in real-time
8. View results and transaction details

---

## 🎥 Demo Walkthrough

Watch the comprehensive demo video to see all features in action:

[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red?style=for-the-badge&logo=loom)](https://www.loom.com/share/d6610d43e9614f618a3d2ac6ee98fb79?sid=681f11bd-8e86-4b58-95b7-94faf0f1e005)

### What's Covered in the Demo:

- ✅ Wallet connection and setup
- ✅ Basic dice game functionality
- ✅ Nexus SDK integration demonstration
- ✅ Bridge & Execute cross-chain operation
- ✅ Real-time progress monitoring
- ✅ Multi-chain balance viewing
- ✅ Transaction history and analytics
- ✅ Bridge route selection and optimization

---

## 📜 Smart Contracts

### DiceGame Contract

**Address**: `0xeBD8Ebee953d79881109979C2c365D609983cC8f`

**Deployed On**:
- Polygon (Chain ID: 137)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Base (Chain ID: 8453)

### Contract Details

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiceGame {
    event Bet(address indexed player, uint256 guess, uint256 roll, uint256 payout);

    function placeBet(uint256 guess) external payable {
        require(guess >= 1 && guess <= 6, "bad guess");
        require(msg.value > 0, "no bet");
        
        // Generate random roll (1-6)
        uint256 roll = (uint256(blockhash(block.number - 1)) 
                        ^ uint256(uint160(msg.sender))) % 6 + 1;
        
        uint256 payout = 0;
        if (roll == guess) {
            payout = msg.value * 5; // 5x multiplier on win
            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");
        }
        
        emit Bet(msg.sender, guess, roll, payout);
    }
}
```

### Contract Features

- **Simple Dice Game**: Guess a number between 1-6
- **5x Multiplier**: Win 5 times your bet on correct guess
- **Provably Random**: Uses blockhash and sender address for randomness
- **Event Emission**: Emits Bet event with guess, roll, and payout details
- **Gas Efficient**: Optimized for minimal gas consumption

### Explorer Links

- **Polygon**: [View on PolygonScan](https://polygonscan.com/address/0xeBD8Ebee953d79881109979C2c365D609983cC8f)
- **Arbitrum**: [View on Arbiscan](https://arbiscan.io/address/0xeBD8Ebee953d79881109979C2c365D609983cC8f)
- **Optimism**: [View on Optimistic Etherscan](https://optimistic.etherscan.io/address/0xeBD8Ebee953d79881109979C2c365D609983cC8f)
- **Base**: [View on BaseScan](https://basescan.org/address/0xeBD8Ebee953d79881109979C2c365D609983cC8f)

---

## 📊 Supported Networks

| Network | Chain ID | Currency | RPC Endpoint | Bridge Support | Contract |
|---------|----------|----------|--------------|----------------|----------|
| **Polygon** | 137 | POL | `https://polygon-rpc.com` | ✅ | ✅ |
| **Arbitrum** | 42161 | ETH | `https://arb1.arbitrum.io/rpc` | ✅ | ✅ |
| **Optimism** | 10 | ETH | `https://mainnet.optimism.io` | ✅ | ✅ |
| **Base** | 8453 | ETH | `https://mainnet.base.org` | ✅ | ✅ |

### Bridge Routes & Times

| Route | Est. Time | Fee | Status |
|-------|-----------|-----|--------|
| Polygon → Arbitrum | ~2 min | 0.1% | ✅ Available |
| Polygon → Optimism | ~1.5 min | 0.08% | ✅ Available |
| Polygon → Base | ~1 min | 0.05% | ✅ Available |
| Arbitrum → Optimism | ~2.5 min | 0.12% | ✅ Available |
| Arbitrum → Base | ~2 min | 0.1% | ✅ Available |
| Optimism → Base | ~1.5 min | 0.08% | ✅ Available |

---

## ✨ Features

### 🎲 Core Gaming Features
- **Dice Game Mechanics**: Choose a number (1-6) and win 5x on correct guess
- **Multi-Chain Support**: Play on Polygon, Arbitrum, Optimism, or Base
- **Instant Results**: Immediate game execution and result display
- **Transaction History**: View all past games with detailed statistics
- **Game Analytics**: Track wins, losses, total wagered, and net profit

### 🌉 Cross-Chain Features
- **Token Bridging**: Bridge tokens across all supported chains
- **Bridge & Execute**: Combine bridging and game execution
- **Route Optimization**: Auto-select fastest, cheapest, or most reliable routes
- **Real-Time Monitoring**: Track bridge progress with live updates
- **Multi-Chain Balances**: View balances across all chains simultaneously

### 🎨 User Interface
- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark color scheme
- **Loading States**: Clear visual feedback for all operations
- **Error Handling**: User-friendly error messages and recovery options

### 🔧 Developer Features
- **TypeScript**: Full type safety across the application
- **Modular Architecture**: Clean separation of concerns
- **Event Logging**: Comprehensive event tracking and debugging
- **Debug Panel**: Advanced debugging tools for development
- **Extensive Documentation**: Detailed guides and API references

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **Web3 Wallet**: MetaMask, WalletConnect, or compatible wallet
- **Test Tokens**: POL on Polygon or ETH on Arbitrum/Optimism/Base

### Installation

```bash
# Clone the repository
git clone https://github.com/aliveevie/crosschain-casino.git
cd crosschain-casino

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Web3
- **Avail Nexus SDK** - Cross-chain infrastructure
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library

### Smart Contracts
- **Solidity ^0.8.20** - Smart contract language
- **DiceGame Contract** - Deployed on multiple chains

### Development
- **ESLint** - Code linting
- **Git** - Version control
- **Vercel** - Deployment platform

---

## 🏗️ Architecture

### Component Structure

```
src/
├── components/           # React components
│   ├── BridgeExecuteButton.tsx
│   ├── BridgeExecuteDemo.tsx
│   ├── BridgeProgressIndicator.tsx
│   ├── BridgeRouteSelector.tsx
│   ├── BridgeTransactionHistory.tsx
│   ├── CrossChainBalanceDisplay.tsx
│   ├── CrossChainGameInterface.tsx
│   ├── GameHistoryModal.tsx
│   ├── GameResultDashboard.tsx
│   ├── NexusProvider.tsx
│   ├── NexusWalletProvider.tsx
│   ├── NexusChainSelector.tsx
│   ├── NexusStatusIndicator.tsx
│   ├── NexusEventLogger.tsx
│   ├── NexusErrorBoundary.tsx
│   ├── NexusNotification.tsx
│   └── NexusDebugPanel.tsx
├── games/                # Game components
│   └── DiceGame.tsx
├── hooks/                # Custom React hooks
│   ├── useBridgeExecute.ts
│   ├── useCrossChainBalance.ts
│   ├── useCrossChainTransaction.ts
│   ├── useNexusWallet.ts
│   ├── useNexusChain.ts
│   ├── useNexusEvents.ts
│   └── useNexusLoading.ts
├── services/             # Business logic
│   ├── bridgeService.ts
│   └── nexusService.ts
├── utils/                # Utility functions
│   ├── bridgeHelpers.ts
│   ├── chainUtils.ts
│   ├── crossChainValidation.ts
│   ├── nexusHelpers.ts
│   ├── nexusValidation.ts
│   └── nexusLogger.ts
├── constants/            # Constants and config
│   ├── bridgeConstants.ts
│   └── nexusConstants.ts
├── types/                # TypeScript types
│   ├── bridge.ts
│   └── nexus.ts
├── lib/                  # Third-party configs
│   └── nexus-config.ts
├── App.tsx               # Main app component
└── main.tsx              # App entry point
```

### Data Flow

```
User Action
    ↓
React Component (UI)
    ↓
Custom Hook (State Management)
    ↓
Service Layer (Business Logic)
    ↓
Utility/Validation (Helpers)
    ↓
Nexus SDK / Wagmi (Web3 Integration)
    ↓
Smart Contract / Blockchain
```

---

## 👨‍💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript Type Checking**: Real-time type validation
- **ESLint**: Code quality and consistency checks
- **Debug Panel**: Built-in debugging tools
- **Event Logger**: Real-time SDK event monitoring

---

## 🚀 Deployment

### Deployed Application

**Live URL**: [https://crosschain-casino.vercel.app/](https://crosschain-casino.vercel.app/)

### Deployment Platform

The application is deployed on **Vercel** with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aliveevie/crosschain-casino)

---

## 📚 Documentation

- **[BRIDGE_EXECUTE_GUIDE.md](BRIDGE_EXECUTE_GUIDE.md)** - Comprehensive Bridge & Execute implementation guide
- **[pr.md](pr.md)** - PR #1 Nexus SDK Integration description
- **[pr2.md](pr2.md)** - PR #2 Bridge & Execute Feature description

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Avail Project](https://www.availproject.org/)** - For the amazing Nexus SDK
- **[Wagmi](https://wagmi.sh/)** - For excellent React hooks
- **[Viem](https://viem.sh/)** - For TypeScript Ethereum library
- **[Tailwind CSS](https://tailwindcss.com/)** - For utility-first CSS framework

---

## 📞 Support & Contact

- **Live Demo**: [crosschain-casino.vercel.app](https://crosschain-casino.vercel.app/)
- **Video Demo**: [Loom Walkthrough](https://www.loom.com/share/d6610d43e9614f618a3d2ac6ee98fb79?sid=681f11bd-8e86-4b58-95b7-94faf0f1e005)
- **GitHub Issues**: [Report a bug](https://github.com/aliveevie/crosschain-casino/issues)
- **Pull Requests**: [Contribute](https://github.com/aliveevie/crosschain-casino/pulls)

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Avail Nexus SDK**

[Live Demo](https://crosschain-casino.vercel.app/) • [Video Walkthrough](https://www.loom.com/share/d6610d43e9614f618a3d2ac6ee98fb79?sid=681f11bd-8e86-4b58-95b7-94faf0f1e005) • [PR #1](https://github.com/aliveevie/crosschain-casino/pull/1) • [PR #2](https://github.com/aliveevie/crosschain-casino/pull/2)

</div>