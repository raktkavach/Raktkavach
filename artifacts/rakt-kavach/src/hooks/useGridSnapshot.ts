import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requireSupabase, supabase } from "@/lib/supabase";

export type GridAlert = {
  id: string;
  blood_type: string;
  units_requested: number;
  status: string;
  created_at: string;
};

export type GridSnapshot = {
  connectedNodes: number;
  totalDonors: number;
  totalHospitals: number;
  inventoryUnits: number;
  demandUnits: number;
  openAlerts: number;
  averageResponseSeconds: number;
  supplyByBloodType: { bloodType: string; units: number; demand: number }[];
  alerts: GridAlert[];
  updatedAt: string;
};

const watchedTables = [
  "profiles",
  "donors",
  "hospitals",
  "blood_inventory",
  "blood_wallet",
  "emergency_requests",
];

async function loadGridSnapshot(): Promise<GridSnapshot> {
  const client = requireSupabase();
  const [summaryResult, inventoryResult, demandResult, alertResult] =
    await Promise.all([
      client.from("live_grid_summary").select("*").single(),
      client.from("blood_inventory").select("blood_type,units"),
      client
        .from("emergency_requests")
        .select("blood_type,units_requested")
        .in("status", ["open", "responding"]),
      client
        .from("emergency_requests")
        .select("id,blood_type,units_requested,status,created_at")
        .in("status", ["open", "responding"])
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

  const error =
    summaryResult.error ??
    inventoryResult.error ??
    demandResult.error ??
    alertResult.error;
  if (error) throw new Error(`Live grid data unavailable: ${error.message}`);

  const summary = summaryResult.data as Record<string, unknown>;
  const inventory = (inventoryResult.data ?? []) as {
    blood_type: string;
    units: number;
  }[];
  const demand = (demandResult.data ?? []) as {
    blood_type: string;
    units_requested: number;
  }[];
  const supply = new Map<string, number>();
  const demandByType = new Map<string, number>();
  for (const row of inventory) {
    supply.set(row.blood_type, (supply.get(row.blood_type) ?? 0) + row.units);
  }
  for (const row of demand) {
    demandByType.set(
      row.blood_type,
      (demandByType.get(row.blood_type) ?? 0) + row.units_requested,
    );
  }
  const groups = new Set([...supply.keys(), ...demandByType.keys()]);

  return {
    connectedNodes: Number(summary.connected_nodes ?? 0),
    totalDonors: Number(summary.total_donors ?? 0),
    totalHospitals: Number(summary.total_hospitals ?? 0),
    inventoryUnits: Number(summary.live_inventory_units ?? 0),
    demandUnits: Number(summary.demand_units ?? 0),
    openAlerts: Number(summary.open_alerts ?? 0),
    averageResponseSeconds: Number(summary.average_response_seconds ?? 0),
    supplyByBloodType: [...groups].sort().map((bloodType) => ({
      bloodType,
      units: supply.get(bloodType) ?? 0,
      demand: demandByType.get(bloodType) ?? 0,
    })),
    alerts: (alertResult.data ?? []) as GridAlert[],
    updatedAt: String(summary.updated_at ?? new Date().toISOString()),
  };
}

export function useGridSnapshot() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["live-grid-snapshot"],
    queryFn: loadGridSnapshot,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client.channel("rakt-kavach-live-grid");
    for (const table of watchedTables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => void queryClient.invalidateQueries({ queryKey: ["live-grid-snapshot"] }),
      );
    }
    channel.subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}
