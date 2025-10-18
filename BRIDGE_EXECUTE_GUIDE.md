# Bridge & Execute Implementation Guide 🌉

This guide provides comprehensive documentation on how the Bridge & Execute feature is implemented in the CrossChain Casino application using the Avail Nexus SDK.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

The Bridge & Execute feature enables users to:

1. **Bridge tokens** from one chain to another
2. **Execute smart contract calls** immediately after bridging
3. **Monitor progress** in real-time
4. **Handle errors** gracefully with retry mechanisms

### Key Benefits

- ✅ **Single Transaction Flow**: Bridge and execute in one operation
- ✅ **Optimal Route Selection**: Automatically choose the best bridge route
- ✅ **Real-time Monitoring**: Track progress with detailed status updates
- ✅ **Multi-chain Support**: Works across Polygon, Arbitrum, Optimism, and Base
- ✅ **Error Recovery**: Comprehensive error handling and retry logic

## Architecture

### Component Hierarchy

```
App
├── NexusProvider (SDK initialization)
│   └── BridgeExecuteDemo (Main demo interface)
│       ├── CrossChainGameInterface (Game + Bridge UI)
│       │   ├── BridgeExecuteButton (Execute component)
│       │   └── BridgeProgressIndicator (Progress tracking)
│       ├── BridgeRouteSelector (Route selection)
│       ├── CrossChainBalanceDisplay (Balance monitoring)
│       └── BridgeTransactionHistory (Transaction tracking)
```

### Data Flow

```
User Action
    ↓
BridgeExecuteButton (Validation)
    ↓
useBridgeExecute Hook (State management)
    ↓
bridgeService (Business logic)
    ↓
Nexus SDK (Cross-chain execution)
    ↓
Blockchain Networks
```

## Core Components

### 1. BridgeExecuteButton

**Purpose**: Render prop component that handles bridge and execute operations.

**Location**: `src/components/BridgeExecuteButton.tsx`

**Key Features**:
- Parameter validation
- Progress tracking
- Event emission
- Error handling
- Loading states

**Usage**:
```typescript
<BridgeExecuteButton
  sourceChainId={137}
  destinationChainId={42161}
  amount="0.01"
  guess={3}
  onSuccess={(txHash) => console.log('Success:', txHash)}
  onError={(error) => console.error('Error:', error)}
/>
```

### 2. useBridgeExecute Hook

**Purpose**: Manage bridge and execute workflow with multi-step process tracking.

**Location**: `src/hooks/useBridgeExecute.ts`

**State Management**:
```typescript
{
  isProcessing: boolean,
  currentStep: 'idle' | 'validating' | 'bridging' | 'executing' | 'completed' | 'failed',
  progress: number,
  error: string | null,
  txHash: string | null
}
```

**Usage**:
```typescript
const {
  isProcessing,
  currentStep,
  progress,
  executeBridgeAndExecute,
  cancelOperation
} = useBridgeExecute();

// Execute bridge and dice game
await executeBridgeAndExecute({
  sourceChainId: 137,
  destinationChainId: 42161,
  amount: "0.01",
  guess: 3
});
```

### 3. BridgeService

**Purpose**: Singleton service for managing all bridge operations.

**Location**: `src/services/bridgeService.ts`

**Key Methods**:
- `estimateBridge()`: Calculate bridge time and fees
- `executeBridge()`: Execute bridge operation
- `getBridgeStatus()`: Check operation status
- `cancelBridge()`: Cancel ongoing bridge
- `getBridgeStats()`: Get bridge statistics

**Usage**:
```typescript
import { bridgeService } from './services/bridgeService';

// Estimate bridge operation
const estimate = await bridgeService.estimateBridge(
  sourceChain,
  destinationChain,
  amount
);

// Execute bridge
const result = await bridgeService.executeBridge(
  sourceChain,
  destinationChain,
  amount,
  recipient
);
```

### 4. BridgeProgressIndicator

**Purpose**: Visual component for displaying bridge progress.

**Location**: `src/components/BridgeProgressIndicator.tsx`

**Features**:
- Step-by-step progress display
- Progress bar with animations
- Error and success states
- Transaction details

### 5. CrossChainGameInterface

**Purpose**: Complete interface for cross-chain dice gaming.

**Location**: `src/components/CrossChainGameInterface.tsx`

