import { ExternalLinkIcon } from "@/components";

type BlockInfoCardProps = {
  title: string;
  dotColorClass: string;
  number?: bigint;
  timestamp?: bigint;
  explorerPrefix?: string;
  formatTs: (ts?: bigint | number) => string;
};

export function BlockInfoCard({
  title,
  dotColorClass,
  number,
  timestamp,
  explorerPrefix,
  formatTs,
}: BlockInfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${dotColorClass}`}></div>
        <h5 className="font-semibold text-gray-900">{title}</h5>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          #{number?.toString() ?? "—"}
        </div>
        <div className="text-sm text-gray-600">{formatTs(timestamp)}</div>
        {explorerPrefix && number && (
          <a
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            href={`${explorerPrefix}${number.toString()}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>View on explorer</span>
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
