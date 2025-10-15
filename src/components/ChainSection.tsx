"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  computeChainStatus,
  computeLagToRefSeconds,
  getReferenceTimestampMs,
  getStatusDotClass,
  getStatusTextClass,
  getStatusLabel,
  type Status,
  type ChainSectionProps,
} from "@/lib";
import { useRpcMonitoring } from "@/hooks";
import { ChevronDownIcon, RpcEndpointRow, H3, Small, Tiny } from "@/components";

export function ChainSection({ config, onStatusChange }: ChainSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { chain, thresholdMs, explorerPrefix, rpcUrls, iconUrl, iconAlt } =
    config;

  const rpcSamples = useRpcMonitoring(chain.id, rpcUrls);

  const referenceTsMs = useMemo(
    () => getReferenceTimestampMs(rpcSamples),
    [rpcSamples]
  );

  const chainStatus: Status = useMemo(
    () => computeChainStatus(rpcSamples, referenceTsMs, thresholdMs),
    [rpcSamples, referenceTsMs, thresholdMs]
  );

  useEffect(() => {
    if (onStatusChange) onStatusChange(chainStatus, chain.name);
  }, [chainStatus, chain.name, onStatusChange]);

  const statusDotClass = getStatusDotClass(chainStatus);
  const statusTextClass = getStatusTextClass(chainStatus);
  const statusLabel = getStatusLabel(chainStatus);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="p-2 md:p-2 cursor-pointer hover:bg-gray-50 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
              <Image
                src={iconUrl}
                alt={iconAlt}
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-0.5 md:flex-row md:gap-3">
              <H3>{chain.name}</H3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 ">
                <Small>{rpcUrls.length} RPCs</Small>
                <Small>Threshold: {Math.round(thresholdMs / 1000)}s</Small>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${statusDotClass}`} />
              <span className={`text-xs font-medium ${statusTextClass}`}>
                {statusLabel}
              </span>
            </div>
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="space-y-2">
            <div className="hidden lg:grid grid-cols-4 gap-3 px-3 text-[11px] text-gray-500">
              <Tiny>Endpoint</Tiny>
              <Tiny>Latest Block</Tiny>
              <Tiny>Finalized Block</Tiny>
              <Tiny>Performance</Tiny>
            </div>
            <div>
              <div className="space-y-2">
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
