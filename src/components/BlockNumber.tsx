import { formatTimestamp } from "@/lib";

type BlockNumberProps = {
  number?: bigint;
  timestamp?: bigint;
  hasError: boolean;
  explorerPrefix?: string;
};

export function BlockNumber({
  number,
  timestamp,
  hasError,
  explorerPrefix,
}: BlockNumberProps) {
  return (
    <div>
      <div className="text-xs font-bold text-gray-900">
        {hasError || !number ? (
          <>#—</>
        ) : explorerPrefix ? (
          <a
            className="hover:text-primary transition-colors"
            href={`${explorerPrefix}${number.toString()}`}
            target="_blank"
            rel="noreferrer"
          >
            #{number.toString()}
          </a>
        ) : (
          <>#{number.toString()}</>
        )}
      </div>
      <div className="text-[10px] text-gray-600">
        {hasError ? "" : formatTimestamp(timestamp)}
      </div>
    </div>
  );
}
