"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { CHAINS } from "@/lib";

export type RpcSample = {
  url: string;
  latest?: { number?: bigint; timestamp?: bigint };
  finalized?: { number?: bigint; timestamp?: bigint };
  error?: string;
};

export function useRpcMonitoring(
  chainId: number,
  rpcUrls: readonly string[],
  pollingInterval: number = 3000
) {
  const [rpcSamples, setRpcSamples] = useState<RpcSample[]>(() =>
    rpcUrls.map((url) => ({ url }))
  );

  useEffect(() => {
    let cancelled = false;
    const chainRef = CHAINS.find((c) => c.id === chainId)!;
    const clients = rpcUrls.map((url) => ({
      url,
      client: createPublicClient({ chain: chainRef, transport: http(url) }),
    }));

    async function tick() {
      try {
        const results = await Promise.all(
          clients.map(async ({ url, client }) => {
            try {
              const [latestBlock, finalizedBlock] = await Promise.all([
                client.getBlock({ blockTag: "latest" }),
                client.getBlock({ blockTag: "finalized" }),
              ]);
              return {
                url,
                latest: {
                  number: latestBlock.number,
                  timestamp: latestBlock.timestamp,
                },
                finalized: {
                  number: finalizedBlock.number,
                  timestamp: finalizedBlock.timestamp,
                },
              } as RpcSample;
            } catch (e) {
              const message = e instanceof Error ? e.message : String(e);
              return { url, error: message } as RpcSample;
            }
          })
        );
        if (!cancelled) setRpcSamples(results);
      } catch (e) {
        console.error("batch failure", e);
      }
    }

    tick();
    const id = setInterval(tick, pollingInterval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [chainId, rpcUrls, pollingInterval]);

  return rpcSamples;
}
