import { useMemo } from "react";
import { Activity, ArrowLeft, Building2, CircleHelp, HeartPulse, RefreshCw, Users } from "lucide-react";
import { Link } from "wouter";
import { useGridSnapshot } from "@/hooks/useGridSnapshot";
import { BloodBalance } from "@/components/BloodBalance";
import { GridMetric } from "@/components/GridMetric";
import { LiveAlerts } from "@/components/LiveAlerts";
import { NationalGridMap } from "@/components/NationalGridMap";

type GridConsoleProps = {
  view: "authority" | "founder";
};

const number = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainder = wholeSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function LoadingConsole() {
  return (
    <div className="space-y-5" aria-label="Loading live grid snapshot">
      <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" key={index} />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="h-80 animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

export function GridConsole({ view }: GridConsoleProps) {
  const query = useGridSnapshot();
  const snapshot = query.data;
  const updatedLabel = useMemo(
    () => snapshot ? formatUpdatedAt(snapshot.updatedAt) : null,
    [snapshot?.updatedAt],
  );
  const isOld = Boolean(
    snapshot &&
      Number.isFinite(new Date(snapshot.updatedAt).getTime()) &&
      Date.now() - new Date(snapshot.updatedAt).getTime() > 120_000,
  );
  const authorityView = view === "authority";

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[#0b1019] text-[#f3f0e8]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.55%27/%3E%3C/svg%3E')]" />
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0b1019]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <Link href="/" className="flex items-center gap-2 text-[#9aa7b4] transition-colors hover:text-[#f3f0e8]" aria-label="Return to home">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden text-xs font-semibold sm:inline">Rakt Kavach</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-[#79e1cf]/20 bg-[#79e1cf]/[0.08]">
              <HeartPulse className="h-4 w-4 text-[#79e1cf]" />
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-[0.08em] text-[#f3f0e8]">
                RAKT KAVACH
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#73818f]">
                National blood grid
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#79e1cf]/15 bg-[#79e1cf]/[0.05] px-2.5 py-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${query.isError && !snapshot ? "bg-[#ff8a73]" : query.isFetching ? "bg-[#e6c98e]" : "bg-[#79e1cf]"}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#bfd1d0]">
              {query.isError && !snapshot ? "Unavailable" : query.isFetching ? "Syncing" : "Live feed"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pb-12 pt-7 sm:px-7 sm:pt-10">
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131d29] px-5 py-6 sm:px-8 sm:py-8">
          <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-[#79e1cf]/[0.08]" />
          <div className="absolute -right-2 -top-14 h-56 w-56 rounded-full border border-[#79e1cf]/[0.08]" />
          <div className="absolute right-14 top-12 h-24 w-24 rounded-full bg-[#79e1cf]/[0.04] blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#79e1cf]">
                <Activity className="h-3.5 w-3.5" />
                {authorityView ? "Operations overview" : "Read-only oversight"}
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.055em] text-[#f3f0e8] sm:text-5xl">
                {authorityView ? "The national grid," : "Integrity across"}{" "}
                <span className="text-[#79e1cf]">{authorityView ? "in real time." : "the live grid."}</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9aa7b4]">
                {authorityView
                  ? "A live view of connected blood-network capacity, active demand, and response performance."
                  : "A live, read-only view of network capacity, blood availability, and active demand."}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${
                isOld
                  ? "border-[#e6c98e]/20 bg-[#e6c98e]/[0.06] text-[#e6c98e]"
                  : "border-[#79e1cf]/20 bg-[#79e1cf]/[0.06] text-[#a9e9de]"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isOld ? "bg-[#e6c98e]" : "bg-[#79e1cf]"}`} />
                {isOld ? "Snapshot may be stale" : "Snapshot timestamp"}
              </div>
              <p className="font-mono text-[10px] text-[#8d9ba9]">
                {updatedLabel ?? "No timestamp available"}
              </p>
            </div>
          </div>
        </section>

        {query.isError && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#ff8a73]/20 bg-[#ff8a73]/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9b86]" />
              <div>
                <p className="text-xs font-bold text-[#ffd0c6]">
                  {snapshot ? "Live refresh failed" : "Live grid data unavailable"}
                </p>
                <p className="mt-1 text-xs text-[#c38c83]">
                  {snapshot
                    ? "Showing the last successful snapshot. Retry to check for updates."
                    : "The command center cannot display metrics until the live snapshot is reachable."}
                </p>
              </div>
            </div>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#ff8a73]/20 px-3 py-2 text-xs font-bold text-[#ffc0b2] transition-colors hover:bg-[#ff8a73]/10 sm:self-center"
              onClick={() => void query.refetch()}
              type="button"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {!snapshot && query.isPending ? (
          <LoadingConsole />
        ) : snapshot ? (
          <>
            {!query.isError && query.isSuccess && snapshot.connectedNodes === 0 && snapshot.inventoryUnits === 0 && snapshot.demandUnits === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-[#9aa7b4]">
                The live connection is available, but the current snapshot contains no reported activity yet.
              </div>
            )}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <GridMetric
                detail={`${number(snapshot.totalDonors)} donors · ${number(snapshot.totalHospitals)} hospitals`}
                icon={<Users className="h-4 w-4" />}
                label="Connected nodes"
                value={number(snapshot.connectedNodes)}
                tone="mint"
              />
              <GridMetric
                detail="Current live blood inventory"
                icon={<HeartPulse className="h-4 w-4" />}
                label="Available inventory"
                value={number(snapshot.inventoryUnits)}
                unit="units"
                tone="coral"
              />
              <GridMetric
                detail="Units requested in active demand"
                icon={<Building2 className="h-4 w-4" />}
                label="Demand"
                value={number(snapshot.demandUnits)}
                unit="units"
                tone="sand"
              />
              <GridMetric
                detail="Average response time reported by the grid"
                icon={<Activity className="h-4 w-4" />}
                label="Avg. response"
                value={formatDuration(snapshot.averageResponseSeconds)}
                tone="mint"
              />
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111925]/80 px-4 py-3">
                <span className="text-xs text-[#9aa7b4]">Registered donors</span>
                <span className="font-mono text-sm text-[#e7e9e4]">{number(snapshot.totalDonors)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111925]/80 px-4 py-3">
                <span className="text-xs text-[#9aa7b4]">Connected hospitals</span>
                <span className="font-mono text-sm text-[#e7e9e4]">{number(snapshot.totalHospitals)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111925]/80 px-4 py-3">
                <span className="text-xs text-[#9aa7b4]">Open requests</span>
                <span className="font-mono text-sm text-[#ffad9d]">{number(snapshot.openAlerts)}</span>
              </div>
            </section>

            <NationalGridMap connectedNodes={snapshot.connectedNodes} />

            <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <BloodBalance snapshot={snapshot} />
              <LiveAlerts snapshot={snapshot} />
            </section>
          </>
        ) : query.isError ? null : (
          <div className="rounded-xl border border-white/[0.08] bg-[#111925] p-6 text-center">
            <p className="text-sm font-semibold text-[#dce3e2]">No snapshot returned</p>
            <p className="mt-1 text-xs text-[#81909e]">
              Live grid metrics will appear when a snapshot is available.
            </p>
          </div>
        )}

        <footer className="flex flex-col gap-2 border-t border-white/[0.07] pt-4 text-[10px] text-[#71808e] sm:flex-row sm:items-center sm:justify-between">
          <span>Rakt Kavach · Live grid snapshot</span>
          <span>
            {query.isFetching ? "Refreshing live data…" : updatedLabel ? `Last updated ${updatedLabel}` : "Update time unavailable"}
          </span>
        </footer>
      </main>
    </div>
  );
}
