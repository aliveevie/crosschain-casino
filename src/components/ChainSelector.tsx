import { base, polygon, mainnet, arbitrum, optimism } from "wagmi/chains";

interface Chain {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  { id: base.id, name: "Base", icon: "🔵", color: "from-blue-500 to-blue-600" },
  { id: polygon.id, name: "Polygon", icon: "🟣", color: "from-purple-500 to-purple-600" },
  { id: mainnet.id, name: "Ethereum", icon: "⬥", color: "from-gray-500 to-gray-600" },
  { id: arbitrum.id, name: "Arbitrum", icon: "🔷", color: "from-blue-400 to-blue-500" },
  { id: optimism.id, name: "Optimism", icon: "🔴", color: "from-red-500 to-red-600" },
];

interface ChainSelectorProps {
  selectedChain: number;
  onSelect: (chainId: number) => void;
  label: string;
  excludeChain?: number;
}

export default function ChainSelector({ selectedChain, onSelect, label, excludeChain }: ChainSelectorProps) {
  const availableChains = SUPPORTED_CHAINS.filter(chain => chain.id !== excludeChain);
  const selected = SUPPORTED_CHAINS.find(c => c.id === selectedChain);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-white mb-3">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedChain}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer hover:bg-white/15 transition-all"
        >
          {availableChains.map((chain) => (
            <option key={chain.id} value={chain.id} className="bg-gray-900">
              {chain.icon} {chain.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {selected && (
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-2xl">{selected.icon}</span>
          <span className="text-sm text-gray-300">{selected.name} Network</span>
        </div>
      )}
    </div>
  );
}

export { SUPPORTED_CHAINS };
export type { Chain };

