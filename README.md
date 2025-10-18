# CrossChain Casino 🎰

A decentralized cross-chain casino built with React, TypeScript, and the Avail Nexus SDK. Experience seamless gaming across multiple blockchain networks with our innovative Bridge & Execute functionality.

## 🌉 Bridge & Execute Feature

This project showcases the powerful **Bridge & Execute** capability of the Avail Nexus SDK, allowing users to:

- **Bridge tokens** across multiple chains (Polygon, Arbitrum, Optimism, Base)
- **Execute dice games** immediately after bridging
- **Monitor transactions** in real-time with progress tracking
- **View cross-chain balances** across all supported networks
- **Track transaction history** with detailed analytics

### Key Features

- 🎲 **Cross-Chain Dice Gaming**: Play dice games on any supported chain
- 🌉 **Seamless Bridging**: Bridge tokens with optimal routes and competitive fees
- ⚡ **Bridge & Execute**: Execute transactions immediately after bridging
- 📊 **Real-time Tracking**: Monitor bridge operations with detailed progress
- 💰 **Multi-Chain Balances**: View balances across all supported networks
- 📈 **Transaction Analytics**: Comprehensive history and statistics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crosschain-casino.git
cd crosschain-casino

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem
- **Cross-Chain**: Avail Nexus SDK
- **Smart Contracts**: Recipient Solidity
- **Chains**: Polygon, Arbitrum, Optimism, Base

## 🌉 Avail Nexus SDK Integration

This project demonstrates meaningful use of the Avail Nexus SDK through:

### 1. Nexus Core Integration
- **Wallet Connection**: Seamless wallet integration across chains
- **Chain Management**: Dynamic chain switching and validation
- **Provider Management**: Automatic provider detection and setup

### 2. Bridge & Execute Implementation
- **Cross-Chain Transactions**: Bridge tokens between supported networks
- **Transaction Execution**: Execute smart contract calls after bridging
- **Progress Tracking**: Real-time monitoring of bridge operations
- **Route Optimization**: Automatic selection of optimal bridge routes

### 3. Nexus Widgets Usage
- **BridgeAndExecuteButton**: Render prop component for bridge operations
- **Chain Selectors**: Dynamic chain selection interfaces
- **Status Indicators**: Real-time bridge and transaction status

## 🎮 How to Play

### Basic Dice Game
1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Select Chain**: Choose your preferred network
3. **Place Bet**: Enter amount and select dice number (1-6)
4. **Roll Dice**: Click "Play" to execute your bet
5. **Win Big**: Correct guesses win 5x your bet amount!

### Cross-Chain Gaming
1. **Open Bridge Demo**: Click "Bridge & Execute" in the header
2. **Select Routes**: Choose source and destination chains
3. **Configure Game**: Set bet amount and dice guess
4. **Bridge & Play**: Execute cross-chain bridge and dice game
5. **Monitor Progress**: Track your transaction in real-time

## 📊 Supported Networks

| Network | Chain ID | Currency | Bridge Support |
|---------|----------|----------|----------------|
| Polygon | 137 | POL | ✅ |
| Arbitrum | 42161 | ETH | ✅ |
| Optimism | 10 | ETH | ✅ |
| Base | 8453 | ETH | ✅ |

## 🔧 Smart Contract

**Contract Address**: `0xeBD8Ebee953d79881109979C2c365D609983cC8f`

### Functions
- `placeBet(uint8 guess)`: Place a dice bet with your guess (1-6)
- `getBalance()`: Check contract balance
- `withdraw()`: Withdraw contract funds (owner only)

### Events
- `Bet(address indexed player, uint8 guess, uint8 result, uint256 amount, bool won)`

## 🌉 Bridge & Execute Demo

The Bridge & Execute demo showcases:

### Cross-Chain Game Interface
- **Chain Selection**: Choose source and destination networks
- **Game Configuration**: Set bet amounts and dice guesses
- **Bridge Execution**: Seamless token bridging with progress tracking
- **Result Display**: Comprehensive transaction and game results

### Bridge Route Optimization
- **Route Selection**: Choose optimal bridge routes
- **Fee Calculation**: Real-time fee estimation
- **Time Estimation**: Bridge time predictions
- **Route Comparison**: Compare different bridge options

### Transaction Monitoring
- **Real-time Progress**: Live updates on bridge operations
- **Status Tracking**: Detailed transaction status monitoring
- **Error Handling**: Comprehensive error reporting and recovery
- **History Analytics**: Complete transaction history and statistics

## 📱 Features

### Core Gaming
- 🎲 Dice game with 1-6 number selection
- 💰 5x multiplier for correct guesses
- 🔄 Instant game execution
- 📊 Real-time game results

### Cross-Chain Capabilities
- 🌉 Multi-chain token bridging
- ⚡ Bridge & Execute operations
- 📈 Cross-chain balance monitoring
- 🛣️ Optimal route selection

### User Experience
- 🎨 Modern, responsive UI design
- 📱 Mobile-friendly interface
- 🔔 Real-time notifications
- 📊 Comprehensive analytics

### Developer Features
- 🔧 TypeScript for type safety
- 🧪 Comprehensive error handling
- 📝 Detailed logging and monitoring
- 🔄 Hot reload development

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
```

### Manual Deployment
```bash
# Build the project
npm run build

# Serve the dist folder with any static file server
```

## 🔒 Security

- ✅ Smart contract audited
- ✅ Input validation and sanitization
- ✅ Rate limiting and spam protection
- ✅ Secure random number generation
- ✅ Comprehensive error handling

## 📈 Analytics & Monitoring

The application includes comprehensive analytics:

- **Game Statistics**: Win/loss ratios, total wagered amounts
- **Bridge Analytics**: Success rates, average bridge times
- **User Analytics**: Active users, transaction volumes
- **Performance Metrics**: Load times, error rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Avail Nexus SDK** for cross-chain infrastructure
- **Wagmi** for Web3 React hooks
- **Viem** for Ethereum library
- **Tailwind CSS** for styling
- **React** for the frontend framework

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/your-username/crosschain-casino/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/crosschain-casino/issues)
- **Discord**: [Community Discord](https://discord.gg/your-discord)

---

Built with ❤️ using React, TypeScript, and Avail Nexus SDK