**Features**:
- Chain selection (source and destination)
- Game configuration (amount and dice guess)
- Bridge execution with progress tracking
- Result display with transaction details

## Implementation Details

### Step 1: Validation

```typescript
// Validate cross-chain parameters
const validation = validateCrossChainParams(
  sourceChainId,
  destinationChainId,
  amount
);

if (!validation.isValid) {
  throw new Error(validation.errors.join(', '));
}

// Validate dice guess
if (!validateDiceGuess(guess)) {
  throw new Error('Invalid dice guess');
}
```

### Step 2: Bridge Preparation

```typescript
// Estimate bridge operation
const estimate = await bridgeService.estimateBridge(
  sourceChainId,
  destinationChainId,
  amount
);

// Check if bridge is possible
if (!estimate.canBridge) {
  throw new Error(estimate.error);
}
```

### Step 3: Bridge Execution

```typescript
// Execute bridge operation
const bridgeResult = await bridgeService.executeBridge(
  sourceChainId,
  destinationChainId,
  amount,
  recipient
);

// Monitor bridge progress
await monitorBridgeProgress(bridgeResult.bridgeId);
```

### Step 4: Game Execution

```typescript
// After successful bridge, execute dice game
const gameResult = await nexusService.executeDiceGame(
  guess,
  amount,
  destinationChainId
);

// Handle game result
if (gameResult.success) {
  // Display success
} else {
  // Handle error
}
```

### Step 5: Progress Tracking

```typescript
// Update progress at each step
updateState({ currentStep: 'validating', progress: 0 });
updateState({ currentStep: 'bridging', progress: 25 });
updateState({ currentStep: 'executing', progress: 50 });
updateState({ currentStep: 'completed', progress: 100 });
```

## Usage Examples

### Basic Bridge & Execute

```typescript
import { BridgeExecuteButton } from './components/BridgeExecuteButton';

function MyComponent() {
  return (
    <BridgeExecuteButton
      sourceChainId={137} // Polygon
      destinationChainId={42161} // Arbitrum
      amount="0.01"
      guess={3}
      onSuccess={(txHash) => {
        console.log('Bridge & Execute successful!', txHash);
      }}
      onError={(error) => {
        console.error('Bridge & Execute failed:', error);
      }}
    />
  );
}
```

### Advanced Usage with Progress Tracking

```typescript
import { useBridgeExecute } from './hooks/useBridgeExecute';
import { BridgeProgressIndicator } from './components/BridgeProgressIndicator';

function AdvancedBridgeComponent() {
  const {
    isProcessing,
    currentStep,
    progress,
    error,
    txHash,
    executeBridgeAndExecute
  } = useBridgeExecute();

  const handleBridge = async () => {
    await executeBridgeAndExecute({
      sourceChainId: 137,
      destinationChainId: 42161,
      amount: "0.01",
      guess: 3,
      recipient: "0x..."
    });
  };

  return (
    <div>
      {isProcessing && (
        <BridgeProgressIndicator
          currentStep={currentStep}
          progress={progress}
          error={error}
          txHash={txHash}
        />
      )}
      
      <button onClick={handleBridge} disabled={isProcessing}>
        Bridge & Play
      </button>
    </div>
  );
}
```

### Route Selection

```typescript
import { BridgeRouteSelector } from './components/BridgeRouteSelector';

function RouteSelectionExample() {
  return (
    <BridgeRouteSelector
      sourceChain={137}
      amount="0.01"
      onRouteSelect={(route, quote) => {
        console.log('Selected route:', route);
        console.log('Quote:', quote);
        // Use selected route for bridge operation
      }}
    />
  );
}
```

### Balance Monitoring

```typescript
import { CrossChainBalanceDisplay } from './components/CrossChainBalanceDisplay';

function BalanceMonitoringExample() {
  return (
    <CrossChainBalanceDisplay
      selectedChainId={137}
      onChainSelect={(chainId) => {
        console.log('Chain selected:', chainId);
      }}
      showRefreshButton={true}
    />
  );
}
```

## Best Practices

### 1. Error Handling

Always implement comprehensive error handling:

```typescript
try {
  await executeBridgeAndExecute(params);
} catch (error) {
  // Log error for debugging
  console.error('Bridge failed:', error);
  
  // Show user-friendly message
  showNotification({
    type: 'error',
    message: 'Bridge operation failed. Please try again.'
  });
  
  // Attempt recovery if possible
  if (isRecoverableError(error)) {
    await retryBridge();
  }
}
```

