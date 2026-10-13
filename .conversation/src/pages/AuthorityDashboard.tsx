import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Droplet, Bell, TriangleAlert, BellRing, Users, Network, Menu, Zap, CheckCircle2, Clock, Lock } from "lucide-react";
import { Link } from "wouter";
import { eventBus } from "@/lib/eventBus";
import { nodeIds } from "@/lib/nodeIds";

type EmergencyStep = 0 | 1 | 2 | 3;
const AUTH_NODE = nodeIds.authority();

export default function AuthorityDashboard() {
  const { t } = useLanguage();
  const [emergencyStep, setEmergencyStep] = useState<EmergencyStep>(0);
  const [broadcastDone, setBroadcastDone] = useState(false);

  const advanceEmergency = (step: EmergencyStep) => {
    setEmergencyStep(step);
    if (step === 1) {
      eventBus.publish({ type: "EMERGENCY_REQUEST", nodeId: AUTH_NODE, payload: { source: "State", bloodType: "O-", urgency: "CRITICAL" } });
    } else if (step === 2) {
      eventBus.publish({ type: "NATIONAL_VALIDATE", nodeId: AUTH_NODE, payload: { validated: true } });
    } else if (step === 3) {
      eventBus.publish({ type: "WHO_APPROVE", nodeId: "WHO-IN-007", payload: { approved: true } });
      setTimeout(() => {
        eventBus.publish({ type: "EMERGENCY_BROADCAST", nodeId: AUTH_NODE, payload: { nodes: 12847, bloodType: "O-" } });
        setBroadcastDone(true);
      }, 1200);
    }
  };

  const bloodTypes = [
    { type: "O+", pct: 26 }, { type: "A+", pct: 24 }, { type: "B+", pct: 17 },
    { type: "AB+", pct: 8 }, { type: "O-", pct: 7 }, { type: "A-", pct: 6 },
    { type: "B-", pct: 6 }, { type: "AB-", pct: 6 },
  ];

  const alerts = [
    { city: "KOLKATA", msg: "O- Blood Required", time: "2 mins ago", level: "critical" },
    { city: "BENGALURU", msg: "A+ Platelets Required", time: "5 mins ago", level: "warning" },
    { city: "LUCKNOW", msg: "B+ Blood Required", time: "6 mins ago", level: "critical" },
    { city: "AHMEDABAD", msg: "O+ Blood Required", time: "7 mins ago", level: "warning" },
  ];

  const topRequests = [
    { state: "DELHI NCR", units: "3,245" },
    { state: "UTTAR PRADESH", units: "2,784" },
    { state: "MAHARASHTRA", units: "2,456" },
    { state: "KARNATAKA", units: "1,987" },
    { state: "TAMIL NADU", units: "1,665" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg, #020613 0%, #071126 100%)", backgroundAttachment: "fixed" }}>

      {/* Header */}
      <div className="sticky top-0 z-30 w-full px-4 py-3 flex items-center justify-between" style={{ background: "rgba(2,6,19,0.95)", borderBottom: "1px solid rgba(0,210,255,0.1)", backdropFilter: "blur(12px)" }}>
        <button className="cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs tracking-widest" style={{ color: "#FF1E27" }}>रक्त कवच</span>
            <span className="text-white font-black text-xs tracking-widest">/ RAKT KAVACH</span>
          </div>
          <span className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>ONE NATION • ONE BLOOD GRID</span>
        </div>
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center" style={{ background: "#FF1E27" }}>3</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 overflow-y-auto pb-8 px-4 pt-4 flex flex-col gap-4 max-w-2xl mx-auto w-full"
      >
        {/* Compliance Status Row */}
        <div className="rounded-xl px-3 py-2.5 flex flex-wrap items-center gap-2"
          style={{ background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.12)" }}>
          {[
            { label: "National e-RaktKosh API", status: "LIVE SYNC", color: "#22c55e" },
            { label: "ABHA/ABDM", status: "CONNECTED", color: "#22c55e" },
            { label: "LOINC/SNOMED", status: "ACTIVE", color: "#00D2FF" },
            { label: "DPDP Act 2023", status: "COMPLIANT", color: "#00D2FF" },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-1 text-[8px] font-bold">
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{b.label}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}25` }}>● {b.status}</span>
            </div>
          ))}
        </div>

        {/* Page Title */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-black tracking-tight">
            <span style={{ color: "#FF1E27" }}>RAKT</span> <span className="text-white">KAVACH</span>
          </h1>
          <p className="text-xs font-bold tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>NATIONAL BLOOD GRID COMMAND CENTER</p>
        </div>

        {/* Top 3 Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Live Blood Inventory */}
          <div className="cyber-card p-4 sm:col-span-1">
            <div className="text-[9px] font-bold tracking-widest mb-2" style={{ color: "#00D2FF" }}>LIVE BLOOD INVENTORY</div>
            <div className="flex items-start gap-3">
              <div>
                <div className="text-2xl font-black" style={{ color: "#FF1E27" }}>1,72,265</div>
                <div className="text-[10px] font-bold mt-0.5" style={{ color: "#22c55e" }}>↑ 5.4% vs yesterday</div>
                <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>TOTAL UNITS</div>
              </div>
              {/* Mini donut */}
              <div className="relative w-12 h-12 shrink-0 ml-auto">
                <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#FF1E27" strokeWidth="4" strokeDasharray="57.6 32" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#00D2FF" strokeWidth="4" strokeDasharray="43.2 46.4" strokeDashoffset="-57.6" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
              {bloodTypes.map(b => (
                <div key={b.type} className="flex items-center justify-between text-[9px]">
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{b.type}</span>
                  <span className="font-bold text-white">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Nodes */}
          <div className="cyber-card p-4">
            <div className="text-[9px] font-bold tracking-widest mb-2" style={{ color: "#00D2FF" }}>CONNECTED NODES</div>
            <div className="text-3xl font-black text-white mb-3">8,742</div>
            <div className="flex flex-col gap-2">
              {[
                { icon: <Shield className="w-3 h-3" />, label: "Hospitals", val: "2,154" },
                { icon: <Network className="w-3 h-3" />, label: "Labs", val: "3,275" },
                { icon: <Users className="w-3 h-3" />, label: "Clinics", val: "3,313" },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: "#00D2FF" }}>{n.icon}</span>
                    {n.label}
                  </div>
                  <span className="font-bold text-white">{n.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Response */}
          <div className="cyber-card p-4">
            <div className="text-[9px] font-bold tracking-widest mb-2" style={{ color: "#00D2FF" }}>EMERGENCY RESPONSE</div>
            <div className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>National Average Time</div>
            <div className="text-4xl font-black mb-1" style={{ color: "#FF1E27", textShadow: "0 0 20px rgba(255,30,39,0.5)" }}>04:32</div>
            <div className="text-[10px] font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>MINUTES</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              TARGET &lt; 05:00 MIN
            </div>
          </div>
        </div>

        {/* India Map Placeholder */}
        <div className="cyber-card p-4">
          <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "#00D2FF" }}>NATIONAL GRID — LIVE NODE ACTIVITY</div>
          <div className="relative h-48 rounded-lg overflow-hidden" style={{ background: "rgba(0,10,30,0.8)" }}>
            {/* Simplified India SVG map outline */}
            <svg viewBox="0 0 400 480" className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
              <path d="M160,20 L200,15 L250,25 L290,40 L310,70 L320,100 L330,130 L325,160 L340,190 L350,220 L340,250 L320,280 L300,310 L280,340 L260,370 L240,400 L220,430 L200,460 L185,440 L170,410 L150,380 L130,350 L110,310 L95,270 L85,230 L80,190 L85,150 L95,120 L110,90 L130,60 L160,20Z"
                fill="none" stroke="#00D2FF" strokeWidth="1.5" />
              <path d="M160,20 L140,40 L120,50 L100,60 L85,80 L80,110 L75,140 L80,170 L85,150 L95,120 L110,90 L130,60 L160,20Z"
                fill="none" stroke="#00D2FF" strokeWidth="1" />
              <path d="M310,70 L330,60 L350,75 L355,100 L340,110 L320,100 L310,70Z"
                fill="none" stroke="#00D2FF" strokeWidth="1" />
            </svg>

            {/* Glowing node dots */}
            {[
              { x: "50%", y: "15%", label: "DEL" }, { x: "42%", y: "28%", label: "LKO" },
              { x: "65%", y: "35%", label: "KOL" }, { x: "38%", y: "48%", label: "MUM" },
              { x: "55%", y: "52%", label: "HYD" }, { x: "44%", y: "65%", label: "BLR" },
              { x: "52%", y: "75%", label: "CHN" }, { x: "26%", y: "38%", label: "AHM" },
            ].map((dot, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: dot.x, top: dot.y, transform: "translate(-50%,-50%)" }}>
                <div className="relative">
                  <div className="w-2 h-2 rounded-full animate-ping absolute" style={{ background: i % 3 === 0 ? "rgba(255,30,39,0.6)" : "rgba(0,210,255,0.6)", top: 0, left: 0 }} />
                  <div className="w-2 h-2 rounded-full relative z-10" style={{ background: i % 3 === 0 ? "#FF1E27" : "#00D2FF" }} />
                </div>
                <span className="text-[7px] font-bold mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{dot.label}</span>
              </div>
            ))}

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.2 }}>
              <line x1="50%" y1="15%" x2="42%" y2="28%" stroke="#00D2FF" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="42%" y1="28%" x2="65%" y2="35%" stroke="#00D2FF" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="38%" y1="48%" x2="44%" y2="65%" stroke="#00D2FF" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="44%" y1="65%" x2="52%" y2="75%" stroke="#00D2FF" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
          </div>

          {/* Node summary bar */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "HOSPITALS", val: "2,154" },
              { label: "LABS", val: "3,275" },
              { label: "CLINICS", val: "3,313" },
            ].map(n => (
              <div key={n.label} className="text-center py-1.5 rounded-lg" style={{ background: "rgba(0,210,255,0.05)", border: "1px solid rgba(0,210,255,0.1)" }}>
                <div className="text-sm font-black text-white">{n.val}</div>
                <div className="text-[8px] font-bold tracking-wider mt-0.5" style={{ color: "#22c55e" }}>{n.label}</div>
                <div className="text-[7px] mt-0.5" style={{ color: "#22c55e" }}>● Online</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Live Alerts */}
          <div className="cyber-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[9px] font-bold tracking-widest" style={{ color: "#00D2FF" }}>LIVE ALERTS</div>
              <button className="text-[9px] font-bold cursor-pointer" style={{ color: "#00D2FF" }}>VIEW ALL →</button>
            </div>
            <div className="flex flex-col gap-2.5">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${a.level === 'critical' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                    <BellRing className="w-2.5 h-2.5" style={{ color: a.level === 'critical' ? '#FF1E27' : '#f59e0b' }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-black" style={{ color: a.level === 'critical' ? '#FF1E27' : '#f59e0b' }}>{a.city}</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{a.msg}</div>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Blood Requests */}
          <div className="cyber-card p-4">
            <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "#00D2FF" }}>TOP BLOOD REQUESTS (LIVE)</div>
            <div className="flex flex-col gap-2">
              {topRequests.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ background: "#FF1E27" }} />
                    <span className="text-[11px] font-bold text-white">{r.state}</span>
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{r.units} Units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blood Demand Forecast */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[9px] font-bold tracking-widest" style={{ color: "#00D2FF" }}>BLOOD DEMAND FORECAST (NEXT 7 DAYS)</div>
          </div>
          <div className="flex items-end gap-0.5 h-20 w-full">
            {[180, 210, 190, 240, 220, 200, 230].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                <div className="w-full rounded-t-sm" style={{ height: `${(val / 250) * 80}%`, background: i % 2 === 0 ? "rgba(255,30,39,0.5)" : "rgba(0,210,255,0.5)" }} />
                <div className="text-[7px] text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {["16", "17", "18", "19", "20", "21", "22"][i]}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-[9px]">
              <div className="w-3 h-0.5 rounded" style={{ background: "#FF1E27" }} />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Predicted Demand</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px]">
              <div className="w-3 h-0.5 rounded" style={{ background: "#00D2FF" }} />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Available Supply</span>
            </div>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="cyber-card p-4">
          <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "#00D2FF" }}>INVENTORY HEALTH STATUS</div>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="70.4 17.6" strokeLinecap="round" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="5" strokeDasharray="14.8 73.2" strokeDashoffset="-70.4" strokeLinecap="round" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#FF1E27" strokeWidth="5" strokeDasharray="5.5 82.5" strokeDashoffset="-85.2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-black text-white">78%</div>
                <div className="text-[8px] font-bold" style={{ color: "#22c55e" }}>OPTIMAL</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Optimal", pct: "78%", color: "#22c55e" },
                { label: "Moderate", pct: "16%", color: "#eab308" },
                { label: "Low", pct: "6%", color: "#FF1E27" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                  <span className="text-[11px] font-black ml-auto pl-4" style={{ color: s.color }}>{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Signature Emergency Protocol */}
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,30,39,0.05)", border: "1px solid rgba(255,30,39,0.25)", boxShadow: "0 0 24px rgba(255,30,39,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold tracking-widest" style={{ color: "#FF1E27" }}>MULTI-SIG EMERGENCY PROTOCOL</div>
            <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{AUTH_NODE}</div>
          </div>
          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            3-signature chain required before any broadcast. State → National → WHO.
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            {[
              { step: 1 as EmergencyStep, label: "STATE REQUEST", sublabel: "Raise emergency from state node", node: AUTH_NODE },
              { step: 2 as EmergencyStep, label: "NATIONAL VALIDATION", sublabel: "National Authority verifies & forwards", node: "NATL-AUTH-001" },
              { step: 3 as EmergencyStep, label: "WHO FINAL APPROVAL", sublabel: "WHO Supervisor grants broadcast rights", node: "WHO-IN-007" },
            ].map(({ step, label, sublabel, node }) => {
              const done = emergencyStep >= step;
              const active = emergencyStep === step - 1;
              return (
                <div key={step} className="rounded-lg p-3 flex items-center gap-3"
                  style={{ background: done ? "rgba(34,197,94,0.06)" : active ? "rgba(255,30,39,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(34,197,94,0.25)" : active ? "rgba(255,30,39,0.25)" : "rgba(255,255,255,0.06)"}` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                    style={{ background: done ? "rgba(34,197,94,0.12)" : active ? "rgba(255,30,39,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${done ? "rgba(34,197,94,0.35)" : active ? "rgba(255,30,39,0.3)" : "rgba(255,255,255,0.08)"}`, color: done ? "#22c55e" : active ? "#FF1E27" : "rgba(255,255,255,0.25)" }}>
                    {done ? "✔" : step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black" style={{ color: done ? "#22c55e" : active ? "#FF1E27" : "rgba(255,255,255,0.3)" }}>{label}</div>
                    <div className="text-[9px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{node}</div>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{sublabel}</div>
                  </div>
                  {active && !broadcastDone && (
                    <button onClick={() => advanceEmergency(step)}
                      className="text-[10px] font-black px-3 py-2 rounded cursor-pointer transition-opacity hover:opacity-90 shrink-0 flex items-center gap-1"
                      style={{ background: "rgba(255,30,39,0.15)", border: "1px solid rgba(255,30,39,0.4)", color: "#FF1E27" }}>
                      <Zap className="w-3 h-3" /> SIGN
                    </button>
                  )}
                  {done && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#22c55e" }} />}
                  {!done && !active && <Clock className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.15)" }} />}
                </div>
              );
            })}
          </div>

          {/* Broadcast Result */}
          <AnimatePresence>
            {broadcastDone && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="rounded-lg p-3 text-center" style={{ background: "rgba(255,30,39,0.1)", border: "1px solid rgba(255,30,39,0.35)" }}>
                <div className="text-sm font-black" style={{ color: "#FF1E27" }}>🔴 EMERGENCY BROADCAST DISPATCHED</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Broadcast sent to 12,847 nodes · All 3 signatures verified</div>
              </motion.div>
            )}
          </AnimatePresence>

          {emergencyStep === 0 && (
            <div className="flex items-center gap-2 text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Lock className="w-3 h-3" />
              Broadcast locked until all 3 signatures collected
            </div>
          )}
        </div>

        {/* Today's Summary */}
        <div className="cyber-card p-4">
          <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "#00D2FF" }}>TODAY'S SUMMARY</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Units Collected", val: "32,456" },
              { label: "Units Issued", val: "28,765" },
              { label: "New Donors", val: "5,432" },
              { label: "Blood Donations", val: "7,856" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-black text-white">{s.val}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timestamp + back */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>16 May 2025 | 11:45:32 AM</div>
          <Link href="/all-modules"
            className="text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
            style={{ background: "rgba(0,210,255,0.08)", border: "1px solid rgba(0,210,255,0.2)", color: "#00D2FF" }}>
            🔬 ALL 100 MODULES
          </Link>
          <Link href="/" className="text-[10px] cursor-pointer transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>
            ← {t("back")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
