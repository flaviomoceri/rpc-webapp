"use client";
import { useState } from "react";
import { CHAIN_CONFIGS } from "@/lib";
import { H1, P, ChainSection, Container } from "@/components";

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
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <H1>
            RPC <span className="text-primary">Monitor</span>
          </H1>
          <P>
            Real-time monitoring of blockchain RPC endpoints with comprehensive
            health status tracking
          </P>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="mb-4">
          {allHealthy ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-primary text-sm font-medium">
              ✓ All chains healthy
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-2">
              {errorChains.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-100 text-red-800 text-sm font-medium">
                  ✗ Errors: {errorChains.join(", ")}
                </div>
              )}
              {laggingChains.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-yellow-100 text-yellow-800 text-sm font-medium">
                  ⚠ Lagging: {laggingChains.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-3">
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
