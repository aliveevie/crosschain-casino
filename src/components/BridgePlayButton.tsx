import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BridgeAndExecuteButton } from "@avail-project/nexus-widgets";
import type { DynamicParamBuilder } from "@avail-project/nexus-widgets";
import GameResultDashboard from "./GameResultDashboard";

type Props = {
  amount: string;
  srcChainId: number;
  dstChainId: number;
  gameMove: number;
};

const CONTRACT_ADDRESS = "0xeBD8Ebee953d79881109979C2c365D609983cC8f" as `0x${string}`;

const DICE_GAME_ABI = [
  {
    type: "function",
    name: "placeBet",
    stateMutability: "payable",
    inputs: [{ name: "guess", type: "uint256" }],
    outputs: [],
  },
] as const;

const CHAIN_NAMES: Record<number, string> = {
  8453: "Base",
  137: "Polygon",
  1: "Ethereum",
  42161: "Arbitrum",
  10: "Optimism",
};

export default function BridgePlayButton({ 
  amount, 
  srcChainId,
  dstChainId, 
  gameMove 
}: Props) {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  // States for cross-chain (Nexus SDK)
  const [crossChainStatus, setCrossChainStatus] = useState<'idle' | 'signing' | 'processing'>('idle');
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // States for same-chain (Direct transaction)
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  
  // Unified state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successHash, setSuccessHash] = useState('');

  const isCrossChain = srcChainId !== dstChainId;
  const needsSwitchChain = chain?.id !== dstChainId;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Handle same-chain transaction success
  useEffect(() => {
    if (txSuccess && txHash && !isCrossChain) {
      console.log('✅ Same-chain transaction successful!', txHash);
      setShowSuccess(true);
      setSuccessHash(txHash);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessHash('');
      }, 15000);
    }
  }, [txSuccess, txHash, isCrossChain]);

  // Handle same-chain transaction error
  useEffect(() => {
    if (txError && !isCrossChain) {
      console.error('❌ Same-chain transaction error:', txError);
      setShowError(true);
      setErrorMsg(txError.message || 'Transaction failed');
      
      setTimeout(() => {
        setShowError(false);
        setErrorMsg('');
      }, 10000);
    }
  }, [txError, isCrossChain]);

  // Monitor modal closure for cross-chain
  useEffect(() => {
    if (crossChainStatus !== 'signing' || !isCrossChain) return;

    const checkInterval = setInterval(() => {
      const hasModal = document.querySelector('[role="dialog"]');
      
      if (!hasModal) {
        console.log('✅ Cross-chain modal closed - processing...');
        setCrossChainStatus('processing');
        clearInterval(checkInterval);
        
        // Fallback timeout
        processingTimeoutRef.current = setTimeout(() => {
          console.log('⏱️ Processing complete (timeout)');
          handleCrossChainSuccess({ hash: '' });
        }, 30000);
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, [crossChainStatus, isCrossChain]);

  const buildFunctionParams: DynamicParamBuilder = useMemo(() => {
    return () => [BigInt(gameMove)];
  }, [gameMove]);

  const handleSwitchChain = async () => {
    if (needsSwitchChain) {
      try {
        await switchChain({ chainId: dstChainId });
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  // Same-chain direct transaction
  const handleDirectBet = async () => {
    try {
      console.log('🎲 Placing direct bet on', CHAIN_NAMES[dstChainId]);
      const betAmount = parseEther(amount);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: DICE_GAME_ABI,
        functionName: "placeBet",
        args: [BigInt(gameMove)],
        value: betAmount,
        chainId: dstChainId,
      });
    } catch (error: any) {
      console.error('Error placing bet:', error);
      setShowError(true);
      setErrorMsg(error.message || 'Failed to place bet');
    }
  };

  // Cross-chain handlers
  const handleCrossChainSuccess = useCallback((result: any) => {
    console.log("🎉 Cross-chain SUCCESS!", result);
    
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    
    setCrossChainStatus('idle');
    setShowSuccess(true);
    
    const hash = result?.hash || result?.txHash || result?.transactionHash || '';
    setSuccessHash(hash);
    
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessHash('');
    }, 15000);
  }, []);

  const handleCrossChainError = useCallback((error: any) => {
    console.error("❌ Cross-chain ERROR!", error);
    
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    
    setCrossChainStatus('idle');
    setShowError(true);
    setErrorMsg(error?.message || error?.reason || 'Cross-chain transaction failed');
    
    setTimeout(() => {
      setShowError(false);
      setErrorMsg('');
    }, 10000);
  }, []);

  const handleReset = () => {
    setShowSuccess(false);
    setShowError(false);
    setErrorMsg('');
    setSuccessHash('');
    setCrossChainStatus('idle');
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  };

  if (!isConnected) {
    return (
      <button disabled className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gray-600 text-gray-300 cursor-not-allowed">
        Connect Wallet to Play
      </button>
    );
  }

  if (needsSwitchChain) {
    return (
      <button
        onClick={handleSwitchChain}
        className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
      >
        🔄 Switch to {CHAIN_NAMES[dstChainId]}
      </button>
    );
  }

  // PROCESSING STATE (Cross-chain only)
  if (crossChainStatus === 'processing') {
    return (
      <div className="w-full space-y-4">
        <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">🌉</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Processing Cross-Chain Transaction</h3>
              <p className="text-purple-200 text-lg">
                Bridging from <strong>{CHAIN_NAMES[srcChainId]}</strong> to <strong>{CHAIN_NAMES[dstChainId]}</strong>
              </p>
              <div className="space-y-2 text-sm text-purple-300">
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Transaction signed ✓
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Bridging funds...
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Executing bet...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SAME-CHAIN CONFIRMING STATE
  if (!isCrossChain && (isPending || isConfirming)) {
    return (
      <div className="w-full space-y-4">
        <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-xl font-bold text-white">
              {isPending ? 'Confirm in Wallet...' : 'Processing Transaction...'}
            </h3>
            <p className="text-purple-200 text-sm">
              {isPending ? 'Please confirm the transaction in your wallet' : 'Waiting for confirmation on blockchain'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE - Show Game Results Dashboard
  if (showSuccess) {
    return (
      <GameResultDashboard
        txHash={successHash}
        chainId={dstChainId}
        betAmount={amount}
        guess={gameMove}
        onPlayAgain={handleReset}
      />
    );
  }

  // ERROR STATE
  if (showError) {
    return (
      <div className="w-full space-y-4">
        <div className="p-6 bg-gradient-to-br from-red-500/30 to-pink-500/30 border-2 border-red-400/60 rounded-2xl shadow-2xl">
          <div className="flex items-start space-x-4">
            <span className="text-6xl">❌</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">Transaction Failed</h3>
              <p className="text-red-100 text-base mb-4 bg-white/10 p-3 rounded-lg">{errorMsg}</p>
              <button onClick={handleReset} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IDLE STATE - Show appropriate button
  return (
    <div className="w-full space-y-4">
      {isCrossChain && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🌉</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-300 mb-1">Cross-Chain Bridge & Execute</h4>
              <p className="text-xs text-blue-200">
                Bridge from <strong>{CHAIN_NAMES[srcChainId]}</strong> to <strong>{CHAIN_NAMES[dstChainId]}</strong> using Nexus SDK
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Same-Chain: Direct Transaction Button */}
      {!isCrossChain && (
        <button
          onClick={handleDirectBet}
          disabled={isPending || isConfirming}
          className="nexus-play-button w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-400/50"
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)',
          }}
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-3xl">🎲</span>
            <span>Place Bet & Roll Dice!</span>
            <span className="text-3xl">✨</span>
          </span>
        </button>
      )}

      {/* Cross-Chain: Nexus SDK Button */}
      {isCrossChain && (
        <div className="nexus-bridge-button-container">
          <BridgeAndExecuteButton
            contractAddress={CONTRACT_ADDRESS}
            contractAbi={DICE_GAME_ABI}
            functionName="placeBet"
            buildFunctionParams={buildFunctionParams}
            prefill={{
              toChainId: dstChainId as any,
              amount: amount,
            }}
            title="Bridge & Play"
            onSuccess={handleCrossChainSuccess}
            onError={handleCrossChainError}
          >
            {({ onClick, isLoading, disabled }) => (
              <button
                onClick={() => {
                  console.log("🌉 Opening cross-chain bridge...");
                  setCrossChainStatus('signing');
                  onClick();
                }}
                disabled={disabled || isLoading}
                className="nexus-play-button w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-2 border-purple-400/50"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)',
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-3xl">🌉</span>
                  <span>Bridge & Play from {CHAIN_NAMES[srcChainId]}</span>
                  <span className="text-3xl">✨</span>
                </span>
              </button>
            )}
          </BridgeAndExecuteButton>
        </div>
      )}

      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1 a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-purple-200 leading-relaxed">
            {isCrossChain 
              ? "🎯 Cross-chain: Sign to bridge and play automatically!"
              : "🎯 Same network: Direct bet placement - win 5x instantly if you guess correctly!"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
