"use client";
import { useState } from "react";
import { CHAIN_CONFIGS } from "@/lib";
import { ChainSection, Container } from "@/components";

export default function Home() {
  const [statusByChain, setStatusByChain] = useState<
    Record<string, "healthy" | "lag" | "error">
  >({});

  function handleStatusChange(
    status: "healthy" | "lag" | "error",
    chainName: string
  ) {
    setStatusByChain((prev) =>
      prev[chainName] === status ? prev : { ...prev, [chainName]: status }
    );
  }

  const laggingChains = Object.entries(statusByChain)
    .filter(([, s]) => s === "lag")
    .map(([name]) => name);
  const errorChains = Object.entries(statusByChain)
    .filter(([, s]) => s === "error")
    .map(([name]) => name);
  const allReported =
    Object.keys(statusByChain).length === CHAIN_CONFIGS.length;
  const allHealthy =
    allReported && laggingChains.length === 0 && errorChains.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <Container>
        <div className="mb-2">
          {allHealthy ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-secondary text-primary text-xs font-medium">
              ✓ All chains healthy
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-1.5">
              {errorChains.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-red-100 text-red-800 text-xs font-medium">
                  ✗ Errors: {errorChains.join(", ")}
                </div>
              )}
              {laggingChains.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                  ⚠ Lagging: {laggingChains.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1">
          {CHAIN_CONFIGS.map((config) => (
            <ChainSection
              key={config.chainId}
              config={config}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
