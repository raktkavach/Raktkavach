import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Crown, Globe, Terminal, Bell, RefreshCw,
  Building2, FlaskConical, Stethoscope, Flag,
  ChevronDown, ChevronUp, Activity, Network, Lock, Menu,
  Shield, AlertOctagon, CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { eventBus, type RaktEvent } from "@/lib/eventBus";

const GOLD = "#F4C430";
const GOLD_DIM = "rgba(244,196,48,0.7)";
const GOLD_BORDER = "rgba(244,196,48,0.25)";
const GOLD_BG = "rgba(244,196,48,0.06)";
const DARK_CARD = "rgba(18,12,2,0.85)";

const founderCard = {
  background: DARK_CARD,
  border: `1px solid ${GOLD_BORDER}`,
  boxShadow: `0 0 20px rgba(244,196,48,0.04), 0 4px 24px rgba(0,0,0,0.7)`,
  borderRadius: "12px",
};

const AUDIT_NODES = [
  { id: "HOSP-A291", name: "Sunrise Hospital", type: "Hospital", district: "Lucknow, UP", submitted: "2h ago", risk: "low", status: "verified" },
  { id: "LAB-B892", name: "BioLab Diagnostics", type: "Lab", district: "Patna, Bihar", submitted: "5h ago", risk: "medium", status: "pending" },
  { id: "CLIN-C293", name: "CityMed Clinic", type: "Clinic", district: "Jaipur, Raj", submitted: "8h ago", risk: "low", status: "pending" },
  { id: "HOSP-D894", name: "Apex Blood Center", type: "Hospital", district: "Surat, GJ", submitted: "12h ago", risk: "high", status: "flagged" },
  { id: "LAB-E295", name: "PrimeCare Labs", type: "Lab", district: "Bhopal, MP", submitted: "1d ago", risk: "low", status: "verified" },
];

const WHO_DIRECTIVES = [
  { id: "WHO-DX-001", title: "Universal Donor Eligibility Protocol", scope: "Global", active: true },
  { id: "WHO-DX-002", title: "Blood Safety Emergency Framework (BSEF)", scope: "South Asia", active: true },
  { id: "WHO-DX-003", title: "Cross-border Blood Shipment Clearance", scope: "SAARC", active: false },
  { id: "WHO-DX-004", title: "Pathogen Reduction Technology Mandate", scope: "Global", active: false },
];

const SEED_LOGS = [
  "[SYS] ✔ Blockchain node handshake: AIIMS-DELHI ↔ RKTK-GRID-001 — 4ms",
  "[AUTH] Aadhaar profile sync triggered: UID-XXXX-XXXX-7823 → DON-84920",
  "[GRID] Emergency request routed: KOL-HOSP-04 → nearest O- depot (ETA 12min)",
  "[INTEGRITY] Hash verified: Block #1,84,291 — SHA256: a3f9...c812 ✔",
  "[AUTH] Biometric challenge accepted: HOSP-A291 — fingerprint 99.7% match",
  "[SYS] State sync: Uttar Pradesh → 2,154 hospitals ONLINE",
  "[WHO] Directive WHO-DX-002 broadcast received — acknowledged by 12,847 nodes",
  "[GRID] Blood unit UUID: RKT-O+-20250601-0082 issued to Apollo Delhi",
  "[INTEGRITY] DPDP audit log flushed — 0 violations",
  "[SYS] ✔ Node heartbeat: LAB-B892 — latency 8ms",
];

