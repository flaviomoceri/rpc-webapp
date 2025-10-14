"use client";

import { createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { fallback, http, type Chain, type Transport } from "viem";

// Plasma chain (Chain ID 9745 / 0x2611) from dRPC Chainlist
// Docs/Refs: https://plasma.drpc.org
const plasma: Chain = {
  id: 9745,
  name: "Plasma",
  nativeCurrency: { name: "XPL", symbol: "XPL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://plasma.drpc.org", "https://rpc.plasma.to"] },
    public: { http: ["https://plasma.drpc.org", "https://rpc.plasma.to"] },
  },
  blockExplorers: {
    default: { name: "PlasmaScan", url: "https://plasmascan.to" },
  },
};

// Unified chain configuration
export const chain = {
  polygon: {
    chainId: polygon.id,
    chain: polygon,
    rpcUrls: [
      "https://polygon-bor.publicnode.com",
      "https://polygon-rpc.com",
      "https://1rpc.io/matic",
    ],
    thresholdMs: 30_000,
    explorerPrefix: "https://polygonscan.com/block/",
    iconUrl: "https://icons-ckg.pages.dev/lz-dark/networks/polygon.svg",
    iconAlt: "Polygon",
  },
  plasma: {
    chainId: plasma.id,
    chain: plasma,
    rpcUrls: ["https://plasma.drpc.org", "https://rpc.plasma.to"],
    thresholdMs: 10_000,
    explorerPrefix: "https://plasmascan.to/block/",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/36645.png",
    iconAlt: "Plasma",
  },
} as const;

// Array of chain configurations for easy mapping
export const CHAIN_CONFIGS = [chain.polygon, chain.plasma] as const;

// Export chains array for Wagmi
export const CHAINS = [
  chain.polygon.chain,
  chain.plasma.chain,
] as const satisfies readonly [Chain, ...Chain[]];

// Build transports for Wagmi
function buildTransports(): Record<number, Transport> {
  const transports: Record<number, Transport> = {};

  transports[chain.polygon.chainId] = fallback(
    chain.polygon.rpcUrls.map((u) => http(u)),
    { rank: true, retryCount: 2 }
  );

  transports[chain.plasma.chainId] = fallback(
    chain.plasma.rpcUrls.map((u) => http(u)),
    { rank: true, retryCount: 2 }
  );

  return transports;
}

export const wagmiConfig = createConfig({
  chains: CHAINS,
  transports: buildTransports(),
  ssr: true,
});
