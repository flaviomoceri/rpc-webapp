import {
  getStatusBorderClass,
  getStatusDotClass,
  getStaleOpacity,
  type RpcEndpointRowProps,
  type Status,
} from "@/lib";
import { BlockNumber, H4, Small, Tiny } from "@/components";

export function RpcEndpointRow({
  data,
  explorerPrefix,
  lagToRefSeconds,
  overThreshold,
  referenceBlockNumber,
}: RpcEndpointRowProps) {
  const hasError = !!data.error;
  const status: Status = hasError ? "error" : overThreshold ? "lag" : "healthy";

  const containerBorderClass = getStatusBorderClass(status);
  const statusDotClass = getStatusDotClass(status);
  const isStaleOpacity = getStaleOpacity(data.isStale);
  const overThresholdClass = overThreshold ? "text-yellow-600" : "text-primary";

  return (
    <div className={`bg-white rounded-md border p-3 ${containerBorderClass}`}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-1">
          <div className="flex flex-row gap-1.5 items-center">
            <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-gray-600 break-all hover:text-primary transition-colors font-mono break-all"
            >
              {new URL(data.url).host}
            </a>
          </div>
        </div>

        <div className="lg:col-span-1">
          <BlockNumber
            number={data.latest?.number}
            timestamp={data.latest?.timestamp}
            hasError={hasError}
            explorerPrefix={explorerPrefix}
            isStale={data.isStale}
          />
        </div>

        <div className="lg:col-span-1">
          <BlockNumber
            number={data.finalized?.number}
            timestamp={data.finalized?.timestamp}
            hasError={hasError}
            explorerPrefix={explorerPrefix}
            isStale={data.isStale}
          />
        </div>

        <div className="lg:col-span-1">
          {hasError ? (
            <div>
              <Small className="font-bold text-gray-900">—</Small>
            </div>
          ) : (
            <div>
              <Small className={`font-bold text-gray-900 ${isStaleOpacity}`}>
                {data.latest?.number && data.finalized?.number
                  ? (data.latest.number - data.finalized.number).toString()
                  : "—"}
              </Small>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {hasError ? (
            <div>
              <H4 className="text-red-600">Error</H4>
              <Tiny className="text-red-600">{data.error}</Tiny>
            </div>
          ) : (
            <div>
              {typeof lagToRefSeconds === "number" &&
                referenceBlockNumber &&
                data.latest?.number && (
                  <Small
                    className={`font-medium ${overThresholdClass} ${isStaleOpacity}`}
                  >
                    {Number(referenceBlockNumber - data.latest.number)} blocks (
                    {Math.round(lagToRefSeconds)}s)
                  </Small>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
