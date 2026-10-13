import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, ChevronRight, ChevronDown, CheckCircle2,
  Wifi, Shield, Globe, Database, Activity, Radio, Zap, Network,
  MapPin, Bell, Mic, Camera, Users, Layers, Cpu, Volume2,
  Heart, Droplet, FileText, Lock, AlertTriangle, BarChart3,
  Clock, RefreshCcw, Send, Phone, Star, Award, GitBranch,
  Server, TrendingUp, Filter, X, Menu
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────
type ModStatus = "live" | "standby" | "prototype" | "api-required";
interface ModuleDef {
  num: number;
  title: string;
  group: string;
  tech: string;
  status: ModStatus;
  icon: React.ReactNode;
  color: string;
  panel: () => React.ReactNode;
}

// ─── Small reusable components ────────────────────────────────────────────────
function Row({ label, val, color = "#00D2FF" }: { label: string; val: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
      <span className="text-[10px] font-bold" style={{ color }}>{val}</span>
    </div>
  );
}

function Tag({ children, color = "#00D2FF" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-[8px] font-bold px-2 py-0.5 rounded"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = "#00D2FF", fullWidth }: { children: React.ReactNode; onClick?: () => void; color?: string; fullWidth?: boolean }) {
  return (
    <button onClick={onClick}
      className={`text-[10px] font-black px-3 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-80 flex items-center justify-center gap-1.5${fullWidth ? " w-full" : ""}`}
      style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}>
      {children}
    </button>
  );
}

function Counter({ init = 0, label }: { init: number; label: string }) {
  const [val, setVal] = useState(init);
  useEffect(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * 3)), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-2xl font-black text-white">{val.toLocaleString()}</div>
      <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
    </div>
  );
}

