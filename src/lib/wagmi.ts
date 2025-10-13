"use client";

import { createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { fallback, http } from "viem";

// Configure two primary RPCs for Polygon with fallback & ranking.
const polygonTransport = fallback(
  [
    http("https://polygon-bor.publicnode.com"),
    http("https://rpc.ankr.com/polygon"),
  ],
  {
    rank: true,
    retryCount: 2,
  }
);

export const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: polygonTransport,
  },
  ssr: true,
});

export const POLYGON_CHAIN_ID = polygon.id;

// Finality/lag thresholds per chain (ms). Polygon ~30s.
export const CHAIN_FINALITY_THRESHOLD_MS: Record<number, number> = {
  [polygon.id]: 30_000,
};
