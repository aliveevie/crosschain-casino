import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { decodeEventLog, createPublicClient, http } from "viem";
import { polygon, arbitrum, optimism, base } from "wagmi/chains";

interface GameRecord {
  txHash: string;
  timestamp: number;
  guess: number;
  roll: number;
  betAmount: string;
  payout: string;
  won: boolean;
  chainId: number;
  chainName: string;
  currency: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BLOCK_RANGE = 500; // Last ~500 blocks (≈15 minutes, safe for public RPC)

const DICE_FACES = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

const SUPPORTED_CHAINS = [
  { chain: polygon, name: "Polygon", icon: "🟣", currency: "POL" },
  { chain: arbitrum, name: "Arbitrum", icon: "🔵", currency: "ETH" },
  { chain: optimism, name: "Optimism", icon: "🔴", currency: "ETH" },
  { chain: base, name: "Base", icon: "🔷", currency: "ETH" },
];

const CONTRACT_ADDRESS = "0xeBD8Ebee953d79881109979C2c365D609983cC8f";

const BET_EVENT_ABI = [
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
  };
  return `${explorers[chainId] || 'https://polygonscan.com/tx/'}${txHash}`;
}

export default function GameHistoryModal({ isOpen, onClose }: Props) {
  const { address } = useAccount();
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    totalWagered: 0,
    totalWon: 0,
    netProfit: 0,
  });

  useEffect(() => {
    if (isOpen && address) {
      fetchGameHistory();
    }
  }, [isOpen, address]);

  const fetchGameHistory = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const allGames: GameRecord[] = [];
      let totalWagered = 0;
      let totalWon = 0;
      let wins = 0;

      // Fetch games from ALL supported chains in parallel
      const chainPromises = SUPPORTED_CHAINS.map(async ({ chain, name, icon, currency }) => {
        try {
          const publicClient = createPublicClient({
            chain,
            transport: http(),
          });

          const currentBlock = await publicClient.getBlockNumber();
          let logs: any[] = [];
          let blockRange = BLOCK_RANGE;
          
          // Try progressively smaller block ranges if the first one fails
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              logs = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: BET_EVENT_ABI[0],
                args: {
                  player: address,
                },
                fromBlock: BigInt(Math.max(0, Number(currentBlock) - blockRange)),
                toBlock: 'latest',
              });
              break; // Success!
            } catch (err: any) {
              if (err?.message?.includes('Block range is too large') && attempt < 2) {
                blockRange = Math.floor(blockRange / 2);
                console.log(`${name}: Retrying with ${blockRange} blocks`);
                continue;
              }
              throw err;
            }
          }

          const chainGames: GameRecord[] = [];
          for (const log of logs) {
            const decoded = decodeEventLog({
              abi: BET_EVENT_ABI,
              data: log.data,
              topics: log.topics,
            }) as any;

            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const payout = Number(decoded.args.payout) / 1e18;
            const won = payout > 0;
            const betAmount = won ? payout / 5 : 0.002;

            chainGames.push({
              txHash: log.transactionHash || '',
              timestamp: Number(block.timestamp) * 1000,
              guess: Number(decoded.args.guess),
              roll: Number(decoded.args.roll),
              betAmount: betAmount.toFixed(4),
              payout: payout.toFixed(4),
              won,
              chainId: chain.id,
              chainName: `${icon} ${name}`,
              currency,
            });

            totalWagered += betAmount;
            if (won) {
              totalWon += payout;
              wins++;
            }
          }

          return chainGames;
        } catch (err) {
          console.log(`Failed to fetch from ${name}:`, err);
          return []; // Return empty array if chain fails, don't break entire flow
        }
      });

      // Wait for all chains to respond
      const results = await Promise.all(chainPromises);
      
      // Combine all games from all chains
      results.forEach(chainGames => {
        allGames.push(...chainGames);
      });

      // Sort by timestamp descending (newest first)
      allGames.sort((a, b) => b.timestamp - a.timestamp);

      setGames(allGames);
      setStats({
        totalGames: allGames.length,
        wins,
        losses: allGames.length - wins,
        totalWagered,
        totalWon,
        netProfit: totalWon - totalWagered,
      });

      if (allGames.length === 0) {
        setError(null); // Clear error if no games found (not an error condition)
      }
    } catch (err: any) {
      console.error('Error fetching game history:', err);
      setError('Unable to load game history from some chains. Your games are safe on the blockchain!');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl shadow-2xl border-2 border-purple-500/50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>🎲</span>
                <span>Game History</span>
              </h2>
              <p className="text-purple-200 text-sm mt-1">Multi-chain history from Polygon, Arbitrum, Optimism & Base</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-all hover:rotate-90"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-purple-500/30">
          <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
            <div className="text-gray-400 text-sm">Total Games</div>
            <div className="text-white text-2xl font-bold">{stats.totalGames}</div>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
            <div className="text-green-300 text-sm">Wins</div>
            <div className="text-green-400 text-2xl font-bold">{stats.wins}</div>
          </div>
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <div className="text-red-300 text-sm">Losses</div>
            <div className="text-red-400 text-2xl font-bold">{stats.losses}</div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-300 text-sm">Total Wagered</div>
            <div className="text-blue-400 text-xl font-bold">{stats.totalWagered.toFixed(4)}</div>
            <div className="text-blue-300 text-[10px] mt-0.5">Multi-chain</div>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <div className="text-yellow-300 text-sm">Total Won</div>
            <div className="text-yellow-400 text-xl font-bold">{stats.totalWon.toFixed(4)}</div>
            <div className="text-yellow-300 text-[10px] mt-0.5">Multi-chain</div>
          </div>
          <div className={`rounded-xl p-4 border ${stats.netProfit >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={stats.netProfit >= 0 ? 'text-green-300 text-sm' : 'text-red-300 text-sm'}>Net Profit</div>
            <div className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(4)}
            </div>
            <div className={stats.netProfit >= 0 ? 'text-green-300 text-[10px] mt-0.5' : 'text-red-300 text-[10px] mt-0.5'}>Multi-chain</div>
          </div>
        </div>

        {/* Games List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 ml-4">Loading your game history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-400 text-lg font-semibold mb-2">Error Loading History</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">{error}</p>
              <button
                onClick={fetchGameHistory}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                Try Again
              </button>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎲</div>
              <p className="text-gray-400 text-lg">No games played yet</p>
              <p className="text-gray-500 text-sm mt-2">Start playing to see your history here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    game.won
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {game.won ? '🏆' : '😔'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-400 text-sm">Guess:</span>
                          <span className="text-2xl">{DICE_FACES[game.guess as keyof typeof DICE_FACES]}</span>
                          <span className="text-xl">{game.won ? '✅' : '❌'}</span>
                          <span className="text-2xl">{DICE_FACES[game.roll as keyof typeof DICE_FACES]}</span>
                          <span className="text-gray-400 text-sm">:Roll</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400">{new Date(game.timestamp).toLocaleString()}</span>
                          <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 font-medium">
                            {game.chainName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                        {game.won ? '+' : '-'}{game.won ? game.payout : game.betAmount} {game.currency}
                      </div>
                      <a
                        href={getExplorerUrl(game.chainId, game.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        View TX
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