function eventToLogLine(e: RaktEvent): string {
  const time = new Date(e.timestamp).toLocaleTimeString();
  switch (e.type) {
    case "EMERGENCY_REQUEST": return `[EMERGENCY] ⚠ Request from ${e.nodeId} — ${e.payload["bloodType"] ?? "Unknown"} CRITICAL — ${time}`;
    case "NATIONAL_VALIDATE": return `[NATL] ✔ National Authority validated request from ${e.nodeId} — ${time}`;
    case "WHO_APPROVE": return `[WHO] ✔ WHO final approval granted for ${e.nodeId} — ${time}`;
    case "EMERGENCY_BROADCAST": return `[BROADCAST] 🔴 Emergency broadcast dispatched to 12,847 nodes — ${time}`;
    case "BLOOD_TRANSFERRED": return `[GRID] Blood transfer: ${e.nodeId} — ${e.payload["units"] ?? "?"} units — ${time}`;
    case "BIOMETRIC_VERIFIED": return `[AUTH] Biometric verified: ${e.nodeId} — ${time}`;
    default: return `[${e.type}] ${e.nodeId} — ${time}`;
  }
}

function TerminalLine({ line }: { line: string }) {
  const color = line.startsWith("[SYS]") ? "#00D2FF"
    : line.startsWith("[AUTH]") ? GOLD
    : line.startsWith("[INTEGRITY]") ? "#22c55e"
    : line.startsWith("[WHO]") ? "#c084fc"
    : line.startsWith("[EMERGENCY]") ? "#FF1E27"
    : line.startsWith("[BROADCAST]") ? "#FF1E27"
    : line.startsWith("[NATL]") ? "#22c55e"
    : line.startsWith("[GRID]") ? "#00D2FF"
    : "rgba(255,255,255,0.55)";

  return (
    <div className="text-[10px] font-mono leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis" style={{ color }}>
      {line}
    </div>
  );
}

