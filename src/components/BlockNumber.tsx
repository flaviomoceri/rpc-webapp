import { formatRelativeTime, type BlockNumberProps } from "@/lib";
import { Small, Tiny } from "@/components";

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
      </Small>
      <Tiny>{hasError ? "" : formatRelativeTime(timestamp)}</Tiny>
    </div>
  );
}
