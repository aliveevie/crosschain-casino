import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";

interface GameResult {
  playerGuess: number;
  actualRoll: number;
  payout: string;
  won: boolean;
  betAmount: string;
}

interface Props {
  txHash: string;
  chainId: number;
  betAmount: string;
  guess: number;
  onPlayAgain: () => void;
}

const DICE_FACES = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

const DICE_ABI = [
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
] as const;

function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    137: 'https://polygonscan.com/tx/',
    42161: 'https://arbiscan.io/tx/',
    10: 'https://optimistic.etherscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    1: 'https://etherscan.io/tx/',
  };
  return `${explorers[chainId] || 'https://polygonscan.com/tx/'}${txHash}`;
}

export default function GameResultDashboard({ txHash, chainId, betAmount, guess, onPlayAgain }: Props) {
  const publicClient = usePublicClient({ chainId });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 20;

    const fetchResult = async () => {
      try {
        if (!publicClient || !txHash) {
          // If no transaction hash, assume success but can't verify
          setTimeout(() => {
            if (mounted) {
              setGameResult({
                playerGuess: guess,
                actualRoll: 0, // Unknown
                payout: "0",
                won: false, // Unknown
                betAmount: betAmount,
              });
              setLoading(false);
            }
          }, 2000);
          return;
        }

        console.log('🔍 Fetching transaction receipt...', txHash);
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          timeout: 30_000,
        });

        console.log('📜 Receipt:', receipt);

        // Find the Bet event in logs
        const betEvent = receipt.logs.find(log => {
          try {
            const decoded = decodeEventLog({
              abi: DICE_ABI,
              data: log.data,
              topics: log.topics,
            });
            return decoded.eventName === 'Bet';
          } catch {
            return false;
          }
        });

        if (betEvent) {
          const decoded = decodeEventLog({
            abi: DICE_ABI,
            data: betEvent.data,
            topics: betEvent.topics,
          }) as any;

          const roll = Number(decoded.args.roll);
          const payout = decoded.args.payout.toString();
          const won = payout !== '0';

          if (mounted) {
            setGameResult({
              playerGuess: guess,
              actualRoll: roll,
              payout: (Number(payout) / 1e18).toFixed(4),
              won,
              betAmount,
            });
            setLoading(false);
          }
        } else {
          // Event not found, but transaction succeeded
          if (mounted) {
            setGameResult({
              playerGuess: guess,
              actualRoll: 0,
              payout: "0",
              won: false,
              betAmount,
            });
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error('Error fetching result:', error);
        
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          console.log(`Retry ${retryCount}/${maxRetries}...`);
          setTimeout(fetchResult, 2000);
        } else if (mounted) {
          // Give up, show generic result
          setGameResult({
            playerGuess: guess,
            actualRoll: 0,
            payout: "0",
            won: false,
            betAmount,
          });
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      mounted = false;
    };
  }, [txHash, publicClient, guess, betAmount, chainId]);

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl animate-pulse">
                🎲
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Rolling the Dice...</h3>
            <p className="text-purple-200">Fetching your game results</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameResult) {
    return (
      <div className="p-6 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-2xl">
        <p className="text-yellow-200 text-center">Unable to fetch game result. Check your wallet for transaction details.</p>
        <button onClick={onPlayAgain} className="mt-4 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">
          Play Again
        </button>
      </div>
    );
  }

  const { won, actualRoll, payout, playerGuess } = gameResult;
  
  // Get correct currency based on chain
  const getCurrency = (chainId: number): string => {
    switch (chainId) {
      case 137: return 'POL';  // Polygon
      case 42161: return 'ETH'; // Arbitrum
      case 10: return 'ETH';    // Optimism
      case 8453: return 'ETH';  // Base
      case 1: return 'ETH';     // Ethereum Mainnet
      default: return 'ETH';
    }
  };
  
  const chainCurrency = getCurrency(chainId);

  // YOU WON!
  if (won) {
    return (
      <div className="w-full space-y-4 animate-in">
        <div className="p-8 bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-4 border-green-400/80 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Confetti effect background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 text-6xl animate-bounce">🎉</div>
            <div className="absolute top-0 right-1/4 text-6xl animate-bounce delay-100">🎊</div>
            <div className="absolute bottom-0 left-1/3 text-6xl animate-bounce delay-200">✨</div>
            <div className="absolute bottom-0 right-1/3 text-6xl animate-bounce delay-300">💰</div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Winner Banner */}
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-4xl font-black text-white mb-2 animate-pulse">
                YOU WON!
              </h2>
              <p className="text-green-200 text-xl font-bold">
                Congratulations! 🎉
              </p>
            </div>

            {/* Dice Results */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-400/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-green-300 text-sm mb-2">Your Guess</p>
                  <div className="text-6xl">{DICE_FACES[playerGuess as keyof typeof DICE_FACES]}</div>
                  <p className="text-white font-bold text-2xl mt-2">{playerGuess}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-5xl text-green-400">✅</div>
                </div>
                <div>
                  <p className="text-green-300 text-sm mb-2">Dice Roll</p>
                  <div className="text-6xl animate-pulse">{DICE_FACES[actualRoll as keyof typeof DICE_FACES]}</div>
                  <p className="text-white font-bold text-2xl mt-2">{actualRoll}</p>
                </div>
              </div>
            </div>

            {/* Winnings Details */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-2xl p-6 border-2 border-yellow-400/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-200 text-lg">Bet Amount:</span>
                  <span className="text-white font-bold text-xl">{betAmount} {chainCurrency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200 text-lg">Multiplier:</span>
                  <span className="text-yellow-300 font-bold text-xl">5x 🚀</span>
                </div>
                <div className="border-t-2 border-green-400/30 pt-3 mt-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200 text-2xl font-bold">Total Winnings:</span>
                  <span className="text-yellow-300 font-black text-3xl animate-pulse">
                    {payout} {chainCurrency} 💰
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Link */}
            {txHash && (
              <div className="flex gap-3">
                <a
                  href={getExplorerUrl(chainId, txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg"
                >
                  <span>View on Explorer</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={onPlayAgain}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  Play Again 🎲
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // YOU LOST
  return (
    <div className="w-full space-y-4 animate-in">
      <div className="p-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-400/50 rounded-3xl shadow-2xl">
        <div className="space-y-6">
          {/* Loss Banner */}
          <div className="text-center">
            <div className="text-7xl mb-4">😔</div>
            <h2 className="text-4xl font-black text-white mb-2">
              Not This Time
            </h2>
            <p className="text-red-200 text-xl font-bold">
              Better luck next roll!
            </p>
          </div>

          {/* Dice Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-400/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-red-300 text-sm mb-2">Your Guess</p>
                <div className="text-6xl opacity-50">{DICE_FACES[playerGuess as keyof typeof DICE_FACES]}</div>
                <p className="text-white font-bold text-2xl mt-2">{playerGuess}</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-5xl text-red-400">❌</div>
              </div>
              <div>
                <p className="text-red-300 text-sm mb-2">Dice Roll</p>
                <div className="text-6xl">{DICE_FACES[actualRoll as keyof typeof DICE_FACES]}</div>
                <p className="text-white font-bold text-2xl mt-2">{actualRoll}</p>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-white/5 rounded-2xl p-6 border border-red-400/30">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-200">Bet Amount:</span>
                <span className="text-white font-bold">{betAmount} {chainCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-200">Result:</span>
                <span className="text-red-300 font-bold">No Win</span>
              </div>
              <div className="border-t border-red-400/20 pt-3 mt-3">
                <p className="text-red-200 text-sm text-center">
                  You needed to guess <strong>{actualRoll}</strong> to win 5x your bet!
                </p>
              </div>
            </div>
          </div>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
            <p className="text-purple-200 text-center text-sm">
              🎲 <strong>Win Rate: 16.67%</strong> (1 in 6) · <strong>5x Multiplier</strong> on wins!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {txHash && (
              <a
                href={getExplorerUrl(chainId, txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-red-600/80 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold transition-all"
              >
                <span>View Transaction</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <button
              onClick={onPlayAgain}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Try Again 🎲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