function ToggleDemo({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {labels.map((l, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
            style={{ background: active === i ? "rgba(0,210,255,0.12)" : "rgba(255,255,255,0.04)", color: active === i ? "#00D2FF" : "rgba(255,255,255,0.4)", border: `1px solid ${active === i ? "rgba(0,210,255,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            {l}
          </button>
        ))}
      </div>
      <div className="rounded-lg p-3 text-[9px]" style={{ background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
        Showing: <span style={{ color: "#00D2FF" }}>{labels[active]}</span> — data stream active ✔
      </div>
    </div>
  );
}

function FormDemo({ fields }: { fields: string[] }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const submit = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="flex flex-col gap-2">
      {fields.map(f => (
        <input key={f} placeholder={f} value={vals[f] || ""} onChange={e => setVals(v => ({ ...v, [f]: e.target.value }))}
          className="w-full text-[9px] px-2 py-1.5 rounded-lg bg-transparent border text-white placeholder-gray-700 focus:outline-none"
          style={{ borderColor: "rgba(0,210,255,0.2)" }} />
      ))}
      <Btn onClick={submit} color={saved ? "#22c55e" : "#00D2FF"} fullWidth>
        {saved ? <><CheckCircle2 className="w-3 h-3" /> SAVED</> : "SUBMIT"}
      </Btn>
    </div>
  );
}

function AlertFeed({ items }: { items: { city: string; msg: string; level: string }[] }) {
  const [list, setList] = useState(items);
  const dismiss = (i: number) => setList(l => l.filter((_, idx) => idx !== i));
  return (
    <div className="flex flex-col gap-1.5">
      {list.map((a, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
          style={{ background: a.level === "critical" ? "rgba(255,30,39,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${a.level === "critical" ? "rgba(255,30,39,0.2)" : "rgba(245,158,11,0.2)"}` }}>
          <span className="text-[8px] font-black shrink-0" style={{ color: a.level === "critical" ? "#FF1E27" : "#f59e0b" }}>{a.level.toUpperCase()}</span>
          <span className="text-[9px] flex-1" style={{ color: "rgba(255,255,255,0.5)" }}>{a.city}: {a.msg}</span>
          <button onClick={() => dismiss(i)} className="cursor-pointer shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {list.length === 0 && <div className="text-center text-[9px] py-2" style={{ color: "#22c55e" }}>✔ All alerts cleared</div>}
    </div>
  );
}

function ProgressBars({ items }: { items: { label: string; val: number; color: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(it => (
        <div key={it.label}>
          <div className="flex justify-between text-[9px] mb-0.5">
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{it.label}</span>
            <span style={{ color: it.color }}>{it.val}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${it.val}%` }} transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-full" style={{ background: it.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Stepper({ steps }: { steps: string[] }) {
  const [step, setStep] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2"
          style={{ background: i < step ? "rgba(34,197,94,0.05)" : i === step ? "rgba(0,210,255,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${i < step ? "rgba(34,197,94,0.2)" : i === step ? "rgba(0,210,255,0.2)" : "rgba(255,255,255,0.05)"}` }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
            style={{ background: i < step ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: i < step ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
            {i < step ? "✔" : i + 1}
          </div>
          <span className="text-[10px] flex-1" style={{ color: i < step ? "#22c55e" : i === step ? "#00D2FF" : "rgba(255,255,255,0.3)" }}>{s}</span>
          {i === step && (
            <button onClick={() => setStep(s => Math.min(s + 1, steps.length))}
              className="text-[8px] font-black px-2 py-1 rounded cursor-pointer"
              style={{ background: "rgba(0,210,255,0.1)", border: "1px solid rgba(0,210,255,0.25)", color: "#00D2FF" }}>
              NEXT →
            </button>
          )}
        </div>
      ))}
      {step >= steps.length && (
        <div className="text-center text-[9px] font-black" style={{ color: "#22c55e" }}>✔ WORKFLOW COMPLETE</div>
      )}
      {step > 0 && step < steps.length && (
        <button onClick={() => setStep(0)} className="text-[8px] cursor-pointer mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>↺ Reset</button>
      )}
    </div>
  );
}

function LiveTicker({ items }: { items: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % items.length), 2500); return () => clearInterval(t); }, []);
  return (
    <div className="rounded-lg px-3 py-2 overflow-hidden" style={{ background: "rgba(255,30,39,0.04)", border: "1px solid rgba(255,30,39,0.15)" }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
          className="text-[9px] font-bold" style={{ color: "#FF6B6B" }}>
          🔴 {items[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SimChart({ vals, color }: { vals: number[]; color: string }) {
  const [data, setData] = useState(vals);
  const refresh = () => setData(vals.map(() => Math.floor(Math.random() * 80) + 20));
  return (
    <div>
      <div className="flex items-end gap-0.5 h-14 w-full">
        {data.map((v, i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }}
            className="flex-1 rounded-t-sm" style={{ background: color }} />
        ))}
      </div>
      <button onClick={refresh} className="mt-2 text-[8px] cursor-pointer flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
        <RefreshCcw className="w-2.5 h-2.5" /> Refresh data
      </button>
    </div>
  );
}

// ─── All 100 Module Definitions ───────────────────────────────────────────────
function buildModules(): ModuleDef[] {
  return [
    // GROUP 1: Core Donor Management (1–10)
    { num: 1, title: "Donor Registration System", group: "Donor Management", tech: "React Form · Zod Validation · Drizzle ORM", status: "live", icon: <Users className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <FormDemo fields={["Full Name (Display only)", "Blood Group", "City / District", "Consent Checkbox: I agree to DPDP §7"]} /> },
    { num: 2, title: "Blood Group Verification", group: "Donor Management", tech: "e-RaktKosh API · Cross-match DB · LOINC", status: "prototype", icon: <Droplet className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Row label="Detected Type" val="O+ (Verified)" color="#22c55e" /><Row label="LOINC Code" val="883-9" /><Row label="RH Factor" val="Positive" color="#22c55e" /><Row label="Last Test" val="15 Jun 2025" /></> },
    { num: 3, title: "Donation History Tracker", group: "Donor Management", tech: "PostgreSQL · Timeline API · Read-only Ledger", status: "live", icon: <Clock className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <ProgressBars items={[{ label: "2025", val: 33, color: "#FF1E27" }, { label: "2024", val: 66, color: "#f97316" }, { label: "2023", val: 100, color: "#22c55e" }]} /> },
    { num: 4, title: "Donor Health Screening", group: "Donor Management", tech: "WHO Health Checklist · Hemoglobin Threshold · NABH", status: "prototype", icon: <Heart className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <Stepper steps={["Hemoglobin > 12.5 g/dL", "BP: 80–100 mm Hg diastolic", "No fever / infection", "Weight > 45 kg", "Consent recorded"]} /> },
    { num: 5, title: "Digital Donor Card", group: "Donor Management", tech: "QR Code API · ABHA Linked · DPDP Encrypted", status: "live", icon: <Award className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Row label="Donor ID" val="RKTK-7X9P-2D4F" /><Row label="Blood Group" val="O+" color="#FF1E27" /><Row label="ABHA Linked" val="Yes ✔" color="#22c55e" /><Row label="QR Status" val="Valid · Encrypted" color="#22c55e" /></> },
    { num: 6, title: "Donor Eligibility Checker", group: "Donor Management", tech: "NABH Rule Engine · Age / Weight / Interval Check", status: "live", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <Stepper steps={["Age 18–65 confirmed", "Last donation > 56 days ago", "No recent illness", "No medication conflict", "Eligible ✔"]} /> },
    { num: 7, title: "Recurring Donation Scheduler", group: "Donor Management", tech: "Calendar API · FCM Reminders · 56-day Interval", status: "live", icon: <RefreshCcw className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Counter init={3} label="Scheduled appointments" /><Row label="Next Slot" val="14 Aug 2025" color="#22c55e" /><Row label="Preferred Camp" val="AIIMS Delhi" /><Row label="Reminder" val="SMS + Push" color="#22c55e" /></> },
    { num: 8, title: "Donor Location Mapper", group: "Donor Management", tech: "PostGIS · Geofencing · Nearest Centre Routing", status: "prototype", icon: <MapPin className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><LiveTicker items={["Nearest blood bank: AIIMS Delhi — 2.4 km", "Safdarjung Hospital — 3.8 km", "RML Hospital — 5.1 km", "Sir Ganga Ram — 4.3 km"]} /><Row label="Geofence Radius" val="10 km" /><Row label="Matching Donors" val="247 in range" color="#22c55e" /></> },
    { num: 9, title: "Raktveer Badge & Rewards", group: "Donor Management", tech: "Loyalty Engine · Tier Threshold · Non-monetary", status: "live", icon: <Star className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <ProgressBars items={[{ label: "Bronze → Silver (3 donations)", val: 33, color: "#CD7F32" }, { label: "Silver → Gold (10 donations)", val: 10, color: "#C0C0C0" }, { label: "Gold → Founder (25 donations)", val: 4, color: "#F4C430" }]} /> },
    { num: 10, title: "Emergency Donor Alert", group: "Donor Management", tech: "FCM Push · SMS Gateway · Geo-targeted", status: "live", icon: <Bell className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <AlertFeed items={[{ city: "Delhi", msg: "O- critical need — 3 units", level: "critical" }, { city: "Lucknow", msg: "AB+ required within 2hr", level: "critical" }, { city: "Jaipur", msg: "Platelet drive — volunteers needed", level: "warning" }]} /> },

    // GROUP 2: Hospital & Blood Bank (11–25)
    { num: 11, title: "Hospital Blood Bank Dashboard", group: "Hospital & Blood Bank", tech: "Real-time Inventory · NABH Graded · Multi-ward View", status: "live", icon: <Database className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <ProgressBars items={[{ label: "O+", val: 78, color: "#FF1E27" }, { label: "A+", val: 64, color: "#f97316" }, { label: "B+", val: 45, color: "#eab308" }, { label: "AB-", val: 12, color: "#ef4444" }]} /> },
    { num: 12, title: "Real-time Inventory Monitor", group: "Hospital & Blood Bank", tech: "WebSocket Stream · Threshold Alerts · Auto-reorder", status: "live", icon: <Activity className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Counter init={172265} label="Total units — National grid" /><Row label="Critical < 10 units" val="3 hospitals" color="#FF1E27" /><Row label="Expiring < 48h" val="244 units" color="#f59e0b" /></> },
    { num: 13, title: "Cross-Match Request System", group: "Hospital & Blood Bank", tech: "ABO Compatibility Matrix · Coombs Test · ISBT 128", status: "prototype", icon: <GitBranch className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <Stepper steps={["Enter patient blood group", "Run ABO compatibility check", "Coombs test flag check", "ISBT 128 unit scan", "Cross-match approved"]} /> },
    { num: 14, title: "Blood Expiry Alert Manager", group: "Hospital & Blood Bank", tech: "FIFO Queue · Expiry Countdown · Auto-transfer API", status: "live", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <AlertFeed items={[{ city: "LNJP Hospital", msg: "B- 4 units expiring in 18h", level: "critical" }, { city: "Safdarjung", msg: "O+ 12 units expire in 36h", level: "warning" }]} /> },
    { num: 15, title: "Lab Test Results Viewer", group: "Hospital & Blood Bank", tech: "LOINC Coded · HL7 FHIR · ABDM PHR Compatible", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="HIV Screen" val="Non-reactive ✔" color="#22c55e" /><Row label="HBsAg" val="Non-reactive ✔" color="#22c55e" /><Row label="HCV" val="Non-reactive ✔" color="#22c55e" /><Row label="VDRL" val="Non-reactive ✔" color="#22c55e" /><Row label="Malaria" val="Negative ✔" color="#22c55e" /></> },
    { num: 16, title: "NABH Compliance Checker", group: "Hospital & Blood Bank", tech: "NABH Standards 5th Edition · Auto-audit · Score Card", status: "prototype", icon: <Shield className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <ProgressBars items={[{ label: "Blood Bank SOP", val: 92, color: "#22c55e" }, { label: "Documentation", val: 88, color: "#22c55e" }, { label: "Equipment Calibration", val: 74, color: "#eab308" }, { label: "Staff Training", val: 96, color: "#22c55e" }]} /> },
    { num: 17, title: "Hospital Network Map", group: "Hospital & Blood Bank", tech: "GraphQL · PostGIS Distance · 10km Radius Cluster", status: "prototype", icon: <Network className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="AIIMS Delhi" val="2.4 km · 847 units" /><Row label="Safdarjung" val="3.8 km · 612 units" /><Row label="LNJP Hospital" val="5.1 km · 324 units" /><Row label="RML Hospital" val="4.3 km · 498 units" /></> },
    { num: 18, title: "Inter-Hospital Transfer", group: "Hospital & Blood Bank", tech: "Route Optimization · Cold Chain Log · e-Challan", status: "live", icon: <Send className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <Stepper steps={["Select source bank", "Enter blood type & units", "Choose recipient hospital", "Verify cold chain (2–6°C)", "Dispatch confirmed"]} /> },
    { num: 19, title: "Component Separation Tracker", group: "Hospital & Blood Bank", tech: "Apheresis · Platelet · FFP · Cryoprecipitate Tracking", status: "prototype", icon: <Layers className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="Whole Blood → Components" val="1 unit → 3 products" /><Row label="RBC Concentrate" val="Available" color="#22c55e" /><Row label="Platelet Concentrate" val="Available" color="#22c55e" /><Row label="Fresh Frozen Plasma" val="6 units" color="#22c55e" /></> },
    { num: 20, title: "Cold Chain Monitor", group: "Hospital & Blood Bank", tech: "IoT Sensor API · 2–6°C Alert · NABH Cold Chain", status: "prototype", icon: <Activity className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><LiveTicker items={["Fridge Unit A: 3.2°C ✔", "Fridge Unit B: 4.1°C ✔", "Transport Box 1: 4.8°C ✔", "Platelet Agitator: 22°C ✔"]} /><Row label="Alert threshold" val="< 2°C or > 6°C" color="#FF1E27" /></> },
    { num: 21, title: "Blood Component Requester", group: "Hospital & Blood Bank", tech: "HL7 Order API · Priority Queue · Clinician Portal", status: "live", icon: <Droplet className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <FormDemo fields={["Component Type", "Blood Group Required", "Units Needed", "Urgency Level", "Ward / Bed No."]} /> },
    { num: 22, title: "Emergency Blood Dispatch", group: "Hospital & Blood Bank", tech: "CATS Integration · GPS Tracker · <15 min SLA", status: "live", icon: <Zap className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><LiveTicker items={["Dispatch #D-2841: O- to AIIMS Trauma — ETA 8 min", "Dispatch #D-2842: AB+ to Safdarjung ICU — ETA 12 min"]} /><Row label="SLA Target" val="< 15 minutes" color="#22c55e" /></> },
    { num: 23, title: "Lab Quality Control", group: "Hospital & Blood Bank", tech: "Levey-Jennings · Westgard Rules · ISO 15189", status: "prototype", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <SimChart vals={[65, 72, 68, 71, 74, 69, 73]} color="rgba(0,210,255,0.5)" /> },
    { num: 24, title: "Hospital Capacity Tracker", group: "Hospital & Blood Bank", tech: "HMIS API · Bed Occupancy · ICU Status", status: "prototype", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <ProgressBars items={[{ label: "ICU Beds", val: 86, color: "#FF1E27" }, { label: "General Wards", val: 72, color: "#f97316" }, { label: "Blood Bank Capacity", val: 58, color: "#22c55e" }]} /> },
    { num: 25, title: "Blood Wastage Report", group: "Hospital & Blood Bank", tech: "Trend Analytics · Root Cause Engine · NABH Waste KPI", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="Monthly Wastage" val="1.2% (Target < 2%)" color="#22c55e" /><Row label="Expiry Waste" val="0.8%" color="#22c55e" /><Row label="Spillage / QC" val="0.4%" color="#22c55e" /><Row label="National Avg" val="2.4%" /></> },

    // GROUP 3: Patient & Request Management (26–40)
    { num: 26, title: "Patient Blood Request", group: "Patient Management", tech: "Clinician Portal · ABHA Linked · Urgency Triage", status: "live", icon: <Heart className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <FormDemo fields={["Blood Group Required", "Units Needed", "Clinical Indication", "Attending Physician ID", "ABHA Patient Ref (optional)"]} /> },
    { num: 27, title: "Emergency Escalation Engine", group: "Patient Management", tech: "Priority Queue · Multi-hospital Broadcast · <10 min SLA", status: "live", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <Stepper steps={["Clinician raises P1 request", "Auto-broadcast 5 nearest banks", "First confirmed match secured", "Cold-chain dispatch initiated", "Delivery confirmed"]} /> },
    { num: 28, title: "Patient Case Manager", group: "Patient Management", tech: "ABDM PHR · Case Timeline · Anonymized Storage", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="Active Cases" val="3,241" color="#22c55e" /><Row label="Avg Fulfillment Time" val="18 min" color="#22c55e" /><Row label="Cases Closed Today" val="487" /><Row label="PII Storage" val="None — DPDP §8(7)" color="#00D2FF" /></> },
    { num: 29, title: "Donor-Patient Impact Ledger", group: "Patient Management", tech: "Non-reversible Case IDs · DPDP §8(7) · Zero PII", status: "live", icon: <Award className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="ANON-4X7K" val="O+ · AIIMS Delhi · Discharged ✔" color="#22c55e" /><Row label="ANON-9R2M" val="O+ · Safdarjung · Surgery OK ✔" color="#22c55e" /><Row label="ANON-3J8W" val="O+ · RML · Mother & Child Safe ✔" color="#22c55e" /></> },
    { num: 30, title: "Thalassemia Patient Registry", group: "Patient Management", tech: "NTCP Registry · Transfusion Schedule · Chelation Log", status: "prototype", icon: <Users className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Counter init={12847} label="Registered thalassemia patients" /><Row label="Monthly Transfusions" val="38,541" /><Row label="Chelation Compliance" val="86%" color="#22c55e" /></> },
    { num: 31, title: "Sickle Cell Patient Care", group: "Patient Management", tech: "NMSCPM · Exchange Transfusion · Crisis Alert", status: "prototype", icon: <Heart className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><LiveTicker items={["Sickle crisis alert: Nagpur — 2 patients", "Exchange transfusion: Raipur — 1 unit O+ needed"]} /><Row label="Registered Patients" val="1,84,312" /></> },
    { num: 32, title: "Dialysis Blood Schedule", group: "Patient Management", tech: "Recurring Appointment · ESRD Registry · NABH", status: "prototype", icon: <RefreshCcw className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="Dialysis Sessions Today" val="4,821" /><Row label="Blood Required / session" val="0–2 units avg" /><Row label="Next Major Drive" val="18 Jul 2025" color="#22c55e" /></> },
    { num: 33, title: "Cancer Care Blood Reserve", group: "Patient Management", tech: "Oncology Reservations · Chemo Schedule Sync · IRCTC", status: "prototype", icon: <Shield className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <ProgressBars items={[{ label: "Platelet Reserve", val: 62, color: "#f97316" }, { label: "RBC Reserve", val: 74, color: "#FF1E27" }, { label: "FFP Reserve", val: 88, color: "#22c55e" }]} /> },
    { num: 34, title: "Pregnancy Emergency Protocol", group: "Patient Management", tech: "OB Emergency · PPH Kit · Labour-ward Priority", status: "live", icon: <Heart className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <Stepper steps={["PPH alert raised by midwife", "O+ priority dispatch triggered", "2 units cross-matched", "Surgeon consented", "Delivered to OT"]} /> },
    { num: 35, title: "Paediatric Blood Registry", group: "Patient Management", tech: "Irradiated Blood · CMV-negative · Weight-based Dosing", status: "prototype", icon: <Users className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="Paediatric Units Available" val="842" color="#22c55e" /><Row label="Irradiated Stock" val="312 units" color="#22c55e" /><Row label="CMV-negative" val="204 units" color="#22c55e" /></> },
    { num: 36, title: "Request Priority Queue", group: "Patient Management", tech: "P0/P1/P2/P3 Triage · Time-to-Fill SLA · Auto-escalate", status: "live", icon: <Zap className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="P0 — Surgical Emergency" val="< 10 min SLA" color="#FF1E27" /><Row label="P1 — ICU Critical" val="< 30 min SLA" color="#f97316" /><Row label="P2 — Planned Surgery" val="< 4 hr SLA" color="#eab308" /><Row label="P3 — Elective" val="< 24 hr SLA" color="#22c55e" /></> },
    { num: 37, title: "Surgical Blood Reserve", group: "Patient Management", tech: "Pre-op Order · Type-and-Screen · MSBOS Protocol", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <FormDemo fields={["Surgery Type", "Estimated Blood Loss (ml)", "Blood Group", "Theatre Date", "Anaesthetist ID"]} /> },
    { num: 38, title: "ICU Blood Availability", group: "Patient Management", tech: "ICU-to-bank real-time API · Ventilator flag · SOFA Score", status: "live", icon: <Activity className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Counter init={48} label="ICU blood requests active now" /><Row label="Avg fulfillment" val="12 min" color="#22c55e" /><Row label="Critical shortage" val="0 current" color="#22c55e" /></> },
    { num: 39, title: "Patient Consent Manager", group: "Patient Management", tech: "DPDP Act §7 Consent · eSign · Revocable", status: "live", icon: <Lock className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <Stepper steps={["Present consent form in preferred language", "Patient/guardian reads purpose", "eSign captured via OTP", "Consent logged with timestamp", "Revocation available anytime"]} /> },
    { num: 40, title: "Medical Report Integration", group: "Patient Management", tech: "ABDM PHR · FHIR R4 · DigiLocker Health Locker", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#a78bfa",
      panel: () => <><Row label="ABHA PHR Linked" val="Consent-only ✔" color="#22c55e" /><Row label="FHIR R4 Format" val="Compliant ✔" color="#22c55e" /><Row label="Encryption" val="AES-256 at rest" color="#22c55e" /></> },

    // GROUP 4: National Grid & Analytics (41–55)
    { num: 41, title: "National Blood Inventory Grid", group: "National Analytics", tech: "gRPC Stream · 36 States · Real-time Aggregation", status: "prototype", icon: <Globe className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Counter init={172265} label="Total units — India grid" /><Row label="States reporting" val="36/36" color="#22c55e" /><Row label="Last sync" val="< 30 sec ago" color="#22c55e" /></> },
    { num: 42, title: "State-wise Shortage Monitor", group: "National Analytics", tech: "Threshold Engine · SMS to CMO · Auto-escalation", status: "prototype", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <AlertFeed items={[{ city: "Uttar Pradesh", msg: "O- < 200 units statewide", level: "critical" }, { city: "Bihar", msg: "AB+ < 50 units", level: "critical" }, { city: "Rajasthan", msg: "Platelet low across 8 districts", level: "warning" }]} /> },
    { num: 43, title: "District Blood Demand Map", group: "National Analytics", tech: "D3.js Choropleth · 739 Districts · PostGIS", status: "prototype", icon: <MapPin className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <SimChart vals={[40, 72, 55, 88, 62, 44, 91]} color="rgba(34,197,94,0.5)" /> },
    { num: 44, title: "Predictive Demand Engine", group: "National Analytics", tech: "Time-series ML · Seasonal Decomposition · ARIMA", status: "prototype", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Next 7 days demand" val="+4.2% above baseline" color="#f59e0b" /><Row label="Festival season spike" val="Dec: +18% predicted" color="#FF1E27" /><Row label="Model accuracy" val="94.3% (test set)" color="#22c55e" /></> },
    { num: 45, title: "Seasonal Shortage Alerts", group: "National Analytics", tech: "Calendar Overlay · Historical Pattern · CMO Notify", status: "prototype", icon: <Bell className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><LiveTicker items={["Diwali window: Oct–Nov — predicted 22% demand spike", "Monsoon: Jul–Sep — donation drop 14% historical", "Winter drive needed: Jan — target 40k new donors"]} /></> },
    { num: 46, title: "National Donor Database", group: "National Analytics", tech: "Anonymized · Zero PII at national level · DPDP §8", status: "prototype", icon: <Database className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Counter init={48321654} label="Registered donors (India)" /><Row label="Active last 12 months" val="12,84,312" color="#22c55e" /><Row label="PII stored" val="None — tokenized only" color="#00D2FF" /></> },
    { num: 47, title: "Geographic Blood Flow", group: "National Analytics", tech: "Sankey Diagram · State-to-state Transfer Log", status: "prototype", icon: <Network className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Top exporter" val="Maharashtra (8,421 units/mo)" color="#22c55e" /><Row label="Top importer" val="J&K (3,241 units/mo)" color="#f59e0b" /><Row label="Cross-border today" val="1,247 units" /></> },
    { num: 48, title: "Supply Chain Analytics", group: "National Analytics", tech: "End-to-end Tracking · Wastage KPI · Cost per unit", status: "prototype", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <ProgressBars items={[{ label: "Collection efficiency", val: 87, color: "#22c55e" }, { label: "Processing yield", val: 94, color: "#22c55e" }, { label: "Delivery on time", val: 91, color: "#22c55e" }]} /> },
    { num: 49, title: "Wastage Reduction AI", group: "National Analytics", tech: "Expiry Prediction · Smart Reorder · ML Clustering", status: "prototype", icon: <Cpu className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Predicted wastage (next 7d)" val="0.9%" color="#22c55e" /><Row label="Recommended transfer" val="42 units O- UP→Delhi" color="#f59e0b" /><Row label="AI confidence" val="91.2%" color="#22c55e" /></> },
    { num: 50, title: "Blood Type Distribution", group: "National Analytics", tech: "ICMR Data · Population-weighted · Live update", status: "live", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <ProgressBars items={[{ label: "O+", val: 37, color: "#FF1E27" }, { label: "A+", val: 22, color: "#f97316" }, { label: "B+", val: 25, color: "#eab308" }, { label: "AB+", val: 7, color: "#a78bfa" }, { label: "O-", val: 5, color: "#FF6B6B" }]} /> },
    { num: 51, title: "Regional Blood Bank Network", group: "National Analytics", tech: "Cluster Map · Capacity Score · eRaktKosh Sync", status: "prototype", icon: <Network className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Zonal centres" val="8 (all India)" color="#22c55e" /><Row label="Regional hubs" val="52" color="#22c55e" /><Row label="District banks" val="739" color="#22c55e" /></> },
    { num: 52, title: "National Emergency Reserve", group: "National Analytics", tech: "Strategic Reserve · Disaster Protocol · MoH Approval", status: "standby", icon: <Shield className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="O- Reserve" val="12,400 units" color="#22c55e" /><Row label="AB+ Reserve" val="3,200 units" color="#22c55e" /><Row label="Deploy trigger" val="National disaster (Level 3)" color="#FF1E27" /></> },
    { num: 53, title: "Mobile Blood Camp Tracker", group: "National Analytics", tech: "Camp Registration · Volunteer App · GPS Check-in", status: "live", icon: <MapPin className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Counter init={284} label="Camps active today (India)" /><Row label="Units collected today" val="18,421" color="#22c55e" /><Row label="Volunteers active" val="4,312" color="#22c55e" /></> },
    { num: 54, title: "Blood Drive Scheduler", group: "National Analytics", tech: "Corporate API · College Tie-ups · Calendar Integration", status: "live", icon: <RefreshCcw className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <FormDemo fields={["Organiser Name", "Venue / Address", "Expected Donors", "Target Blood Group Priority", "Contact Number"]} /> },
    { num: 55, title: "National Statistics Dashboard", group: "National Analytics", tech: "NHA API · HMIS Data · MoHFW Reports · Annual", status: "prototype", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Annual collections" val="1.4 Cr units (2024)" color="#22c55e" /><Row label="Annual requirement" val="1.5 Cr units" color="#f59e0b" /><Row label="Gap" val="7.1% deficit" color="#FF1E27" /><Row label="Voluntary rate" val="92%" color="#22c55e" /></> },

    // GROUP 5: Compliance & Security (56–70)
    { num: 56, title: "DPDP Act Compliance Monitor", group: "Compliance & Security", tech: "DPDP 2023 §§7–12 · Consent Audit · Data Principal Rights", status: "live", icon: <Shield className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Consent collected" val="100% — before any storage" color="#22c55e" /><Row label="Erasure requests" val="0 pending" color="#22c55e" /><Row label="Data fiduciary" val="MoHFW (Govt of India)" color="#00D2FF" /></> },
    { num: 57, title: "Data Encryption Audit", group: "Compliance & Security", tech: "AES-256 at rest · TLS 1.3 in transit · Key rotation", status: "live", icon: <Lock className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <ProgressBars items={[{ label: "At-rest encryption", val: 100, color: "#22c55e" }, { label: "In-transit (TLS 1.3)", val: 100, color: "#22c55e" }, { label: "Key rotation schedule", val: 100, color: "#22c55e" }]} /> },
    { num: 58, title: "Access Control Manager", group: "Compliance & Security", tech: "RBAC · OAuth2 PKCE · Principle of Least Privilege", status: "live", icon: <Lock className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <ToggleDemo labels={["Donor (read-only)", "Hospital Staff", "Lab Technician", "Authority Admin", "WHO Observer"]} /> },
    { num: 59, title: "Audit Trail Viewer", group: "Compliance & Security", tech: "Immutable Log · WORM Storage · Timestamp Hash", status: "live", icon: <FileText className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Last audit entry" val="Today 09:41:12" color="#22c55e" /><Row label="Total log entries" val="1,24,84,312" /><Row label="Tamper evidence" val="SHA-256 chain ✔" color="#22c55e" /></> },
    { num: 60, title: "NABH Certification Tracker", group: "Compliance & Security", tech: "NABH API · Validity Calendar · Renewal Alerts", status: "prototype", icon: <Award className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Certified hospitals" val="1,847 / 2,154" color="#22c55e" /><Row label="Expiring this month" val="42" color="#f59e0b" /><Row label="Overdue renewal" val="3" color="#FF1E27" /></> },
    { num: 61, title: "IT Act 2000 § 43A Panel", group: "Compliance & Security", tech: "Reasonable Security Practices · CERT-IN · ISO 27001", status: "live", icon: <Shield className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <ProgressBars items={[{ label: "ISO 27001 adherence", val: 94, color: "#22c55e" }, { label: "CERT-In reporting", val: 100, color: "#22c55e" }, { label: "Pen test (last 90 days)", val: 88, color: "#22c55e" }]} /> },
    { num: 62, title: "Privacy Policy Enforcer", group: "Compliance & Security", tech: "DPDP §6 Notice · Multi-language · Auto-update", status: "live", icon: <FileText className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Languages available" val="22 (all Scheduled)" color="#22c55e" /><Row label="Last updated" val="01 Apr 2025" color="#22c55e" /><Row label="User acceptance rate" val="99.7%" color="#22c55e" /></> },
    { num: 63, title: "Data Retention Manager", group: "Compliance & Security", tech: "Retention Schedule · Auto-purge · DPDP §9 Purpose Limit", status: "live", icon: <Clock className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Donation records" val="10 years (NABH)" /><Row label="PII (if any)" val="Purged on purpose end" color="#22c55e" /><Row label="Audit logs" val="7 years (IT Act)" /></> },
    { num: 64, title: "Breach Detection System", group: "Compliance & Security", tech: "SIEM · Anomaly Detection · CERT-In 6-hour reporting", status: "standby", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Incidents (last 90d)" val="0" color="#22c55e" /><Row label="Anomalies flagged" val="3 (all false positive)" color="#22c55e" /><Row label="CERT-In contact" val="incident@cert-in.org.in" /></> },
    { num: 65, title: "Consent Management System", group: "Compliance & Security", tech: "DPDP §7 Consent Records · OTP Verified · Revocable", status: "live", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <Stepper steps={["Present purpose in local language", "Granular consent per data type", "OTP verification", "Timestamp + hash stored", "Revocation button available"]} /> },
    { num: 66, title: "ABHA Integration Monitor", group: "Compliance & Security", tech: "ABDM M1–M3 · PHR App · Token Refresh", status: "prototype", icon: <Network className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="M1 PHR App" val="Compliant ✔" color="#22c55e" /><Row label="M2 ABHA Share" val="Consent-gate ✔" color="#22c55e" /><Row label="M3 HIP/HIU" val="API Key pending" color="#f59e0b" /></> },
    { num: 67, title: "DigiLocker Verification", group: "Compliance & Security", tech: "DigiLocker API · Aadhaar eKYC · OAuth2 Tokenized", status: "prototype", icon: <Shield className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Donor ID Verify" val="DigiLocker API needed" color="#f59e0b" /><Row label="Hospital License" val="DigiLocker verified ✔" color="#22c55e" /><Row label="Token storage" val="None — stateless" color="#22c55e" /></> },
    { num: 68, title: "eSign Integration", group: "Compliance & Security", tech: "eSign API · Aadhaar OTP · IT Act § 5 Legal Validity", status: "prototype", icon: <FileText className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <Stepper steps={["Consent document prepared", "Aadhaar OTP triggered", "eSign API call (NSDL)", "Signed document archived", "IT Act §5 compliance confirmed"]} /> },
    { num: 69, title: "ISO 27001 Compliance", group: "Compliance & Security", tech: "ISMS Controls · Risk Register · Annual Audit", status: "standby", icon: <Award className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <ProgressBars items={[{ label: "Control A.5 — Policies", val: 100, color: "#22c55e" }, { label: "Control A.9 — Access", val: 94, color: "#22c55e" }, { label: "Control A.12 — Operations", val: 88, color: "#22c55e" }, { label: "Control A.16 — Incidents", val: 96, color: "#22c55e" }]} /> },
    { num: 70, title: "Cyber Security Dashboard", group: "Compliance & Security", tech: "VAPT · WAF · DDoS Mitigation · CERT-In Reported", status: "live", icon: <Shield className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="WAF status" val="Active · 0 blocks today" color="#22c55e" /><Row label="DDoS protection" val="Cloudflare Anycast" color="#22c55e" /><Row label="Last VAPT" val="Mar 2025 — Clear" color="#22c55e" /></> },

    // GROUP 6: Communication & Alerts (71–85)
    { num: 71, title: "SMS Alert System", group: "Communication & Alerts", tech: "NIC SMS Gateway · DLT Registered · 22 Languages", status: "live", icon: <Send className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Counter init={84321} label="SMS sent today" /><Row label="Delivery rate" val="98.4%" color="#22c55e" /><Row label="DLT Registration" val="Active ✔" color="#22c55e" /></> },
    { num: 72, title: "Push Notification Manager", group: "Communication & Alerts", tech: "FCM · APNs · Segmented Audience · A/B Testing", status: "live", icon: <Bell className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <FormDemo fields={["Alert Title", "Message (max 160 chars)", "Target Group (All / Donor / Hospital)", "Schedule Time"]} /> },
    { num: 73, title: "Email Campaign Manager", group: "Communication & Alerts", tech: "NIC Gov Email · DKIM/SPF · Unsubscribe Compliant", status: "prototype", icon: <Send className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Open rate" val="34.2%" color="#22c55e" /><Row label="Click rate" val="8.7%" color="#22c55e" /><Row label="Unsubscribe rate" val="0.3%" color="#22c55e" /></> },
    { num: 74, title: "WhatsApp Integration", group: "Communication & Alerts", tech: "WhatsApp Business API · Template Messages · TRAI", status: "prototype", icon: <Phone className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Status" val="API Key Required" color="#f59e0b" /><Row label="Template approved" val="3 templates ready" color="#22c55e" /><Row label="TRAI DLT" val="Registered ✔" color="#22c55e" /></> },
    { num: 75, title: "IVR Voice Alert System", group: "Communication & Alerts", tech: "Bhashini TTS · Hindi/Regional · TRAI Compliant", status: "prototype", icon: <Phone className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Languages" val="6 (HI/TA/BN/GU/MR/TE)" color="#22c55e" /><Row label="Call success rate" val="87.3%" color="#22c55e" /><Row label="TRAI Compliance" val="Fully registered" color="#22c55e" /></> },
    { num: 76, title: "Emergency Broadcast System", group: "Communication & Alerts", tech: "Multi-sig Authority Chain · 12,847 nodes · < 30 sec", status: "live", icon: <Radio className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Last broadcast" val="Today 08:12 AM" color="#22c55e" /><Row label="Nodes reached" val="12,847 / 12,847" color="#22c55e" /><Row label="Authority signatures" val="3/3 ✔" color="#22c55e" /></> },
    { num: 77, title: "Media Alert System", group: "Communication & Alerts", tech: "PIB API · DD News · ANI/PTI Syndication", status: "prototype", icon: <Radio className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="PIB Integration" val="API Key required" color="#f59e0b" /><Row label="DD Newsroom" val="Partner portal active" color="#22c55e" /><Row label="Press releases/month" val="12 avg" /></> },
    { num: 78, title: "Community Outreach Module", group: "Communication & Alerts", tech: "NGO Portal · ASHA Workers · Gram Panchayat API", status: "prototype", icon: <Users className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Counter init={8421} label="ASHA workers enrolled" /><Row label="Villages covered" val="6,42,000+" color="#22c55e" /><Row label="Gram Sabha alerts sent" val="1,24,000" color="#22c55e" /></> },
    { num: 79, title: "Social Media Integration", group: "Communication & Alerts", tech: "Twitter/X API · Facebook Graph · DPDP aware", status: "prototype", icon: <Globe className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Twitter API v2" val="API Key required" color="#f59e0b" /><Row label="Facebook Graph" val="API Key required" color="#f59e0b" /><Row label="Content policy" val="No PII in posts ✔" color="#22c55e" /></> },
    { num: 80, title: "Mass Notification System", group: "Communication & Alerts", tech: "Kafka Parallel · FCM + SMS + Email · 10M+ per hour", status: "standby", icon: <Zap className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Kafka partitions" val="P-0 to P-3 (4 active)" color="#22c55e" /><Row label="Throughput" val="10M msgs / hr" color="#22c55e" /><Row label="Dead letter queue" val="0 messages" color="#22c55e" /></> },
    { num: 81, title: "Doctor Alert Network", group: "Communication & Alerts", tech: "NMC Doctor Registry · Specialty Filter · Secure Message", status: "prototype", icon: <Bell className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Doctors enrolled" val="4,21,000+" color="#22c55e" /><Row label="Haematologists" val="2,847" color="#22c55e" /><Row label="Alert delivery" val="Secure in-app message" color="#22c55e" /></> },
    { num: 82, title: "Volunteer Mobilization", group: "Communication & Alerts", tech: "Geo-search · Availability Slot · NSS/NCC Integration", status: "live", icon: <Users className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Counter init={18412} label="Volunteers available today" /><Row label="NSS chapters" val="8,241" color="#22c55e" /><Row label="Response to emergency" val="< 2 hours avg" color="#22c55e" /></> },
    { num: 83, title: "Public Awareness Tracker", group: "Communication & Alerts", tech: "Campaign KPI · Survey API · Regional Reach", status: "prototype", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <ProgressBars items={[{ label: "Urban awareness", val: 78, color: "#22c55e" }, { label: "Semi-urban", val: 54, color: "#eab308" }, { label: "Rural", val: 31, color: "#FF1E27" }]} /> },
    { num: 84, title: "News Feed Manager", group: "Communication & Alerts", tech: "RSS · NIC News · WHO Press · Auto-moderate", status: "live", icon: <FileText className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <ToggleDemo labels={["NIC Blood News", "WHO Updates", "MoHFW Circulars", "State Health Dept"]} /> },
    { num: 85, title: "Multi-language Alert System", group: "Communication & Alerts", tech: "Bhashini Translate · 22 Scheduled Languages · Real-time", status: "prototype", icon: <Globe className="w-3.5 h-3.5" />, color: "#ec4899",
      panel: () => <><Row label="Languages supported" val="22 (all Scheduled)" color="#22c55e" /><Row label="Translation engine" val="Bhashini (NLP4Bharat)" color="#00D2FF" /><Row label="Avg translation time" val="< 200ms" color="#22c55e" /></> },

    // GROUP 7: Govt API (86–90)
    { num: 86, title: "e-RaktKosh Live Sync Hub", group: "Govt API Integration", tech: "e-RaktKosh REST · Webhooks Gateway · NABH", status: "prototype", icon: <Database className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="INVENTORY_UPDATE" val="AIIMS Delhi — O- +3" color="#22c55e" /><Row label="EMERGENCY_REQUEST" val="Safdarjung — AB+ −2" color="#FF1E27" /><Row label="CROSS_MATCH_DONE" val="PGI Chandigarh — A+ −1" color="#22c55e" /><Row label="BATCH_EXPIRY_ALERT" val="LNJP — B- −4" color="#f59e0b" /></> },
    { num: 87, title: "ABHA Health ID Gateway", group: "Govt API Integration", tech: "ABDM M1/M2/M3 · No local PII cache · Tokenized", status: "prototype", icon: <Shield className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="M1 PHR Registration" val="Compliant ✔" color="#22c55e" /><Row label="M2 Profile Share" val="Consent-only ✔" color="#22c55e" /><Row label="M3 HIP/HIU" val="API Key Required" color="#f59e0b" /><Row label="Data Residency" val="India (MEITY) ✔" color="#22c55e" /></> },
    { num: 88, title: "Secure Identity Verification", group: "Govt API Integration", tech: "OAuth2 PKCE · Token Exchange · DigiLocker", status: "prototype", icon: <GitBranch className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <Stepper steps={["Request OAuth2 Token", "ABDM Validate identity", "DPDP Consent Check", "Scoped JWT Issued", "Token auto-expires 1hr"]} /> },
    { num: 89, title: "Udyam MSME Compliance", group: "Govt API Integration", tech: "Ministry MSME Verifier · GST Sync · Udyam Reg.", status: "prototype", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="Udyam Verify" val="API Key Required" color="#f59e0b" /><Row label="GST Check" val="GSTN API Required" color="#f59e0b" /><Row label="IT Act §43A" val="Verified ✔" color="#22c55e" /></> },
    { num: 90, title: "Open API Webhook Manager", group: "Govt API Integration", tech: "Kong Gateway · Rate Limiting · JWT Auth", status: "prototype", icon: <Wifi className="w-3.5 h-3.5" />, color: "#00D2FF",
      panel: () => <><Row label="Rate limit" val="1,000 req/min" color="#22c55e" /><Row label="Auth" val="JWT + API Key" color="#22c55e" /><Row label="Retry policy" val="Exp. backoff 3×" color="#22c55e" /></> },

    // GROUP 8: Ground-Level Data (91–93)
    { num: 91, title: "Village-Level Worker Input", group: "Ground-Level Data", tech: "React Native · SQLite Offline · ASHA Workers", status: "prototype", icon: <Users className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Offline DB" val="SQLite CRDT ✔" color="#22c55e" /><Row label="Sync strategy" val="Conflict-free replication" color="#22c55e" /><Row label="Last sync" val="Today 08:32 AM" color="#22c55e" /></> },
    { num: 92, title: "Block & District Aggregator", group: "Ground-Level Data", tech: "Apache Spark · Distributed Batch · Delta Lake", status: "standby", icon: <Layers className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <><Row label="Spark cluster" val="3-node (standby)" color="#f59e0b" /><Row label="Batch frequency" val="Every 6 hours" /><Row label="Districts covered" val="739 / 739" color="#22c55e" /></> },
    { num: 93, title: "State Resource Allocation", group: "Ground-Level Data", tech: "Knapsack Algorithm · LP Solver · Constraint Engine", status: "prototype", icon: <Cpu className="w-3.5 h-3.5" />, color: "#22c55e",
      panel: () => <ProgressBars items={[{ label: "O- Units allocated", val: 78, color: "#FF1E27" }, { label: "Ambulances deployed", val: 67, color: "#f97316" }, { label: "ICU beds available", val: 24, color: "#ef4444" }]} /> },

    // GROUP 9: National/Global (94–96)
    { num: 94, title: "National Blood Grid gRPC", group: "National / Global Integration", tech: "gRPC Protobuf · mTLS · < 50ms P99 Latency", status: "prototype", icon: <Zap className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Row label="Protocol" val="gRPC / HTTP2" color="#00D2FF" /><Row label="Latency target" val="< 50ms P99" color="#22c55e" /><Row label="Auth" val="mTLS + Service Mesh" color="#22c55e" /><Row label="Nodes active" val="1,247 hospitals" color="#22c55e" /></> },
    { num: 95, title: "WHO Global Analytics Panel", group: "National / Global Integration", tech: "GraphQL · FHIR R4 · SNOMED CT · HL7", status: "prototype", icon: <Globe className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Row label="BloodBank BB-IN-MH-0042" val="active · 847 units" color="#22c55e" /><Row label="FHIR R4 Compliant" val="✔" color="#22c55e" /><Row label="SNOMED CT coded" val="✔" color="#22c55e" /></> },
    { num: 96, title: "WHO Emergency Geo Filter", group: "National / Global Integration", tech: "PostGIS · QuadTree · R-Tree · Geofence Engine", status: "prototype", icon: <MapPin className="w-3.5 h-3.5" />, color: "#FF1E27",
      panel: () => <><Row label="Quadtree depth" val="8 levels" color="#22c55e" /><Row label="Emergency zones" val="7 active" color="#FF1E27" /><Row label="Index update" val="< 1 sec" color="#22c55e" /></> },

    // GROUP 10: Real-time Comms (97–98)
    { num: 97, title: "Dynamic Text Alert System", group: "Real-time Communications", tech: "NestJS WebSocket · Sanitized · XSS Protected", status: "prototype", icon: <Bell className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => { const [msgs, setMsgs] = useState<string[]>(["Critical O- shortage — UP State"]); const [inp, setInp] = useState(""); return <div className="flex flex-col gap-2"><div className="flex flex-col gap-1 max-h-20 overflow-y-auto">{msgs.map((m, i) => <div key={i} className="text-[9px] px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)" }}>{m}</div>)}</div><div className="flex gap-2"><input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && inp.trim() && (setMsgs(m => [inp.trim(), ...m.slice(0, 4)]), setInp(""))} placeholder="Broadcast message..." className="flex-1 text-[9px] px-2 py-1.5 rounded-lg bg-transparent border text-white placeholder-gray-700 focus:outline-none" style={{ borderColor: "rgba(245,158,11,0.3)" }} maxLength={60} /><Btn onClick={() => { if (inp.trim()) { setMsgs(m => [inp.trim(), ...m.slice(0, 4)]); setInp(""); } }} color="#f59e0b">SEND</Btn></div></div>; } },
    { num: 98, title: "Event-Driven Mass Broadcaster", group: "Real-time Communications", tech: "Apache Kafka · FCM Cluster · Dead-letter Queue", status: "standby", icon: <Radio className="w-3.5 h-3.5" />, color: "#f59e0b",
      panel: () => <><Row label="Partition P-0 BLOOD_CRITICAL" val="1,240 msgs · lag: 0" color="#22c55e" /><Row label="Partition P-1 DONOR_NOTIFY" val="8,932 msgs · lag: 2" color="#f59e0b" /><Row label="Partition P-2 HOSPITAL_SYNC" val="4,451 msgs · lag: 0" color="#22c55e" /></> },

    // GROUP 11: AI & Voice (99–100)
    { num: 99, title: "Visual AI Camera Scanner", group: "AI & Voice Intelligence", tech: "WebRTC MediaDevices · TF.js MobileNet · LOINC", status: "live", icon: <Camera className="w-3.5 h-3.5" />, color: "#F4C430",
      panel: () => <><div className="rounded-xl p-3 text-center mb-2" style={{ background: "rgba(244,196,48,0.05)", border: "1px solid rgba(244,196,48,0.15)" }}><div className="text-xs font-black text-white mb-1">WebRTC Camera Active</div><div className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>5 detection classes · TF.js MobileNet v3</div><Link href="/donor" className="mt-2 inline-block text-[9px] font-black px-3 py-1.5 rounded-lg" style={{ background: "rgba(244,196,48,0.1)", border: "1px solid rgba(244,196,48,0.3)", color: "#F4C430" }}>Open AI Guardian →</Link></div><Row label="Inference" val="Browser-side · no data leaves device" color="#22c55e" /><Row label="Disclaimer" val="Informational only · Consult doctor" color="#FF1E27" /></> },
    { num: 100, title: "Voice-Guided AI Doctor", group: "AI & Voice Intelligence", tech: "Web Speech API · Bhashini · Google Cloud TTS · SSML", status: "live", icon: <Mic className="w-3.5 h-3.5" />, color: "#F4C430",
      panel: () => { const [speaking, setSpeaking] = useState(false); const [lang, setLang] = useState<"hi-IN" | "ta-IN" | "bn-IN" | "en-IN">("hi-IN"); const scripts: Record<string, string> = { "hi-IN": "नमस्ते। मैं रक्त कवच का AI स्वास्थ्य सहायक हूँ। रक्तदान करें, किसी की जान बचाएँ।", "ta-IN": "வணக்கம். ரக்த் கவச் AI உதவியாளர். இரத்த தானம் செய்யுங்கள்.", "bn-IN": "নমস্কার। রক্ত কবচ AI সহায়তাকারী। রক্তদান করুন।", "en-IN": "Hello. I am Rakt Kavach AI. Please donate blood and save lives." }; const speak = () => { window.speechSynthesis?.cancel(); const u = new SpeechSynthesisUtterance(scripts[lang]); u.lang = lang; u.rate = 0.9; u.onstart = () => setSpeaking(true); u.onend = () => setSpeaking(false); window.speechSynthesis?.speak(u); setSpeaking(true); }; return <div className="flex flex-col gap-2"><div className="flex flex-wrap gap-1.5">{(["hi-IN","ta-IN","bn-IN","en-IN"] as const).map(l => <button key={l} onClick={() => setLang(l)} className="text-[8px] font-bold px-2 py-1 rounded cursor-pointer" style={{ background: lang === l ? "rgba(244,196,48,0.15)" : "rgba(255,255,255,0.04)", color: lang === l ? "#F4C430" : "rgba(255,255,255,0.4)", border: `1px solid ${lang === l ? "rgba(244,196,48,0.3)" : "rgba(255,255,255,0.08)"}` }}>{l.split("-")[0].toUpperCase()}</button>)}</div><p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{scripts[lang]}</p><Btn onClick={speaking ? () => { window.speechSynthesis?.cancel(); setSpeaking(false); } : speak} color={speaking ? "#F4C430" : "#00D2FF"} fullWidth>{speaking ? <><Volume2 className="w-3.5 h-3.5 animate-pulse" /> SPEAKING... (tap to stop)</> : <><Mic className="w-3.5 h-3.5" /> SPEAK HEALTH ADVISORY</>}</Btn></div>; } },
  ];
}

const STATUS_COLOR: Record<ModStatus, string> = { live: "#22c55e", standby: "#f59e0b", prototype: "#00D2FF", "api-required": "#a78bfa" };
const STATUS_LABEL: Record<ModStatus, string> = { live: "● LIVE", standby: "◎ STANDBY", prototype: "◈ PROTOTYPE", "api-required": "⚡ API REQ" };

const GROUPS = [
  "All", "Donor Management", "Hospital & Blood Bank", "Patient Management",
  "National Analytics", "Compliance & Security", "Communication & Alerts",
  "Govt API Integration", "Ground-Level Data", "National / Global Integration",
  "Real-time Communications", "AI & Voice Intelligence"
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AllModulesPage() {
  const MODULES = buildModules();
  const [selected, setSelected] = useState<number | null>(null);
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = MODULES.filter(m => {
    const matchGroup = group === "All" || m.group === group;
    const matchQuery = !query || m.title.toLowerCase().includes(query.toLowerCase()) || String(m.num).includes(query);
    return matchGroup && matchQuery;
  });

  const selectedMod = MODULES.find(m => m.num === selected);

  const selectModule = (num: number) => {
    setSelected(prev => prev === num ? null : num);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  };

  const counts = { live: MODULES.filter(m => m.status === "live").length, standby: MODULES.filter(m => m.status === "standby").length, prototype: MODULES.filter(m => m.status === "prototype").length };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg,#020613 0%,#030812 100%)" }}>

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(2,6,19,0.98)", borderBottom: "1px solid rgba(0,210,255,0.12)", backdropFilter: "blur(12px)" }}>
        <Link href="/authority" style={{ color: "rgba(255,255,255,0.5)" }}><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-black tracking-widest text-white">ALL 100 MODULES</div>
          <div className="text-[8px]" style={{ color: "rgba(0,210,255,0.5)" }}>NATIONAL BLOOD GRID · INTERACTIVE EXPLORER</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>● {counts.live} LIVE</span>
          <button onClick={() => setShowFilters(f => !f)} style={{ color: "rgba(255,255,255,0.5)" }}>
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── SEARCH & STATS ── */}
      <div className="px-4 py-2 flex flex-col gap-2" style={{ background: "rgba(2,6,19,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search module name or number..."
            className="w-full text-[10px] pl-8 pr-3 py-2 rounded-xl bg-transparent border text-white placeholder-gray-700 focus:outline-none"
            style={{ borderColor: "rgba(0,210,255,0.2)" }} />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pb-1">
                {GROUPS.map(g => (
                  <button key={g} onClick={() => setGroup(g)}
                    className="text-[8px] font-bold px-2 py-1 rounded-full cursor-pointer"
                    style={{ background: group === g ? "rgba(0,210,255,0.12)" : "rgba(255,255,255,0.04)", color: group === g ? "#00D2FF" : "rgba(255,255,255,0.4)", border: `1px solid ${group === g ? "rgba(0,210,255,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 text-[8px]">
          <span style={{ color: "rgba(255,255,255,0.3)" }}>{filtered.length} modules</span>
          <span style={{ color: "#22c55e" }}>● {counts.live} live</span>
          <span style={{ color: "#f59e0b" }}>◎ {counts.standby} standby</span>
          <span style={{ color: "#00D2FF" }}>◈ {MODULES.length - counts.live - counts.standby} prototype</span>
        </div>
      </div>

      {/* ── MODULE LIST + DETAIL PANEL ── */}
      <div className="flex-1 overflow-y-auto">
        {selected && selectedMod && (
          <motion.div ref={detailRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-4 rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${selectedMod.color}30`, background: "rgba(2,6,19,0.95)" }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: `${selectedMod.color}08`, borderBottom: `1px solid ${selectedMod.color}15` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${selectedMod.color}15`, border: `1px solid ${selectedMod.color}30`, color: selectedMod.color }}>
                  {selectedMod.icon}
                </div>
                <div>
                  <div className="text-[8px] font-black tracking-widest" style={{ color: `${selectedMod.color}70` }}>MODULE {selectedMod.num} · {selectedMod.group}</div>
                  <div className="text-sm font-black text-white">{selectedMod.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black px-2 py-1 rounded"
                  style={{ background: `${STATUS_COLOR[selectedMod.status]}15`, color: STATUS_COLOR[selectedMod.status], border: `1px solid ${STATUS_COLOR[selectedMod.status]}30` }}>
                  {STATUS_LABEL[selectedMod.status]}
                </span>
                <button onClick={() => setSelected(null)} style={{ color: "rgba(255,255,255,0.3)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3">
              <div className="text-[8px] font-mono" style={{ color: `${selectedMod.color}60` }}>{selectedMod.tech}</div>
              {selectedMod.panel()}
              <div className="text-[7px] font-bold pt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
                DPDP Act 2023 Compliant · IT Act 2000 §43A · No PII stored locally
              </div>
            </div>
          </motion.div>
        )}

        <div className="px-4 pt-4 pb-10 flex flex-col gap-1.5">
          {filtered.map(mod => (
            <motion.div key={mod.num} layout
              onClick={() => selectModule(mod.num)}
              className="rounded-xl cursor-pointer transition-colors"
              style={{
                background: selected === mod.num ? `${mod.color}08` : "rgba(255,255,255,0.02)",
                border: `1px solid ${selected === mod.num ? `${mod.color}30` : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="px-3 py-2.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}20`, color: mod.color }}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black" style={{ color: `${mod.color}60` }}>#{mod.num}</span>
                    <span className="text-[10px] font-bold text-white truncate">{mod.title}</span>
                  </div>
                  <div className="text-[8px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{mod.group}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[7px] font-bold" style={{ color: STATUS_COLOR[mod.status] }}>
                    {STATUS_LABEL[mod.status]}
                  </span>
                  <motion.div animate={{ rotate: selected === mod.num ? 90 : 0 }}>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.2)" }} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.25)" }}>
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <div className="text-sm">No modules found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
