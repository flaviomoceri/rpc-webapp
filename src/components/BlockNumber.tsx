import {
  formatRelativeTime,
  getStaleOpacity,
  type BlockNumberProps,
} from "@/lib";
import { Small } from "@/components";

export function BlockNumber({
  number,
  timestamp,
  hasError,
  explorerPrefix,
  isStale,
}: BlockNumberProps) {
  const isStaleOpacity = getStaleOpacity(isStale);

  return (
    <div>
      <Small className={`font-bold text-gray-900 ${isStaleOpacity}`}>
        {hasError || !number ? (
          <>#—</>
        ) : explorerPrefix ? (
          <a
            className={`hover:text-primary transition-colors ${isStaleOpacity}`}
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
          <span
            className={`text-[10px] text-gray-500 font-normal ml-1 ${isStaleOpacity}`}
          >
            ({formatRelativeTime(timestamp)})
          </span>
        )}
      </Small>
    </div>
  );
}
