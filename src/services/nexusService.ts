import { emitNexusEvent } from "../utils/nexusHelpers";
import { NEXUS_CONSTANTS } from "../constants/nexusConstants";
import { validateCrossChainParams, validateAmount, validateDiceGuess } from "../utils/nexusValidation";

/**
 * Nexus SDK Service for managing cross-chain operations
 */
export class NexusService {
  private static instance: NexusService;
  private isInitialized = false;

  static getInstance(): NexusService {
    if (!NexusService.instance) {
      NexusService.instance = new NexusService();
    }
    return NexusService.instance;
  }

  /**
   * Initialize the Nexus service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if window.ethereum is available
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found');
      }

      // Emit initialization event
      emitNexusEvent('WALLET_CONNECTED', { 
        provider: 'window.ethereum',
        timestamp: Date.now() 
      });

      this.isInitialized = true;
      console.log('✅ Nexus Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Nexus Service:', error);
      throw error;
    }
  }

  /**
   * Validate dice game parameters
   */
  validateDiceGameParams(guess: number, amount: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!validateDiceGuess(guess)) {
      errors.push(NEXUS_CONSTANTS.ERROR_MESSAGES.INVALID_DICE_GUESS);
    }

    if (!validateAmount(amount)) {
      errors.push(NEXUS_CONSTANTS.ERROR_MESSAGES.INVALID_AMOUNT);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Prepare cross-chain transaction
   */
  async prepareCrossChainTransaction(
    sourceChain: number,
    destinationChain: number,
    amount: string
  ): Promise<{ isValid: boolean; errors: string[]; gasEstimate?: number }> {
    const validation = validateCrossChainParams(
      sourceChain as any,
      destinationChain as any,
      amount
    );

    if (!validation.isValid) {
      return validation;
    }

    try {
      // Emit bridge started event
      emitNexusEvent('BRIDGE_STARTED', {
        sourceChain,
        destinationChain,
        amount,
        timestamp: Date.now(),
      });

      // Estimate gas for bridge operation
      const gasEstimate = NEXUS_CONSTANTS.GAS_LIMITS.BRIDGE_AND_EXECUTE;

      return {
        isValid: true,
        errors: [],
        gasEstimate,
      };
    } catch (error) {
      console.error('Failed to prepare cross-chain transaction:', error);
      return {
        isValid: false,
        errors: [NEXUS_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR],
      };
    }
  }

  /**
   * Execute dice game transaction
   */
  async executeDiceGame(
    guess: number,
    amount: string,
    chainId: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    const validation = this.validateDiceGameParams(guess, amount);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    try {
      emitNexusEvent('TRANSACTION_STARTED', {
        type: 'dice_game',
        guess,
        amount,
        chainId,
        timestamp: Date.now(),
      });

      // This would integrate with actual Nexus SDK bridge & execute
      // For now, we'll simulate the transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      emitNexusEvent('TRANSACTION_COMPLETED', {
        type: 'dice_game',
        txHash,
        chainId,
        timestamp: Date.now(),
      });

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      emitNexusEvent('TRANSACTION_FAILED', {
        type: 'dice_game',
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
   * Switch to a different chain
   */
  async switchChain(chainId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found');
      }

      emitNexusEvent('CHAIN_CHANGED', {
        chainId,
        timestamp: Date.now(),
      });

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to switch chain';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get service status
   */
  getStatus(): { isInitialized: boolean; supportedChains: number[] } {
    return {
      isInitialized: this.isInitialized,
      supportedChains: Object.values(NEXUS_CONSTANTS.CHAIN_IDS),
    };
  }
}

// Export singleton instance
export const nexusService = NexusService.getInstance();
