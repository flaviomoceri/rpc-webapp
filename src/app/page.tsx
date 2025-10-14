"use client";
import { useState } from "react";
import { CHAIN_CONFIGS, type Status } from "@/lib";
import { ChainSection, Container, StatusSummary } from "@/components";

export default function Home() {
  const [statusByChain, setStatusByChain] = useState<Record<string, Status>>(
    {}
  );

  function handleStatusChange(status: Status, chainName: string) {
    setStatusByChain((prev) =>
      prev[chainName] === status ? prev : { ...prev, [chainName]: status }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <Container>
        <div className="mb-2">
          <StatusSummary
            statusByChain={statusByChain}
            totalChains={CHAIN_CONFIGS.length}
          />
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
