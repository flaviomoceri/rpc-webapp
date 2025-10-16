"use client";

import { useQuery } from "@tanstack/react-query";
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
  const { data, error, isStale } = useQuery({
    queryKey: ["rpc", chainId, rpcUrls],
    // Fetch all endpoints together so the UI updates atomically
    queryFn: async (): Promise<RpcSample[]> => {
      const results = await Promise.all(
        rpcUrls.map((url) => fetchRpcData(chainId, url))
      );
      return results;
    },
    // Keep polling in the background
    refetchInterval: pollingInterval,
    // 10 seconds stale time - data becomes muted after this period
    staleTime: 10_000,
    gcTime: 2 * 60 * 1000,
    retry: 5,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10000),
    // Reduce layout shifts on focus by not forcing immediate refetch
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  if (error) {
    // Map errors to per-endpoint samples while preserving order
    return rpcUrls.map((url) => ({
      url,
      error: (error as Error).message,
      isStale,
      latest: undefined,
      finalized: undefined,
    }));
  }

  // On first load, before data arrives, return placeholders in order
  if (!data) {
    return rpcUrls.map(
      (url) =>
        ({
          url,
          isStale: true,
          latest: undefined,
          finalized: undefined,
        } as RpcSample)
    );
  }

  return data.map((s) => ({ ...s, isStale }));
}
