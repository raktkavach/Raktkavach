import type { ReactNode } from "react";

type GridMetricProps = {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  icon: ReactNode;
  tone?: "mint" | "coral" | "sand";
};

const toneClasses = {
  mint: "text-[#79e1cf] bg-[#79e1cf]/10",
  coral: "text-[#ff8a73] bg-[#ff8a73]/10",
  sand: "text-[#e6c98e] bg-[#e6c98e]/10",
};

export function GridMetric({
  label,
  value,
  unit,
  detail,
  icon,
  tone = "mint",
}: GridMetricProps) {
  return (
    <article className="cyber-card min-w-0 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8d9ba9]">
            {label}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-medium tracking-[-0.06em] text-[#f3f0e8] sm:text-[2.15rem]">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-semibold text-[#8d9ba9]">{unit}</span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#8d9ba9]">{detail}</p>
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClasses[tone]}`}>
          {icon}
        </span>
      </div>
    </article>
  );
}
