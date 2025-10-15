"use client";

import { useQueries } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { CHAINS, type RpcSample } from "@/lib";

async function fetchRpcData(chainId: number, url: string): Promise<RpcSample> {
  const chainRef = CHAINS.find((c) => c.id === chainId);
  if (!chainRef) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const client = createPublicClient({
    chain: chainRef,
    transport: http(url),
  });

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
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { url, error: message };
  }
}

export function useRpcMonitoring(
  chainId: number,
  rpcUrls: readonly string[],
  pollingInterval: number = 3000
) {
  const queries = useQueries({
    queries: rpcUrls.map((url) => ({
      queryKey: ["rpc", chainId, url],
      queryFn: () => fetchRpcData(chainId, url),
      refetchInterval: pollingInterval,
      staleTime: 1000,
      gcTime: 2 * 60 * 1000,
      retry: 5,
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    })),
  });

  const rpcSamples: RpcSample[] = queries.map((query, index) => {
    if (query.data) return query.data;
    if (query.error) {
      return {
        url: rpcUrls[index],
        error: query.error.message,
      };
    }
    return { url: rpcUrls[index] };
  });

  return rpcSamples;
}
