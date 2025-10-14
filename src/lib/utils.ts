export function formatTimestamp(ts?: bigint | number): string {
  if (!ts && ts !== 0) return "—";
  const seconds = typeof ts === "bigint" ? Number(ts) : ts;
  const ms = seconds * 1000;
  const date = new Date(ms);
  const absolute = date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const diffSec = Math.max(0, Math.round((Date.now() - ms) / 1000));
  return `${absolute} (${diffSec}s ago)`;
}

export type RpcBlock = {
  number?: bigint;
  timestamp?: bigint;
};

export type RpcSampleLike = {
  latest?: RpcBlock;
  error?: string;
};

export function getReferenceTimestampMs(
  samples: RpcSampleLike[]
): number | undefined {
  const withLatestNumbers = samples.filter(
    (r) => r.latest?.number && r.latest?.timestamp
  );
  if (withLatestNumbers.length === 0) return undefined;
  let best = withLatestNumbers[0];
  for (let i = 1; i < withLatestNumbers.length; i++) {
    const cur = withLatestNumbers[i];
    if ((cur.latest!.number as bigint) > (best.latest!.number as bigint))
      best = cur;
  }
  return Number(best.latest!.timestamp as bigint) * 1000;
}

export function computeLagToRefSeconds(
  latestTs?: bigint,
  referenceTsMs?: number
): number | undefined {
  const tsMs = latestTs ? Number(latestTs) * 1000 : undefined;
  const lagToRef = tsMs && referenceTsMs ? referenceTsMs - tsMs : undefined;
  return typeof lagToRef === "number" ? lagToRef / 1000 : undefined;
}

export function computeChainStatus(
  samples: RpcSampleLike[],
  referenceTsMs: number | undefined,
  thresholdMs: number
): "healthy" | "lag" | "error" {
  const hasErrors = samples.some((r) => r.error);
  if (hasErrors) return "error";
  const hasLagIssues = samples.some((r) => {
    const tsMs = r.latest?.timestamp
      ? Number(r.latest.timestamp) * 1000
      : undefined;
    const lagToRef = tsMs && referenceTsMs ? referenceTsMs - tsMs : undefined;
    return typeof lagToRef === "number" && lagToRef > thresholdMs;
  });
  if (hasLagIssues) return "lag";
  return "healthy";
}
