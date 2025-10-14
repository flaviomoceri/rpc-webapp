"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useBlock } from "wagmi";
import { createPublicClient, http } from "viem";

import {
  CHAINS,
  CHAIN_CONFIGS,
  computeChainStatus,
  computeLagToRefSeconds,
  formatTimestamp,
  getReferenceTimestampMs,
} from "@/lib";
import { ChevronDownIcon, BlockInfoCard, RpcEndpointRow } from "@/components";

type ChainConfig = (typeof CHAIN_CONFIGS)[number];

type RpcSample = {
  url: string;
  latest?: { number?: bigint; timestamp?: bigint };
  finalized?: { number?: bigint; timestamp?: bigint };
  error?: string;
};

export function ChainSection({
  config,
  onStatusChange,
}: {
  config: ChainConfig;
  onStatusChange?: (
    status: "healthy" | "lag" | "error",
    chainName: string
  ) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    chainId,
    chain,
    thresholdMs,
    explorerPrefix,
    rpcUrls,
    iconUrl,
    iconAlt,
  } = config;

  const latest = useBlock({
    chainId,
    blockTag: "latest",
    watch: { emitMissed: true, poll: true, pollingInterval: 2000 },
    query: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 0,
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    },
  });

  const finalized = useBlock({
    chainId,
    blockTag: "finalized",
    watch: { emitMissed: true, poll: true, pollingInterval: 4000 },
    query: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 0,
      refetchInterval: 4000,
      refetchIntervalInBackground: true,
    },
  });

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
    const id = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [chainId, rpcUrls]);

  const referenceTsMs = useMemo(
    () => getReferenceTimestampMs(rpcSamples),
    [rpcSamples]
  );

  const chainStatus: "healthy" | "lag" | "error" = useMemo(
    () => computeChainStatus(rpcSamples, referenceTsMs, thresholdMs),
    [rpcSamples, referenceTsMs, thresholdMs]
  );

  useEffect(() => {
    if (onStatusChange) onStatusChange(chainStatus, chain.name);
  }, [chainStatus, chain.name, onStatusChange]);

  const statusDotClass = useMemo(() => {
    if (chainStatus === "healthy") return "bg-primary";
    if (chainStatus === "lag") return "bg-yellow-500";
    return "bg-red-500";
  }, [chainStatus]);

  const statusTextClass = useMemo(() => {
    if (chainStatus === "healthy") return "text-primary";
    if (chainStatus === "lag") return "text-yellow-600";
    return "text-red-600";
  }, [chainStatus]);

  const statusLabel = useMemo(() => {
    if (chainStatus === "healthy") return "Healthy";
    if (chainStatus === "lag") return "Lagging";
    return "Error";
  }, [chainStatus]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="p-2 md:p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
              <Image
                src={iconUrl}
                alt={iconAlt}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 md:flex-row md:gap-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {chain.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0 md:gap-4 ">
                <span className="text-sm text-gray-500">
                  Chain ID: {chainId}
                </span>
                <span className="text-sm text-gray-500">
                  {rpcUrls.length} RPCs
                </span>
                <span className="text-sm text-gray-500">
                  Threshold: {Math.round(thresholdMs / 1000)}s
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusDotClass}`} />
              <span className={`text-sm font-medium ${statusTextClass}`}>
                {statusLabel}
              </span>
            </div>
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Official Chain Data
              </h4>
              <div className="grid gap-6 sm:grid-cols-2">
                <BlockInfoCard
                  title="Latest Block"
                  dotColorClass="bg-green-500"
                  number={latest.data?.number}
                  timestamp={latest.data?.timestamp as bigint | undefined}
                  explorerPrefix={explorerPrefix}
                  formatTs={formatTimestamp}
                />
                <BlockInfoCard
                  title="Finalized Block"
                  dotColorClass="bg-blue-500"
                  number={finalized.data?.number}
                  timestamp={finalized.data?.timestamp as bigint | undefined}
                  explorerPrefix={explorerPrefix}
                  formatTs={formatTimestamp}
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                RPC Endpoints Monitoring
              </h4>
              <div className="space-y-4">
                {rpcSamples.map((r) => {
                  const lagToRefSeconds = computeLagToRefSeconds(
                    r.latest?.timestamp,
                    referenceTsMs
                  );
                  const overThreshold =
                    typeof lagToRefSeconds === "number" &&
                    lagToRefSeconds * 1000 > thresholdMs;
                  return (
                    <RpcEndpointRow
                      key={r.url}
                      data={r}
                      explorerPrefix={explorerPrefix}
                      lagToRefSeconds={lagToRefSeconds}
                      overThreshold={overThreshold}
                      referenceTsMs={referenceTsMs}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
