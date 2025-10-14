import {
  formatTimestamp,
  getStatusBorderClass,
  getStatusDotClass,
  type Status,
} from "@/lib";
import { BlockNumber } from "@/components";

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
            <div className="text-red-600 text-xs">
              <div className="font-medium">Error</div>
              <div className="text-[10px] mt-1">{data.error}</div>
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
                <div className="text-[10px] text-gray-500">
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
