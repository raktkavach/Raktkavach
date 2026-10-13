import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, FileText, Clock, Percent, ShieldCheck, Bell, Shield } from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { nodeIds } from "@/lib/nodeIds";

const NODE_ID = nodeIds.lab();

export default function LabDashboard() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg,#020613 0%,#071126 100%)", backgroundAttachment: "fixed" }}>

      {/* Header */}
      <div className="sticky top-0 z-30 w-full px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(2,6,19,0.95)", borderBottom: "1px solid rgba(0,210,255,0.1)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: "#FF1E27" }} />
            <span className="text-white font-bold text-xs tracking-widest ml-1">LAB PORTAL</span>
          </div>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: "#00D2FF" }}>{NODE_ID}</span>
        </div>
        <Bell className="w-5 h-5 cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto pb-10 px-4 pt-4 flex flex-col gap-4 max-w-2xl mx-auto w-full"
      >
        {/* Node Identity */}
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(245,158,11,0.08)", border: "2px solid rgba(245,158,11,0.25)" }}>
            <FlaskConical className="w-5 h-5" style={{ color: "#f59e0b" }} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-black text-white tracking-wider">SRL DIAGNOSTICS</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>LAB Node · Noida, UP · Grid-Certified</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] font-bold" style={{ color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              ONLINE
            </div>
            <div className="text-[9px] font-mono" style={{ color: "rgba(245,158,11,0.7)" }}>{NODE_ID}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label={t("testsPerformed")} value="28" icon={<FlaskConical className="w-4 h-4" />} />
          <StatCard label={t("certificatesIssued")} value="24" icon={<FileText className="w-4 h-4" />} valueClassName="text-blue-400" />
          <StatCard label={t("pendingVerification")} value="4" icon={<Clock className="w-4 h-4" />} valueClassName="text-amber-400" />
          <StatCard label={t("accuracyRate")} value="99.2%" icon={<Percent className="w-4 h-4" />} valueClassName="text-emerald-400" />
        </div>

        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-4">{t("recentVerifications")}</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: "VER-8921", status: "Verified", type: "AB+", time: "10 mins ago" },
              { id: "VER-8920", status: "Verified", type: "O-", time: "1 hour ago" },
              { id: "VER-8919", status: "Pending", type: "B+", time: "2 hours ago" },
            ].map((ver, i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${ver.status === "Verified" ? "text-emerald-400" : "text-amber-400"}`} />
                  <div>
                    <div className="text-sm font-medium text-white">{ver.id}</div>
                    <div className="text-xs text-slate-400">{ver.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${ver.status === "Verified" ? "text-emerald-400" : "text-amber-400"}`}>
                    {ver.status}
                  </span>
                  <div className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold">{ver.type}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="text-center pb-2">
          <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            Grid Node: {NODE_ID} · Certified Lab · NABL Accredited
          </div>
        </div>
      </motion.div>
    </div>
  );
}
