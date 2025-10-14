import { ExternalLinkIcon } from "@/components";
import { formatTimestamp } from "@/lib";

type EndpointData = {
  url: string;
  latest?: { number?: bigint; timestamp?: bigint };
  finalized?: { number?: bigint; timestamp?: bigint };
  error?: string;
};

type RpcEndpointRowProps = {
  data: EndpointData;
  explorerPrefix?: string;
  lagToRefSeconds?: number;
  overThreshold: boolean;
  referenceTsMs?: number;
};

function StatusBadge({ status }: { status: "healthy" | "lag" | "error" }) {
  const badgeClass =
    status === "healthy"
      ? "bg-secondary text-primary"
      : status === "lag"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  const label =
    status === "healthy"
      ? "✓ Healthy"
      : status === "lag"
      ? "⚠ Lagging"
      : "✗ Error";

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}
    >
      {label}
    </div>
  );
}

export function RpcEndpointRow({
  data,
  explorerPrefix,
  lagToRefSeconds,
  overThreshold,
  referenceTsMs,
}: RpcEndpointRowProps) {
  const hasError = !!data.error;
  const status: "healthy" | "lag" | "error" = hasError
    ? "error"
    : overThreshold
    ? "lag"
    : "healthy";

  const containerBorderClass =
    status === "healthy"
      ? "border-green-200"
      : status === "lag"
      ? "border-yellow-200"
      : "border-red-200";
  const statusDotClass =
    status === "healthy"
      ? "bg-primary"
      : status === "lag"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className={`bg-white rounded-lg border p-6 ${containerBorderClass}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
            <span className="text-sm font-medium text-gray-900">Endpoint</span>
          </div>
          <div className="font-mono text-xs break-all text-gray-600 mb-3">
            {data.url}
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="lg:col-span-1">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Latest Block
          </div>
          {hasError ? (
            <div className="text-red-600 text-sm">Connection Error</div>
          ) : (
            <div className="space-y-1">
              <div className="text-lg font-bold text-gray-900">
                #{data.latest?.number?.toString() ?? "—"}
              </div>
              <div className="text-xs text-gray-600">
                {formatTimestamp(data.latest?.timestamp)}
              </div>
              {explorerPrefix && data.latest?.number && (
                <a
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
                  href={`${explorerPrefix}${data.latest.number.toString()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>View</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Finalized Block
          </div>
          {hasError ? (
            <div className="text-red-600 text-sm">Connection Error</div>
          ) : (
            <div className="space-y-1">
              <div className="text-lg font-bold text-gray-900">
                #{data.finalized?.number?.toString() ?? "—"}
              </div>
              <div className="text-xs text-gray-600">
                {formatTimestamp(data.finalized?.timestamp)}
              </div>
              {explorerPrefix && data.finalized?.number && (
                <a
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
                  href={`${explorerPrefix}${data.finalized.number.toString()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>View</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Performance
          </div>
          {hasError ? (
            <div className="text-red-600 text-sm">
              <div className="font-medium">Error</div>
              <div className="text-xs mt-1">{data.error}</div>
            </div>
          ) : (
            <div className="space-y-1">
              {typeof lagToRefSeconds === "number" && (
                <div
                  className={`text-sm font-medium ${
                    overThreshold ? "text-yellow-600" : "text-primary"
                  }`}
                >
                  Lag: {Math.round(lagToRefSeconds)}s
                </div>
              )}
              {typeof referenceTsMs === "number" && (
                <div className="text-xs text-gray-500">
                  Ref:{" "}
                  {formatTimestamp(BigInt(Math.floor(referenceTsMs / 1000)))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
