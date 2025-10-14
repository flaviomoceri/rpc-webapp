import { type Status } from "@/lib";

type StatusSummaryProps = {
  statusByChain: Record<string, Status>;
  totalChains: number;
};

export function StatusSummary({
  statusByChain,
  totalChains,
}: StatusSummaryProps) {
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
      <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-secondary text-primary text-xs font-medium">
        ✓ All chains healthy
      </div>
    );
  }

  return (
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
  );
}
