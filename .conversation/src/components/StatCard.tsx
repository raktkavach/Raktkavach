import React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  valueClassName?: string;
}

export function StatCard({ label, value, icon, className, valueClassName, ...props }: StatCardProps) {
  return (
    <GlassCard className={cn("cyber-card p-4 flex flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
        {label}
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className={cn("text-2xl font-bold text-white", valueClassName)}>
        {value}
      </div>
    </GlassCard>
  );
}