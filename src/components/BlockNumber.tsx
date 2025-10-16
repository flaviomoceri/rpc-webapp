import { formatRelativeTime, type BlockNumberProps } from "@/lib";
import { Small } from "@/components";

export function BlockNumber({
  number,
  timestamp,
  hasError,
  explorerPrefix,
}: BlockNumberProps) {
  return (
    <div>
      <Small className="font-bold text-gray-900">
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
        {!hasError && timestamp && (
          <span className="text-[10px] text-gray-500 font-normal ml-1">
            ({formatRelativeTime(timestamp)})
          </span>
        )}
      </Small>
    </div>
  );
}
