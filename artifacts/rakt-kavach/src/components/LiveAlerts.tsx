import { useEffect, useState } from "react";
import { AlertTriangle, Clock3 } from "lucide-react";
import type { GridSnapshot } from "@/hooks/useGridSnapshot";

type LiveAlertsProps = {
  snapshot: GridSnapshot;
};

const number = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

function formatAlertTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatElapsed(createdAt: string, now: number) {
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return "Unavailable";
  const elapsedSeconds = Math.max(0, Math.floor((now - created) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

export function LiveAlerts({ snapshot }: LiveAlertsProps) {
  const alerts = snapshot.alerts;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (alerts.length === 0) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [alerts.length]);

  return (
    <section className="cyber-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9b86]">
            Live requests
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#f3f0e8]">
            Emergency demand
          </h2>
        </div>
        <span className="rounded-full border border-[#ff8a73]/20 bg-[#ff8a73]/[0.08] px-2.5 py-1 font-mono text-[10px] text-[#ffb2a2]">
          {number(snapshot.openAlerts)} open
        </span>
      </div>
      {alerts.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-8 text-center">
          <AlertTriangle className="mx-auto h-5 w-5 text-[#788894]" />
          <p className="mt-3 text-sm font-semibold text-[#d4d9d9]">
            No active requests in the latest snapshot
          </p>
          <p className="mt-1 text-xs text-[#81909e]">
            New open or responding requests will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-white/[0.07]">
          {alerts.map((alert) => (
            <article className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={alert.id}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ff8a73]/15 bg-[#ff8a73]/[0.07] font-mono text-[10px] font-medium text-[#ffad9d]">
                {alert.blood_type}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#e8e8e2]">
                    {number(alert.units_requested)} units requested
                  </p>
                  <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#a1adb6]">
                    {alert.status}
                  </span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#81909e]">
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3 w-3" />
                    Open for {formatElapsed(alert.created_at, now)}
                  </span>
                  <span className="text-[#667686]">
                    {formatAlertTime(alert.created_at)}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
      {alerts.length > 0 && alerts.length < snapshot.openAlerts && (
        <p className="mt-4 border-t border-white/[0.07] pt-3 text-[10px] text-[#81909e]">
          Showing {number(alerts.length)} latest records. The snapshot reports {number(snapshot.openAlerts)} open requests.
        </p>
      )}
    </section>
  );
}
