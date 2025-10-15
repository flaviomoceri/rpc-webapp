import { type Chain } from "viem";

// Status types
export type Status = "healthy" | "lag" | "error";

// Chain configuration types
export type ChainConfig = {
  chainId: number;
  chain: Chain;
  rpcUrls: readonly string[];
  thresholdMs: number;
  explorerPrefix: string;
  iconUrl: string;
  iconAlt: string;
};

// RPC monitoring types
export type EndpointData = {
  url: string;
  latest?: { number?: bigint; timestamp?: bigint };
  finalized?: { number?: bigint; timestamp?: bigint };
  error?: string;
};

export type RpcEndpointRowProps = {
  data: EndpointData;
  explorerPrefix?: string;
  lagToRefSeconds?: number;
  overThreshold: boolean;
  referenceTsMs?: number;
};

// Component prop types
export type ChainSectionProps = {
  config: ChainConfig;
  onStatusChange?: (status: Status, chainName: string) => void;
};

export type StatusSummaryProps = {
  statusByChain: Record<string, Status>;
  totalChains: number;
};

export type BlockNumberProps = {
  number?: bigint;
  timestamp?: bigint;
  hasError: boolean;
  explorerPrefix?: string;
};

// Typography types
export type TypographyProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> & {
  children: React.ReactNode;
};

// RPC monitoring types (from utils.ts and hooks)
export type RpcBlock = {
  number?: bigint;
  timestamp?: bigint;
};

export type RpcSampleLike = {
  latest?: RpcBlock;
  error?: string;
};

export type RpcSample = {
  url: string;
  latest?: { number?: bigint; timestamp?: bigint };
  finalized?: { number?: bigint; timestamp?: bigint };
  error?: string;
};

// Component prop types (from components)
export type IconProps = {
  className?: string;
};

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};
