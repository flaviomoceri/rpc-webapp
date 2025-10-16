import { polygon, plasma } from "viem/chains";
import { type Chain } from "viem";

// Unified chain configuration
export const chain = {
  polygon: {
    chain: polygon,
    rpcUrls: [
      "https://polygon-bor.publicnode.com",
      "https://polygon-rpc.com",
      "https://1rpc.io/matic",
    ],
    thresholdMs: 30_000,
    maxBlocksBehind: 13, // ~30s at 0.43 blocks/s
    explorerPrefix: `${polygon.blockExplorers.default.url}/block/`,
    iconUrl: "https://icons-ckg.pages.dev/lz-dark/networks/polygon.svg",
    iconAlt: "Polygon",
  },
  plasma: {
    chain: plasma,
    rpcUrls: ["https://plasma.drpc.org", "https://rpc.plasma.to"],
    thresholdMs: 10_000,
    maxBlocksBehind: 10, // ~10s at 1 block/s
    explorerPrefix: `${plasma.blockExplorers.default.url}/block/`,
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/36645.png",
    iconAlt: "Plasma",
  },
} as const;

// Array of chain configurations for easy mapping
export const CHAIN_CONFIGS = Object.values(chain);

// Export chains array for viem clients (extracted from configs)
export const CHAINS = CHAIN_CONFIGS.map(
  (config) => config.chain
) as readonly Chain[];
