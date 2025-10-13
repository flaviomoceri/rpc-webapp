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
