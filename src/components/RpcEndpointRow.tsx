import {
  formatTimestamp,
  getStatusBorderClass,
  getStatusDotClass,
  type RpcEndpointRowProps,
  type Status,
} from "@/lib";
import { BlockNumber, H4, Tiny } from "@/components";

export function RpcEndpointRow({
  data,
  explorerPrefix,
  lagToRefSeconds,
  overThreshold,
  referenceTsMs,
}: RpcEndpointRowProps) {
  const hasError = !!data.error;
  const status: Status = hasError ? "error" : overThreshold ? "lag" : "healthy";

  const containerBorderClass = getStatusBorderClass(status);
  const statusDotClass = getStatusDotClass(status);

  return (
    <div className={`bg-white rounded-md border p-3 ${containerBorderClass}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-1">
          <div className="inline-flex items-center gap-1.5 mb-1.5 text-[10px] text-gray-600 font-mono break-all">
            <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
            {data.url}
          </div>
        </div>

        <div className="lg:col-span-1">
          <BlockNumber
            number={data.latest?.number}
            timestamp={data.latest?.timestamp}
            hasError={hasError}
            explorerPrefix={explorerPrefix}
          />
        </div>

        <div className="lg:col-span-1">
          <BlockNumber
            number={data.finalized?.number}
            timestamp={data.finalized?.timestamp}
            hasError={hasError}
            explorerPrefix={explorerPrefix}
          />
        </div>

        <div className="lg:col-span-1">
          {hasError ? (
            <div>
              <H4 className="text-red-600">Error</H4>
              <Tiny className="text-red-600">{data.error}</Tiny>
            </div>
          ) : (
            <div>
              {typeof lagToRefSeconds === "number" && (
                <div
                  className={`text-xs font-medium ${
                    overThreshold ? "text-yellow-600" : "text-primary"
                  }`}
                >
                  Lag: {Math.round(lagToRefSeconds)}s
                </div>
              )}
              {typeof referenceTsMs === "number" && (
                <Tiny className="text-gray-500">
                  Ref:{" "}
                  {formatTimestamp(BigInt(Math.floor(referenceTsMs / 1000)))}
                </Tiny>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
