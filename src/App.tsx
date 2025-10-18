import { useState } from "react";
import DiceGame from "./games/DiceGame";
import { NexusProvider } from "./components/NexusProvider";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import GameHistoryModal from "./components/GameHistoryModal";
import { NexusDemo } from "./components/NexusDemo";
import { BridgeExecuteDemo } from "./components/BridgeExecuteDemo";
import { NexusEventLogger } from "./components/NexusEventLogger";
import { NexusStatusIndicator } from "./components/NexusStatusIndicator";
import { NexusErrorBoundary } from "./components/NexusErrorBoundary";
import { NexusNotification } from "./components/NexusNotification";
import { NexusDebugPanel } from "./components/NexusDebugPanel";

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 text-sm font-medium"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg"
    >
      Connect Wallet
    </button>
  );
}

function AppContent() {
  const { isConnected } = useAccount();
  const [showHistory, setShowHistory] = useState(false);
  const [showNexusDemo, setShowNexusDemo] = useState(false);
  const [showBridgeDemo, setShowBridgeDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="backdrop-blur-sm bg-black/20 min-h-screen">
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">🎰</div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    CrossChain Casino
                  </h1>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <span>Powered by</span>
                      <span className="font-semibold text-purple-300">Avail Nexus SDK</span>
                      <span>🌉</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isConnected && (
                  <>
                    <button
                      onClick={() => setShowNexusDemo(true)}
                      className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg border border-blue-500/50 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg"
                    >
                      <span>🌉</span>
                      <span>Nexus Demo</span>
                    </button>
                    <button
                      onClick={() => setShowBridgeDemo(true)}
                      className="px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg border border-green-500/50 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg"
                    >
                      <span>🌉</span>
                      <span>Bridge & Execute</span>
                    </button>
                    <button
                      onClick={() => setShowHistory(true)}
                      className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg border border-purple-500/50 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg"
                    >
                      <span>📊</span>
                      <span>My Stats</span>
                    </button>
                  </>
                )}
                <NexusStatusIndicator />
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 text-sm">
                  Live
                </span>
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎲 Roll the Dice & Win Big!
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Choose your lucky number from 1 to 6. Guess correctly and <span className="text-green-400 font-bold">win 5x your bet</span> instantly!
            </p>
            <p className="text-purple-300 max-w-2xl mx-auto mt-3 text-sm">
              🌉 Bridge from any chain with <strong>Avail Nexus SDK</strong> - seamless cross-chain gaming!
            </p>
          </div>
          
          {showBridgeDemo ? (
            <BridgeExecuteDemo />
          ) : showNexusDemo ? (
            <NexusDemo />
          ) : (
            <DiceGame />
          )}
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Decentralized cross-chain casino powered by Avail Nexus</span>
            </div>
          </div>
        </main>
        
        <footer className="border-t border-white/10 bg-black/30 backdrop-blur-md mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-400 text-sm">
              <p>Contract: <code className="text-gray-300 bg-white/10 px-2 py-1 rounded">0xeBD8Ebee953d79881109979C2c365D609983cC8f</code></p>
              <p className="mt-2">Built with ❤️ using React, Vite, Wagmi & Avail Nexus SDK</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Game History Modal */}
      <GameHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      
      {/* Bridge & Execute Demo Modal */}
      {showBridgeDemo && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-green-900 rounded-3xl shadow-2xl border-2 border-green-500/50 max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-green-500/30 bg-gradient-to-r from-green-600/20 to-blue-600/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">🌉 Bridge & Execute Demo</h2>
                <button
                  onClick={() => setShowBridgeDemo(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-all hover:rotate-90"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <BridgeExecuteDemo />
            </div>
          </div>
        </div>
      )}
      
      {/* Nexus Demo Modal */}
      {showNexusDemo && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl shadow-2xl border-2 border-purple-500/50 max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">🌉 Nexus SDK Demo</h2>
                <button
                  onClick={() => setShowNexusDemo(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-all hover:rotate-90"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <NexusDemo />
            </div>
          </div>
        </div>
      )}
      
      {/* Nexus Event Logger */}
      <NexusEventLogger />
      
      {/* Nexus Notifications */}
      <NexusNotification />
      
      {/* Nexus Debug Panel */}
      <NexusDebugPanel />
    </div>
  );
}

export default function App() {
  return (
    <NexusErrorBoundary>
      <NexusProvider>
        <AppContent />
      </NexusProvider>
    </NexusErrorBoundary>
  );
}