export default function FounderDashboard() {
  const [logLines, setLogLines] = useState<string[]>(SEED_LOGS.slice(0, 7));
  const [logPaused, setLogPaused] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("nodes");
  const [liveEventCount, setLiveEventCount] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);
  const seedIdx = useRef(7);

  useEffect(() => {
    const unsub = eventBus.subscribe("*", (evt) => {
      const line = eventToLogLine(evt);
      setLogLines(prev => [...prev.slice(-24), line]);
      setLiveEventCount(c => c + 1);
      setTimeout(() => termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: "smooth" }), 50);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (logPaused) return;
    const interval = setInterval(() => {
      const next = SEED_LOGS[seedIdx.current % SEED_LOGS.length];
      seedIdx.current++;
      setLogLines(prev => [...prev.slice(-24), next]);
      setTimeout(() => termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: "smooth" }), 50);
    }, 2200);
    return () => clearInterval(interval);
  }, [logPaused]);

  const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div style={founderCard}>
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: GOLD }}>{icon}</span>
          <span className="text-sm font-black text-white tracking-wide uppercase">{title}</span>
        </div>
        <span style={{ color: GOLD_DIM }}>
          {expandedSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg,#020613 0%,#0a0800 60%,#071126 100%)", backgroundAttachment: "fixed" }}>

      {/* Header */}
      <div className="sticky top-0 z-30 w-full" style={{ background: "rgba(10,8,0,0.97)", borderBottom: `1px solid ${GOLD_BORDER}`, backdropFilter: "blur(16px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button className="cursor-pointer" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: GOLD, filter: `drop-shadow(0 0 6px ${GOLD})` }} />
              <span className="font-black text-sm tracking-widest" style={{ color: GOLD }}>INTEGRITY MONITOR</span>
              <Eye className="w-4 h-4" style={{ color: GOLD, filter: `drop-shadow(0 0 6px ${GOLD})` }} />
            </div>
            <span className="text-[9px] tracking-widest font-bold" style={{ color: "rgba(244,196,48,0.5)" }}>RAKT KAVACH — READ-ONLY AUDIT VIEW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} />
              {liveEventCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center" style={{ background: GOLD, color: "#000" }}>
                  {Math.min(liveEventCount, 9)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto pb-10 px-4 pt-4 flex flex-col gap-4 max-w-3xl mx-auto w-full"
      >
        {/* Read-Only Banner */}
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg,rgba(244,196,48,0.08) 0%,rgba(10,8,0,0.95) 100%)`, border: `1px solid ${GOLD_BORDER}`, boxShadow: `0 0 30px rgba(244,196,48,0.06)` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: GOLD_BG, border: `2px solid ${GOLD_BORDER}` }}>
            <Crown className="w-6 h-6" style={{ color: GOLD }} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-black text-white tracking-wider">INTEGRITY MONITOR — FNDX-0001</div>
            <div className="text-[10px] mt-0.5" style={{ color: GOLD_DIM }}>Passive observational access · All nodes visible · Zero control authority</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] font-bold" style={{ color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SECURE SESSION
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold" style={{ color: GOLD_DIM }}>
              <Lock className="w-3 h-3" />
              READ-ONLY
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Grid Nodes", val: "12,847", icon: <Network className="w-4 h-4" />, color: "#00D2FF" },
            { label: "Nodes Flagged", val: "1", icon: <AlertOctagon className="w-4 h-4" />, color: "#FF1E27" },
            { label: "Nodes Verified", val: "2", icon: <CheckCircle2 className="w-4 h-4" />, color: "#22c55e" },
            { label: "WHO Active", val: "2", icon: <Globe className="w-4 h-4" />, color: "#c084fc" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 flex flex-col gap-2" style={founderCard}>
              <div className="flex items-center justify-between text-[9px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* SECTION 1: Node Registry Audit (read-only) */}
        <Section id="nodes" title="Node Registry Audit" icon={<Shield className="w-4 h-4" />}>
          <div className="text-[9px] font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: GOLD_DIM }}>
            <Lock className="w-3 h-3" />
            READ-ONLY — Approval authority delegated to National Authority nodes
          </div>
          <div className="flex flex-col gap-2">
            {AUDIT_NODES.map(node => {
              const TypeIcon = node.type === "Hospital" ? Building2 : node.type === "Lab" ? FlaskConical : Stethoscope;
              const statusColor = node.status === "verified" ? "#22c55e" : node.status === "flagged" ? "#FF1E27" : GOLD;
              const statusLabel = node.status === "verified" ? "✔ VERIFIED" : node.status === "flagged" ? "⚠ FLAGGED" : "● PENDING";
              return (
                <div key={node.id} className="rounded-lg p-3 flex items-center gap-3"
                  style={{ background: "rgba(244,196,48,0.02)", border: `1px solid ${GOLD_BORDER}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}>
                    <TypeIcon className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-white">{node.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: GOLD_BG, color: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}>{node.type}</span>
                      {node.risk === "high" && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(255,30,39,0.1)", color: "#FF1E27" }}>⚠ HIGH RISK</span>}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{node.id} · {node.district} · {node.submitted}</div>
                  </div>
                  <div className="text-[9px] font-black shrink-0" style={{ color: statusColor }}>{statusLabel}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* SECTION 2: Live Event Stream Terminal */}
        <Section id="terminal" title="Live Event Stream" icon={<Terminal className="w-4 h-4" />}>
          <div className="rounded-lg overflow-hidden" style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(244,196,48,0.15)" }}>
            <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(244,196,48,0.1)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: "#FF1E27" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                <span className="text-[10px] font-mono ml-2" style={{ color: GOLD_DIM }}>rktk-integrity-monitor — LIVE</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold" style={{ color: "#22c55e" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  STREAMING
                </div>
                <button onClick={() => setLogPaused(p => !p)}
                  className="flex items-center gap-1 text-[9px] font-bold cursor-pointer transition-opacity hover:opacity-70"
                  style={{ color: GOLD_DIM }}>
                  {logPaused ? <><RefreshCw className="w-3 h-3" /> RESUME</> : <><Eye className="w-3 h-3" /> PAUSE</>}
                </button>
              </div>
            </div>
            <div ref={termRef} className="h-52 overflow-y-auto px-3 py-2 flex flex-col gap-0.5" style={{ scrollbarWidth: "none" }}>
              <div className="text-[10px] font-mono mb-1" style={{ color: GOLD_DIM }}>
                INTEGRITY MONITOR v1.0.0 — Session: FNDX-0001 — {new Date().toLocaleTimeString()}
              </div>
              {logLines.map((line, i) => <TerminalLine key={i} line={line} />)}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-mono" style={{ color: GOLD }}>monitor@rktk:~$</span>
                <span className="w-2 h-3 bg-white/60 animate-pulse inline-block" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Blocks Verified", val: "1,84,292", color: "#22c55e" },
              { label: "Live Events", val: String(liveEventCount), color: GOLD },
              { label: "Anomalies", val: "0", color: "#22c55e" },
            ].map(s => (
              <div key={s.label} className="text-center py-2 rounded-lg" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${GOLD_BORDER}` }}>
                <div className="text-base font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[8px] font-bold tracking-wider mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 3: WHO Directive Status (read-only) */}
        <Section id="who" title="WHO Directive Status" icon={<Globe className="w-4 h-4" />}>
          <div className="text-[9px] font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: GOLD_DIM }}>
            <Lock className="w-3 h-3" />
            READ-ONLY — WHO control delegated to National Authority
          </div>
          <div className="flex flex-col gap-2">
            {WHO_DIRECTIVES.map(d => (
              <div key={d.id} className="rounded-lg p-3 flex items-center gap-3"
                style={{ background: "rgba(192,132,252,0.04)", border: `1px solid ${d.active ? "rgba(192,132,252,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 shrink-0" style={{ color: "#c084fc" }} />
                    <span className="text-xs font-black text-white">{d.title}</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{d.id} · Scope: {d.scope}</div>
                </div>
                <div className="text-[9px] font-black shrink-0" style={{ color: d.active ? "#c084fc" : "rgba(255,255,255,0.25)" }}>
                  {d.active ? "● ACTIVE" : "○ INACTIVE"}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 4: Authority Hierarchy */}
        <Section id="hierarchy" title="Authority Hierarchy" icon={<Activity className="w-4 h-4" />}>
          <div className="flex flex-col items-center gap-0">
            {[
              { level: "FOUNDER / INTEGRITY MONITOR", color: GOLD, note: "FNDX-0001 · Read-Only Observer" },
              { level: "NATIONAL AUTHORITY", color: "#c084fc", note: "Ministry of Health — Full Control" },
              { level: "WHO NODE SUPERVISORS", color: "#00D2FF", note: "4 Active Directives" },
              { level: "STATE COMMAND CENTERS", color: "#00D2FF", note: "28 States + 8 UTs" },
              { level: "DISTRICT NODES", color: "rgba(0,210,255,0.7)", note: "742 Districts" },
              { level: "HOSPITALS / LABS / CLINICS", color: "rgba(255,255,255,0.7)", note: "12,847 Active Nodes" },
              { level: "VILLAGE / PHC NODES", color: "rgba(255,255,255,0.35)", note: "Coming in MYBVP 2.0" },
            ].map((row, i) => (
              <div key={row.level} className="flex flex-col items-center w-full">
                <div className="rounded-lg px-4 py-2 w-full text-center"
                  style={{ background: i === 0 ? GOLD_BG : "rgba(5,15,35,0.6)", border: `1px solid ${i === 0 ? GOLD_BORDER : "rgba(255,255,255,0.06)"}`, boxShadow: i === 0 ? `0 0 12px rgba(244,196,48,0.08)` : "none" }}>
                  <div className="text-[11px] font-black tracking-wide" style={{ color: row.color }}>{row.level}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{row.note}</div>
                </div>
                {i < 6 && <div className="w-0.5 h-3" style={{ background: `linear-gradient(${i === 0 ? GOLD : "#00D2FF"},rgba(255,255,255,0.1))` }} />}
              </div>
            ))}
          </div>
        </Section>

        {/* Back */}
        <div className="flex justify-center pt-2 pb-4">
          <Link href="/" className="text-[10px] tracking-wider cursor-pointer transition-colors hover:text-white flex items-center gap-1.5" style={{ color: "rgba(244,196,48,0.4)" }}>
            <Lock className="w-3 h-3" />
            EXIT INTEGRITY SESSION → Gateway
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
