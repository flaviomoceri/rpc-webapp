import { type StatusSummaryProps } from "@/lib";
import { Small } from "@/components";

export function StatusSummary({
  statusByChain,
  totalChains,
}: StatusSummaryProps) {
  const baseCSSBadge =
    "inline-flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium";

  const laggingChains = Object.entries(statusByChain)
    .filter(([, status]) => status === "lag")
    .map(([name]) => name);

  const errorChains = Object.entries(statusByChain)
    .filter(([, status]) => status === "error")
    .map(([name]) => name);

  const allReported = Object.keys(statusByChain).length === totalChains;
  const allHealthy =
    allReported && laggingChains.length === 0 && errorChains.length === 0;

  if (allHealthy) {
    return (
      <div className={`${baseCSSBadge} bg-secondary`}>
        <Small className="font-medium text-primary">✓ All chains healthy</Small>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-1.5">
      {errorChains.length > 0 && (
        <div className={`${baseCSSBadge} bg-red-100`}>
          <Small className="font-medium text-red-800">
            ✗ Errors: {errorChains.join(", ")}
          </Small>
        </div>
      )}
      {laggingChains.length > 0 && (
        <div className={`${baseCSSBadge} bg-yellow-100`}>
          <Small className="font-medium text-yellow-800">
            ⚠ Lagging: {laggingChains.join(", ")}
          </Small>
        </div>
      )}
    </div>
  );
}
