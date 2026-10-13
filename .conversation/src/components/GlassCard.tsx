import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn("cyber-card rounded-xl p-5", className)}
      {...props}
    />
  );
}