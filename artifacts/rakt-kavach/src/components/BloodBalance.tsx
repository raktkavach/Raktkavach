import { ArrowDownToLine, ArrowUpFromLine, Droplets } from "lucide-react";
import type { GridSnapshot } from "@/hooks/useGridSnapshot";

type BloodBalanceProps = {
  snapshot: GridSnapshot;
};

const number = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export function BloodBalance({ snapshot }: BloodBalanceProps) {
  const groups = snapshot.supplyByBloodType;
  const maxValue = Math.max(
    1,
    ...groups.flatMap((item) => [item.units, item.demand]),
  );

  return (
    <section className="cyber-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79e1cf]">
            Supply / demand
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#f3f0e8]">
            Blood inventory balance
          </h2>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#9aa7b4]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-[#79e1cf]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-[#ff8a73]" />
            Requested
          </span>
        </div>
      </div>
      {groups.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-8 text-center">
          <Droplets className="mx-auto h-5 w-5 text-[#788894]" />
          <p className="mt-3 text-sm font-semibold text-[#d4d9d9]">
            Blood-type breakdown unavailable
          </p>
          <p className="mt-1 text-xs text-[#81909e]">
            The latest snapshot contains no inventory or request groups.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map((group) => (
            <div className="grid grid-cols-[42px_1fr_84px] items-center gap-3 sm:grid-cols-[52px_1fr_110px]" key={group.bloodType}>
              <span className="font-mono text-xs font-medium text-[#dce3e2]">
                {group.bloodType}
              </span>
              <div className="space-y-1.5">
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#79e1cf]"
                    style={{ width: `${Math.max(group.units > 0 ? 1 : 0, (group.units / maxValue) * 100)}%` }}
                  />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-[#ff8a73]/80"
                    style={{ width: `${Math.max(group.demand > 0 ? 1 : 0, (group.demand / maxValue) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1 text-right font-mono text-[10px]">
                <div className="flex items-center justify-end gap-1 text-[#a9e9de]">
                  <ArrowDownToLine className="h-3 w-3" />
                  {number(group.units)}
                </div>
                <div className="flex items-center justify-end gap-1 text-[#ffad9d]">
                  <ArrowUpFromLine className="h-3 w-3" />
                  {number(group.demand)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-4 text-[10px] text-[#81909e]">
        <span>Units shown per blood type</span>
        <span className="font-mono">
          {number(snapshot.inventoryUnits)} available / {number(snapshot.demandUnits)} requested
        </span>
      </div>
    </section>
  );
}