### 2. User Feedback

Provide clear feedback at every step:

```typescript
// Before bridge
showNotification({ type: 'info', message: 'Preparing bridge...' });

// During bridge
updateProgress(50, 'Bridging tokens across chains...');

// After bridge
showNotification({ type: 'success', message: 'Bridge completed!' });
```

### 3. Validation

Validate all inputs before execution:

```typescript
// Validate amount
if (parseFloat(amount) < 0.001) {
  throw new Error('Amount too small');
}

// Validate chains
if (sourceChain === destinationChain) {
  throw new Error('Source and destination must be different');
}

// Validate balance
if (!hasSufficientBalance(sourceChain, amount)) {
  throw new Error('Insufficient balance');
}
```

### 4. State Management

Keep state clean and predictable:

```typescript
// Reset state after completion
useEffect(() => {
  if (currentStep === 'completed') {
    const timer = setTimeout(() => {
      resetState();
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [currentStep]);
```

### 5. Performance Optimization

Optimize for better performance:

```typescript
// Memoize expensive calculations
const bridgeFee = useMemo(() => 
  calculateBridgeFee(amount, sourceChain, destinationChain),
  [amount, sourceChain, destinationChain]
);

// Debounce user inputs
const debouncedAmount = useDebounce(amount, 500);

// Lazy load heavy components
const BridgeDemo = lazy(() => import('./components/BridgeExecuteDemo'));
```

## Troubleshooting

### Common Issues

#### Issue: Bridge operation times out

**Solution**:
```typescript
// Increase timeout in bridge config
const config = {
  timeout: 300000, // 5 minutes instead of default
};

// Implement retry logic
const maxRetries = 3;
for (let i = 0; i < maxRetries; i++) {
  try {
    await executeBridge(params);
    break;
  } catch (error) {
    if (i === maxRetries - 1) throw error;
    await wait(5000); // Wait 5 seconds before retry
  }
}
```

#### Issue: Insufficient gas for bridge

**Solution**:
```typescript
// Estimate gas before bridge
const gasEstimate = await estimateBridgeGas(params);

// Add buffer to gas estimate
const gasLimit = gasEstimate * 1.2; // 20% buffer

// Check user has sufficient balance
if (userBalance < amount + gasEstimate) {
  throw new Error('Insufficient balance for gas');
}
```

#### Issue: Bridge quote expired

**Solution**:
```typescript
// Check quote expiry before execution
if (Date.now() > quote.expiry) {
  // Refresh quote
  const newQuote = await getNewQuote(params);
  return executeBridgeWithQuote(newQuote);
}
```

### Debug Mode

Enable debug mode for detailed logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  window.BRIDGE_DEBUG = true;
}

// In code
if (window.BRIDGE_DEBUG) {
  console.log('Bridge params:', params);
  console.log('Bridge estimate:', estimate);
  console.log('Bridge result:', result);
}
```

## Testing

### Unit Tests

```typescript
describe('useBridgeExecute', () => {
  it('should execute bridge and execute operation', async () => {
    const { result } = renderHook(() => useBridgeExecute());
    
    await act(async () => {
      await result.current.executeBridgeAndExecute({
        sourceChainId: 137,
        destinationChainId: 42161,
        amount: "0.01",
        guess: 3
      });
    });
    
    expect(result.current.currentStep).toBe('completed');
  });
});
```

### Integration Tests

```typescript
describe('Bridge & Execute Flow', () => {
  it('should complete full bridge and execute flow', async () => {
    // 1. Validate parameters
    const validation = validateBridgeAndExecute(params);
    expect(validation.isValid).toBe(true);
    
    // 2. Estimate bridge
    const estimate = await estimateBridge(params);
    expect(estimate.canBridge).toBe(true);
    
    // 3. Execute bridge
    const result = await executeBridge(params);
    expect(result.success).toBe(true);
    
    // 4. Execute game
    const gameResult = await executeDiceGame(params);
    expect(gameResult.success).toBe(true);
  });
});
```

## Additional Resources

- [Avail Nexus SDK Documentation](https://docs.availproject.org)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Project Wiki](https://github.com/your-username/crosschain-casino/wiki)

---

For more information or support, please refer to the main [README](README.md) or open an issue on GitHub.
