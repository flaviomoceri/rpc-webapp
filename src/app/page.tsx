"use client";

import { useMemo } from "react";
import { useBlock } from "wagmi";
import { POLYGON_CHAIN_ID, CHAIN_FINALITY_THRESHOLD_MS } from "@/lib/wagmi";
import { formatTimestamp } from "@/lib/utils";

export default function Home() {
  
  // Watch latest and finalized blocks on Polygon with lightweight polling via Wagmi.
  const latest = useBlock({
    chainId: POLYGON_CHAIN_ID,
    blockTag: "latest",
    watch: { emitMissed: true, poll: true, pollingInterval: 2000 },
    query: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 0,
      // Ensure periodic refresh even if watch does not trigger
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    },
  });

  console.log(latest.data?.number?.toString());

  const finalized = useBlock({
    chainId: POLYGON_CHAIN_ID,
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

  const lag = useMemo(() => {
    const latestTs = latest.data?.timestamp ? Number(latest.data.timestamp) * 1000 : undefined;
    const finalizedTs = finalized.data?.timestamp ? Number(finalized.data.timestamp) * 1000 : undefined;
    if (!latestTs || !finalizedTs) return undefined;
    return latestTs - finalizedTs;
  }, [latest.data?.timestamp, finalized.data?.timestamp]);

  const thresholdMs = CHAIN_FINALITY_THRESHOLD_MS[POLYGON_CHAIN_ID] ?? 30_000;
  const isBehindThreshold = typeof lag === "number" && lag > thresholdMs;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-1">Polygon Blocks</h1>
      <p className="mb-4 text-sm opacity-70">chainId: {POLYGON_CHAIN_ID}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-md border p-4 ${isBehindThreshold ? "border-red-500" : "border-[color:var(--foreground)]/15"}`}>
          <h2 className="font-mono text-sm mb-2">latest</h2>
          {latest.isPending ? (
            <p>Loading…</p>
          ) : latest.isError ? (
            <p className="text-red-500">Error: {(latest.error as Error)?.message}</p>
          ) : (
            <div className="text-sm">
              <div>number: {latest.data?.number?.toString()}</div>
              <div>
                hash: {latest.data?.hash}
                {latest.data?.hash && (
                  <>
                    {" "}
                    <a className="underline" target="_blank" rel="noreferrer" href={`https://polygonscan.com/block/${latest.data?.number?.toString()}`}>view on PolygonScan</a>
                  </>
                )}
              </div>
              <div>timestamp: {formatTimestamp(latest.data?.timestamp as bigint | undefined)}</div>
            </div>
          )}
        </div>
        <div className={`rounded-md border p-4 ${isBehindThreshold ? "border-red-500" : "border-[color:var(--foreground)]/15"}`}>
          <h2 className="font-mono text-sm mb-2">finalized</h2>
          {finalized.isPending ? (
            <p>Loading…</p>
          ) : finalized.isError ? (
            <p className="text-red-500">Error: {(finalized.error as Error)?.message}</p>
          ) : (
            <div className="text-sm">
              <div>number: {finalized.data?.number?.toString()}</div>
              <div>
                hash: {finalized.data?.hash}
                {finalized.data?.hash && (
                  <>
                    {" "}
                    <a className="underline" target="_blank" rel="noreferrer" href={`https://polygonscan.com/block/${finalized.data?.number?.toString()}`}>view on PolygonScan</a>
                  </>
                )}
              </div>
              <div>timestamp: {formatTimestamp(finalized.data?.timestamp as bigint | undefined)}</div>
            </div>
          )}
        </div>
      </div>
      {typeof lag === "number" && (
        <p className={`mt-4 text-sm ${isBehindThreshold ? "text-red-500" : "opacity-70"}`}>
          Lag between latest and finalized: {Math.round(lag / 1000)}s (threshold: {Math.round(thresholdMs / 1000)}s)
        </p>
      )}
    </div>
  );
}
