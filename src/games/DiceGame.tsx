import { useState } from "react";
import BridgePlayButton from "../components/BridgePlayButton";
import ChainSelector from "../components/ChainSelector";
import { polygon, base } from "wagmi/chains";
import { useAccount } from "wagmi";

const DICE_NUMBERS = [1, 2, 3, 4, 5, 6];

const DICE_FACES = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

export default function DiceGame() {
  const [guess, setGuess] = useState(3);
  const [amount, setAmount] = useState("0.002");
  const [srcChainId, setSrcChainId] = useState(base.id);
  const [dstChainId, setDstChainId] = useState(polygon.id);
  const { isConnected, chain } = useAccount();

  const isCrossChain = srcChainId !== dstChainId;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>🎲</span>
                <span>Dice Roll</span>
              </h3>
              <p className="text-purple-200 text-sm mt-1">
                Guess the number, win 5x your bet!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">5x</div>
              <div className="text-xs text-purple-200">Payout</div>
            </div>
          </div>
        </div>

        {/* Game Body */}
        <div className="p-8">
          {/* Current Chain Display */}
          {isConnected && chain && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Wallet Connected
                </span>
                <span className="text-white font-semibold">{chain.name}</span>
              </div>
            </div>
          )}

          {/* Chain Selection */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChainSelector
              selectedChain={srcChainId}
              onSelect={setSrcChainId}
              label="Source Chain"
              excludeChain={undefined}
            />
            <ChainSelector
              selectedChain={dstChainId}
              onSelect={setDstChainId}
              label="Destination Chain (Game Contract)"
              excludeChain={undefined}
            />
          </div>

          {/* Cross-Chain Indicator */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">
                  {srcChainId === base.id ? "🔵" : srcChainId === polygon.id ? "🟣" : "⬥"}
                </div>
                <div className="text-xs text-gray-400">From</div>
              </div>
              <div className="text-2xl">
                {isCrossChain ? "🌉" : "→"}
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">
                  {dstChainId === base.id ? "🔵" : dstChainId === polygon.id ? "🟣" : "⬥"}
                </div>
                <div className="text-xs text-gray-400">To</div>
              </div>
            </div>
            {isCrossChain && (
              <div className="mt-3 text-center">
                <span className="text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                  Cross-Chain Transaction
                </span>
              </div>
            )}
          </div>

          {/* Dice Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-4">
              Choose your lucky number (1-6)
            </label>
            <div className="grid grid-cols-6 gap-3">
              {DICE_NUMBERS.map((num) => (
                <button
                  key={num}
                  onClick={() => setGuess(num)}
                  disabled={!isConnected}
                  className={`
                    aspect-square rounded-2xl text-5xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    ${
                      guess === num
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-105"
                        : "bg-white/10 hover:bg-white/20"
                    }
                  `}
                >
                  {DICE_FACES[num as keyof typeof DICE_FACES]}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-3">
              Bet Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isConnected}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="0.002"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                {dstChainId === polygon.id ? "MATIC" : "ETH"}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Potential win: <span className="text-green-400 font-semibold">{(parseFloat(amount || "0") * 5).toFixed(4)}</span>
              </span>
              <span className="text-gray-400">
                Odds: <span className="text-purple-400 font-semibold">1/6 (16.67%)</span>
              </span>
            </div>
          </div>

          {/* Play Button */}
          <BridgePlayButton
            amount={amount}
            srcChainId={srcChainId}
            dstChainId={dstChainId}
            gameMove={guess}
          />

          {/* Info Text */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-200">
                {isCrossChain 
                  ? "Cross-chain play: Your funds will be bridged to the destination chain, then the bet will be placed automatically."
                  : "Your bet will be placed directly on the selected blockchain. If your number matches the dice roll, you'll instantly receive 5x your bet!"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">🎯 How to Play</h4>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
            <p>Connect your wallet (MetaMask, WalletConnect, etc.)</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
            <p>Select source and destination chains for cross-chain play (or use same chain)</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
            <p>Choose your lucky number (1-6) and enter your bet amount</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</span>
            <p>Click the button to bridge (if cross-chain) and place your bet</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">5</span>
            <p>If your number matches the roll, win 5x your bet instantly! 🎉</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">5x</div>
          <div className="text-xs text-gray-400 mt-1">Payout Multiplier</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">16.67%</div>
          <div className="text-xs text-gray-400 mt-1">Win Chance</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">Instant</div>
          <div className="text-xs text-gray-400 mt-1">Payout Speed</div>
        </div>
      </div>
    </div>
  );
}
