import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, polygon, mainnet, arbitrum, optimism } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { NexusProvider as AvailNexusProvider, useNexus } from "@avail-project/nexus-widgets";
import { useAccount } from "wagmi";
import { NexusWalletProvider } from "./NexusWalletProvider";

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [base, polygon, mainnet, arbitrum, optimism],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Nexus with window.ethereum
function NexusInitializer({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();
  const { setProvider } = useNexus();
  const [providerSet, setProviderSet] = useState(false);

  useEffect(() => {
    if (isConnected && !providerSet && typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereumProvider = (window as any).ethereum;
      
      console.log('✅ Setting Nexus provider with window.ethereum');
      try {
        setProvider(ethereumProvider);
        setProviderSet(true);
      } catch (error) {
        console.error('Error setting provider:', error);
      }
    }
  }, [isConnected, providerSet, setProvider]);

  return <>{children}</>;
}

export function NexusProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AvailNexusProvider
          config={{
            appName: "CrossChain Casino",
            supportedChains: [base.id, polygon.id, mainnet.id, arbitrum.id, optimism.id],
          }}
        >
          <NexusInitializer>
            <NexusWalletProvider>
              {children}
            </NexusWalletProvider>
          </NexusInitializer>
        </AvailNexusProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
