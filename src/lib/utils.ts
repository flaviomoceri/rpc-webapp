import { type RpcSampleLike } from "./types";

export function getStaleOpacity(isStale?: boolean): string {
  return isStale ? "opacity-50" : "";
}

export function formatRelativeTime(ts?: bigint | number): string {
  if (!ts && ts !== 0) return "—";
  const seconds = typeof ts === "bigint" ? Number(ts) : ts;
  const ms = seconds * 1000;
  const diffMs = Math.max(0, Date.now() - ms);
  const diffSec = Math.floor(diffMs / 1000);

  const days = Math.floor(diffSec / (24 * 60 * 60));
  const hours = Math.floor((diffSec % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffSec % (60 * 60)) / 60);
  const secs = diffSec % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.length > 0 ? `${parts.join(" ")} ago` : "0s ago";
}

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

export function getReferenceBlockNumber(
  samples: RpcSampleLike[]
): bigint | undefined {
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
  return best.latest!.number as bigint;
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
  thresholdMs: number,
  maxBlocksBehind?: number
): "healthy" | "lag" | "error" {
  const hasErrors = samples.some((r) => r.error);
  if (hasErrors) return "error";

  const hasLagIssues = samples.some((r) => {
    const tsMs = r.latest?.timestamp
      ? Number(r.latest.timestamp) * 1000
      : undefined;
    const lagToRef = tsMs && referenceTsMs ? referenceTsMs - tsMs : undefined;

    // Time-based lag check
    const timeLag = typeof lagToRef === "number" && lagToRef > thresholdMs;

    // Block-based lag check (if maxBlocksBehind is configured)
    let blockLag = false;
    if (maxBlocksBehind && referenceTsMs && tsMs) {
      const actualBlocksBehind =
        Number(getReferenceBlockNumber(samples) || 0) -
        Number(r.latest?.number || 0);
      blockLag = actualBlocksBehind > maxBlocksBehind;
    }

    return timeLag || blockLag;
  });

  if (hasLagIssues) return "lag";
  return "healthy";
}
