import { Activity, ChevronRight, Globe2, RadioTower } from "lucide-react";

type NationalGridMapProps = {
  connectedNodes: number;
};

const hierarchy = ["Village", "Block", "District", "State", "National", "WHO"];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export function NationalGridMap({ connectedNodes }: NationalGridMapProps) {
  return (
    <section className="cyber-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79e1cf]">
            National mesh
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#f3f0e8]">
            One grid. Six layers of reach.
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#79e1cf]/20 bg-[#79e1cf]/[0.06] px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#79e1cf] opacity-35" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#79e1cf]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#bdece4]">
            {formatNumber(connectedNodes)} connected
          </span>
        </div>
      </div>
      <div className="relative grid min-h-[260px] overflow-hidden bg-[#0b111b] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(121,225,207,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(121,225,207,.09)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgba(63,156,143,.13),transparent_52%)]" />
        <div className="relative flex flex-col justify-between gap-8 border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-[#8d9ba9]">
            <RadioTower className="h-4 w-4 text-[#79e1cf]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
              Live topology
            </span>
          </div>
          <div>
            <p className="font-mono text-5xl font-medium tracking-[-0.07em] text-[#f3f0e8] sm:text-6xl">
              {formatNumber(connectedNodes)}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#9aa7b4]">
              Connected nodes reported by the live grid snapshot.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#81909e]">
            <Activity className="h-3.5 w-3.5 text-[#79e1cf]" />
            <span>Realtime network summary</span>
          </div>
        </div>
        <div className="relative flex flex-col justify-center p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d9ba9]">
                Authority hierarchy
              </p>
              <p className="mt-1 text-xs text-[#667686]">
                Geographic distribution is not included in this snapshot.
              </p>
            </div>
            <Globe2 className="h-5 w-5 shrink-0 text-[#79e1cf]/70" />
          </div>
          <div className="flex flex-wrap items-center gap-y-2">
            {hierarchy.map((level, index) => (
              <div className="flex items-center" key={level}>
                <div
                  className={`rounded-lg border px-2.5 py-2 text-[11px] font-semibold sm:px-3 ${
                    index === hierarchy.length - 1
                      ? "border-[#ff8a73]/25 bg-[#ff8a73]/[0.08] text-[#ffb2a2]"
                      : index === hierarchy.length - 2
                        ? "border-[#79e1cf]/30 bg-[#79e1cf]/[0.09] text-[#bdece4]"
                        : "border-white/[0.09] bg-[#101a25]/80 text-[#bdc7ce]"
                  }`}
                >
                  {level}
                </div>
                {index < hierarchy.length - 1 && (
                  <ChevronRight className="mx-1 h-3.5 w-3.5 text-[#60717e]" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-white/[0.07] pt-4 text-[11px] leading-relaxed text-[#768593]">
            Schematic hierarchy only — no map coordinates or location-level node counts are available here.
          </p>
        </div>
      </div>
    </section>
  );
}
