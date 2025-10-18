import { emitNexusEvent } from "../utils/nexusHelpers";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";
import { type ChainId } from "../lib/nexus-config";

interface BridgeTransaction {
  id: string;
  sourceChain: ChainId;
  destinationChain: ChainId;
  amount: string;
  token: string;
  recipient: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
  estimatedTime?: number;
}

interface BridgeEstimate {
  estimatedTime: number;
  gasEstimate: number;
  feeEstimate: string;
  canBridge: boolean;
  error?: string;
}

export class BridgeService {
  private static instance: BridgeService;
  private activeBridges: Map<string, BridgeTransaction> = new Map();

  static getInstance(): BridgeService {
    if (!BridgeService.instance) {
      BridgeService.instance = new BridgeService();
    }
    return BridgeService.instance;
  }

  /**
   * Estimate bridge operation
   */
  async estimateBridge(
    sourceChain: ChainId,
    destinationChain: ChainId,
    amount: string,
    token: string = 'native'
  ): Promise<BridgeEstimate> {
    try {
      emitNexusEvent('BRIDGE_STARTED', {
        type: 'estimate',
        sourceChain,
        destinationChain,
        amount,
        timestamp: Date.now(),
      });

      // Calculate estimated time based on chain pairs
      const timeEstimates: Record<string, number> = {
        '137-42161': 120000, // Polygon to Arbitrum: ~2 minutes
        '42161-137': 120000, // Arbitrum to Polygon: ~2 minutes
        '137-10': 90000,     // Polygon to Optimism: ~1.5 minutes
        '10-137': 90000,     // Optimism to Polygon: ~1.5 minutes
        '137-8453': 60000,   // Polygon to Base: ~1 minute
        '8453-137': 60000,   // Base to Polygon: ~1 minute
        '42161-10': 150000,  // Arbitrum to Optimism: ~2.5 minutes
        '10-42161': 150000,  // Optimism to Arbitrum: ~2.5 minutes
        '42161-8453': 120000, // Arbitrum to Base: ~2 minutes
        '8453-42161': 120000, // Base to Arbitrum: ~2 minutes
        '10-8453': 90000,    // Optimism to Base: ~1.5 minutes
        '8453-10': 90000,    // Base to Optimism: ~1.5 minutes
      };

      const bridgeKey = `${sourceChain}-${destinationChain}`;
      const estimatedTime = timeEstimates[bridgeKey] || 120000; // Default 2 minutes

      // Gas estimation based on chain
      const gasEstimates: Record<number, number> = {
        137: 50000,   // Polygon
        42161: 70000, // Arbitrum
        10: 60000,    // Optimism
        8453: 55000,  // Base
      };

      const gasEstimate = gasEstimates[sourceChain] || 60000;

      // Fee estimation (simplified)
      const feeEstimate = (parseFloat(amount) * 0.001).toString(); // 0.1% fee

      return {
        estimatedTime,
        gasEstimate,
        feeEstimate,
        canBridge: true,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      emitNexusEvent('BRIDGE_FAILED', {
        type: 'estimate',
        error: errorMessage,
        timestamp: Date.now(),
      });

      return {
        estimatedTime: 0,
        gasEstimate: 0,
        feeEstimate: '0',
        canBridge: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Execute bridge operation
   */
  async executeBridge(
    sourceChain: ChainId,
    destinationChain: ChainId,
    amount: string,
    recipient: string,
    token: string = 'native'
  ): Promise<{ success: boolean; bridgeId?: string; error?: string }> {
    try {
      const bridgeId = `bridge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const bridgeTx: BridgeTransaction = {
        id: bridgeId,
        sourceChain,
        destinationChain,
        amount,
        token,
        recipient,
        status: 'pending',
        timestamp: Date.now(),
      };

      this.activeBridges.set(bridgeId, bridgeTx);

      emitNexusEvent('BRIDGE_STARTED', {
        bridgeId,
        sourceChain,
        destinationChain,
        amount,
        recipient,
        timestamp: Date.now(),
      });

      // Simulate bridge process
      await this.simulateBridgeProcess(bridgeId);

      return {
        success: true,
        bridgeId,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      emitNexusEvent('BRIDGE_FAILED', {
        error: errorMessage,
        timestamp: Date.now(),
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Simulate bridge process with status updates
   */
  private async simulateBridgeProcess(bridgeId: string): Promise<void> {
    const bridge = this.activeBridges.get(bridgeId);
    if (!bridge) throw new Error('Bridge not found');

    // Update status to bridging
    bridge.status = 'bridging';
    this.activeBridges.set(bridgeId, bridge);

    emitNexusEvent('BRIDGE_STARTED', {
      bridgeId,
      status: 'bridging',
      timestamp: Date.now(),
    });

    // Simulate bridge time (2-3 minutes)
    const bridgeTime = 30000; // 30 seconds for demo
    await new Promise(resolve => setTimeout(resolve, bridgeTime));

    // Generate mock transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Update status to completed
    bridge.status = 'completed';
    bridge.txHash = txHash;
    this.activeBridges.set(bridgeId, bridge);

    emitNexusEvent('BRIDGE_COMPLETED', {
      bridgeId,
      txHash,
      timestamp: Date.now(),
    });
  }

  /**
   * Get bridge status
   */
  getBridgeStatus(bridgeId: string): BridgeTransaction | null {
    return this.activeBridges.get(bridgeId) || null;
  }

  /**
   * Get all active bridges
   */
  getActiveBridges(): BridgeTransaction[] {
    return Array.from(this.activeBridges.values());
  }

  /**
   * Cancel bridge operation
   */
  async cancelBridge(bridgeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const bridge = this.activeBridges.get(bridgeId);
      if (!bridge) {
        return { success: false, error: 'Bridge not found' };
      }

      if (bridge.status === 'completed' || bridge.status === 'failed') {
        return { success: false, error: 'Cannot cancel completed or failed bridge' };
      }

      bridge.status = 'failed';
      this.activeBridges.set(bridgeId, bridge);

      emitNexusEvent('BRIDGE_FAILED', {
        bridgeId,
        error: 'Cancelled by user',
        timestamp: Date.now(),
      });

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Clean up completed bridges
   */
  cleanupCompletedBridges(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [bridgeId, bridge] of this.activeBridges.entries()) {
      if (bridge.timestamp < cutoffTime && 
          (bridge.status === 'completed' || bridge.status === 'failed')) {
        this.activeBridges.delete(bridgeId);
      }
    }
  }

  /**
   * Get bridge statistics
   */
  getBridgeStats(): {
    totalBridges: number;
    completedBridges: number;
    failedBridges: number;
    pendingBridges: number;
    averageBridgeTime: number;
  } {
    const bridges = Array.from(this.activeBridges.values());
    const completed = bridges.filter(b => b.status === 'completed');
    const failed = bridges.filter(b => b.status === 'failed');
    const pending = bridges.filter(b => b.status === 'pending' || b.status === 'bridging');

    const totalTime = completed.reduce((sum, bridge) => {
      return sum + (bridge.timestamp + (bridge.estimatedTime || 120000) - bridge.timestamp);
    }, 0);

    return {
      totalBridges: bridges.length,
      completedBridges: completed.length,
      failedBridges: failed.length,
      pendingBridges: pending.length,
      averageBridgeTime: completed.length > 0 ? totalTime / completed.length : 0,
    };
  }
}

// Export singleton instance
export const bridgeService = BridgeService.getInstance();
