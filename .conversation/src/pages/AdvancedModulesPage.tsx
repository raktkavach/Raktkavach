import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Wifi, Shield, Globe, Database, Activity, Radio,
  Zap, Network, MapPin, Bell, Mic, Camera, Users, Layers,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, RotateCcw,
  Server, GitBranch, Cpu, Volume2, Eye
} from "lucide-react";
import { Link } from "wouter";

type ModuleStatus = "live" | "standby" | "prototype";

interface ModuleCardProps {
  num: number;
  title: string;
  tech: string;
  status: ModuleStatus;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

function ModuleCard({ num, title, tech, status, icon, color, children }: ModuleCardProps) {
  const statusStyle = {
    live: { color: "#22c55e", label: "● LIVE", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
    standby: { color: "#f59e0b", label: "◎ STANDBY", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
    prototype: { color: "#00D2FF", label: "◈ PROTOTYPE", bg: "rgba(0,210,255,0.1)", border: "rgba(0,210,255,0.25)" },
  }[status];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}20`, background: "rgba(2,6,19,0.85)" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${color}08`, borderBottom: `1px solid ${color}15` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
            {icon}
          </div>
          <div>
            <div className="text-[8px] font-black tracking-widest" style={{ color: `${color}80` }}>MODULE {num}</div>
            <div className="text-xs font-black text-white">{title}</div>
          </div>
        </div>
        <span className="text-[8px] font-black px-2 py-1 rounded" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
          {statusStyle.label}
        </span>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="text-[8px] font-mono" style={{ color: `${color}60` }}>{tech}</div>
        {children}
        <div className="mt-1 text-[7px] font-bold" style={{ color: "rgba(255,255,255,0.15)" }}>
          DPDP Act 2023 Compliant · IT Act 2000 § 43A · No PII stored locally
        </div>
      </div>
    </div>
  );
}

function LiveRow({ label, value, color = "#00D2FF" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
      <span className="text-[10px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function PulseDot() {
  return <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />;
}

function WebhookFeed() {
  const events = [
    { time: "09:41:12", type: "INVENTORY_UPDATE", node: "AIIMS Delhi", bloodType: "O-", units: "+3" },
    { time: "09:40:58", type: "EMERGENCY_REQUEST", node: "Safdarjung", bloodType: "AB+", units: "−2" },
    { time: "09:40:33", type: "CROSS_MATCH_DONE", node: "PGI Chandigarh", bloodType: "A+", units: "−1" },
    { time: "09:39:47", type: "BATCH_EXPIRY_ALERT", node: "LNJP Hospital", bloodType: "B-", units: "−4" },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(34,197,94,0.15)" }}>
      {events.map((e, i) => (
        <div key={i} className="px-3 py-2 flex items-center gap-2 text-[9px]" style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.3)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <span style={{ color: "rgba(255,255,255,0.25)" }} className="font-mono shrink-0">{e.time}</span>
          <span className="font-bold" style={{ color: e.type === "EMERGENCY_REQUEST" ? "#FF1E27" : "#22c55e" }}>{e.type}</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }} className="truncate">{e.node}</span>
          <span className="ml-auto font-black shrink-0" style={{ color: e.units.startsWith("+") ? "#22c55e" : "#FF6B6B" }}>{e.bloodType} {e.units}</span>
        </div>
      ))}
    </div>
  );
}

function OAuthFlow() {
  const [step, setStep] = useState(0);
  const steps = ["Request Token", "ABDM Validate", "Consent Check", "Token Issued"];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1 shrink-0">
          <div className="px-2 py-1 rounded text-[8px] font-bold transition-all duration-500"
            style={{ background: i === step ? "rgba(0,210,255,0.15)" : "rgba(255,255,255,0.04)", color: i === step ? "#00D2FF" : "rgba(255,255,255,0.3)", border: `1px solid ${i === step ? "rgba(0,210,255,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            {i < step ? "✔" : i === step ? "⟳" : "○"} {s}
          </div>
          {i < steps.length - 1 && <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "rgba(255,255,255,0.15)" }} />}
        </div>
      ))}
    </div>
  );
}

function KnapsackViz() {
  const resources = [
    { name: "O- Units", alloc: 78, total: 100, color: "#FF1E27" },
    { name: "Ambulances", alloc: 54, total: 80, color: "#f97316" },
    { name: "ICU Beds", alloc: 91, total: 120, color: "#00D2FF" },
    { name: "Medics", alloc: 203, total: 250, color: "#22c55e" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {resources.map(r => (
        <div key={r.name}>
          <div className="flex justify-between text-[9px] mb-0.5">
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{r.name}</span>
            <span style={{ color: r.color }}>{r.alloc}/{r.total}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${(r.alloc / r.total) * 100}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SpatialGrid() {
  const cells = Array.from({ length: 25 });
  const hot = [2, 7, 8, 12, 13, 18, 19];
  return (
    <div>
      <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {cells.map((_, i) => (
          <div key={i} className="aspect-square rounded-sm flex items-center justify-center text-[7px] font-bold"
            style={{
              background: hot.includes(i) ? "rgba(255,30,39,0.3)" : "rgba(0,210,255,0.06)",
              border: `1px solid ${hot.includes(i) ? "rgba(255,30,39,0.4)" : "rgba(0,210,255,0.1)"}`,
              color: hot.includes(i) ? "#FF6B6B" : "rgba(0,210,255,0.3)"
            }}>
            {hot.includes(i) ? "●" : "·"}
          </div>
        ))}
      </div>
      <div className="flex gap-3 text-[8px]">
        <span style={{ color: "#FF6B6B" }}>● Emergency Zone</span>
        <span style={{ color: "rgba(0,210,255,0.4)" }}>· Normal Zone</span>
        <span className="ml-auto font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>PostGIS QuadTree Index</span>
      </div>
    </div>
  );
}

function WebSocketFeed() {
  const [msgs, setMsgs] = useState([
    { id: 1, text: "Critical O- shortage — UP State", priority: "HIGH" },
    { id: 2, text: "Platelet donation drive — Delhi NCR", priority: "MED" },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (input.trim()) {
      setMsgs(m => [{ id: Date.now(), text: input.trim().slice(0, 60), priority: "NEW" }, ...m.slice(0, 4)]);
      setInput("");
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
        {msgs.map(m => (
          <div key={m.id} className="flex items-center gap-2 px-2 py-1 rounded text-[9px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="font-black shrink-0" style={{ color: m.priority === "HIGH" ? "#FF1E27" : m.priority === "NEW" ? "#F4C430" : "#00D2FF" }}>
              [{m.priority}]
            </span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type sanitized alert (XSS-protected)..."
          className="flex-1 text-[9px] px-2 py-1.5 rounded-lg bg-transparent border text-white placeholder-gray-600 focus:outline-none"
          style={{ borderColor: "rgba(0,210,255,0.2)" }} maxLength={60} />
        <button onClick={send} className="px-3 py-1.5 rounded-lg text-[9px] font-black cursor-pointer"
          style={{ background: "rgba(0,210,255,0.12)", border: "1px solid rgba(0,210,255,0.25)", color: "#00D2FF" }}>
          BROADCAST
        </button>
      </div>
    </div>
  );
}

function VoiceDoctor() {
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState<"hi-IN" | "ta-IN" | "bn-IN" | "en-IN">("hi-IN");
  const SCRIPTS: Record<string, string> = {
    "hi-IN": "नमस्ते। मैं रक्त कवच का AI स्वास्थ्य सहायक हूँ। यदि आप रक्तदान करना चाहते हैं, तो कृपया निकटतम रक्तदान केंद्र पर जाएँ। आपका रक्त किसी की जान बचा सकता है।",
    "ta-IN": "வணக்கம். நான் ரக்த் கவச் AI உதவியாளர். நீங்கள் இரத்த தானம் செய்ய விரும்பினால், அருகிலுள்ள இரத்த தான மையத்தை தொடர்பு கொள்ளுங்கள்.",
    "bn-IN": "নমস্কার। আমি রক্ত কবচ AI স্বাস্থ্য সহায়তাকারী। রক্তদান করতে হলে আপনার কাছের রক্তদান কেন্দ্রে যান।",
    "en-IN": "Hello. I am the Rakt Kavach AI Health Assistant. If you wish to donate blood, please visit the nearest blood donation centre. Your blood can save a life.",
  };
  const speak = () => {
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(SCRIPTS[lang]);
    u.lang = lang; u.rate = 0.88;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis?.speak(u);
    setSpeaking(true);
  };
  const stop = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {(["hi-IN","ta-IN","bn-IN","en-IN"] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className="text-[8px] font-bold px-2 py-1 rounded cursor-pointer"
            style={{ background: lang === l ? "rgba(244,196,48,0.15)" : "rgba(255,255,255,0.04)", color: lang === l ? "#F4C430" : "rgba(255,255,255,0.4)", border: `1px solid ${lang === l ? "rgba(244,196,48,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            {l.split("-")[0].toUpperCase()}
          </button>
        ))}
        <span className="text-[8px] ml-auto" style={{ color: "rgba(255,255,255,0.2)" }}>Bhashini API Suite</span>
      </div>
      <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{SCRIPTS[lang].slice(0, 80)}...</p>
      <button onClick={speaking ? stop : speak}
        className="flex items-center justify-center gap-2 py-2 rounded-xl font-black text-xs cursor-pointer"
        style={{ background: speaking ? "rgba(244,196,48,0.12)" : "rgba(0,210,255,0.1)", border: `1px solid ${speaking ? "rgba(244,196,48,0.3)" : "rgba(0,210,255,0.25)"}`, color: speaking ? "#F4C430" : "#00D2FF" }}>
        {speaking ? <><Volume2 className="w-4 h-4 animate-pulse" /> SPEAKING... (tap to stop)</> : <><Mic className="w-4 h-4" /> SPEAK HEALTH ADVISORY</>}
      </button>
    </div>
  );
}

function FHIRPanel() {
  const entries = [
    { resource: "BloodBank", id: "BB-IN-MH-0042", status: "active", units: 847 },
    { resource: "Observation", id: "OBS-HB-2025-7X", status: "final", units: null },
    { resource: "Patient", id: "ANON-PT-4K9R", status: "active", units: null },
    { resource: "Condition", id: "COND-ANEMIA-88", status: "resolved", units: null },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,210,255,0.12)" }}>
      <div className="px-3 py-1.5 text-[8px] font-bold" style={{ background: "rgba(0,210,255,0.06)", color: "#00D2FF" }}>
        FHIR R4 · GraphQL Endpoint · SNOMED CT Coded
      </div>
      {entries.map((e, i) => (
        <div key={i} className="px-3 py-2 flex items-center gap-2 text-[9px]" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="font-black" style={{ color: "#00D2FF" }}>{e.resource}</span>
          <span className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.id}</span>
          <span className="ml-auto" style={{ color: e.status === "active" ? "#22c55e" : e.status === "final" ? "#00D2FF" : "rgba(255,255,255,0.3)" }}>{e.status}</span>
          {e.units && <span style={{ color: "#FF6B6B" }}>{e.units} units</span>}
        </div>
      ))}
    </div>
  );
}

function KafkaPartitions() {
  const partitions = [
    { id: "P-0", topic: "BLOOD_CRITICAL", lag: 0, msgs: 1240 },
    { id: "P-1", topic: "DONOR_NOTIFY", lag: 2, msgs: 8932 },
    { id: "P-2", topic: "HOSPITAL_SYNC", lag: 0, msgs: 4451 },
    { id: "P-3", topic: "MASS_ALERT", lag: 1, msgs: 320 },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      {partitions.map(p => (
        <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-black text-[8px] font-mono" style={{ color: "#F4C430" }}>{p.id}</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{p.topic}</span>
          <span className="ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{p.msgs.toLocaleString()} msgs</span>
          <span className={p.lag === 0 ? "text-green-500" : "text-orange-400"}>lag:{p.lag}</span>
        </div>
      ))}
    </div>
  );
}

const GROUPS = [
  {
    title: "GROUP A — GOVERNMENT API INTEGRATION",
    color: "#00D2FF",
    modules: [
      { num: 86, title: "e-RaktKosh Live Sync Hub", tech: "Govt e-RaktKosh REST API · Webhooks Gateway · NABH Compliant", icon: <Database className="w-4 h-4" />, color: "#22c55e", status: "prototype" as ModuleStatus, content: <WebhookFeed /> },
      { num: 87, title: "ABHA Health ID Digital Gateway", tech: "ABDM M1/M2/M3 National API Bridges · No local PII cache · Tokenized", icon: <Shield className="w-4 h-4" />, color: "#00D2FF", status: "prototype" as ModuleStatus, content: (<><LiveRow label="M1 — PHR App Registration" value="Compliant ✔" color="#22c55e" /><LiveRow label="M2 — ABHA Profile Share" value="Consent-only ✔" color="#22c55e" /><LiveRow label="M3 — HIP/HIU Linkage" value="API Key Required" color="#f59e0b" /><LiveRow label="Data Residency" value="India (MEITY)" color="#00D2FF" /></>) },
      { num: 88, title: "Secure Identity Verification Gateway", tech: "OAuth2 PKCE · Token Exchange · DigiLocker API Compatible", icon: <GitBranch className="w-4 h-4" />, color: "#a78bfa", status: "prototype" as ModuleStatus, content: <OAuthFlow /> },
      { num: 89, title: "Udyam MSME Compliance Panel", tech: "Ministry of MSME Verifier API · GST Sync · Udyam Registration Verifier", icon: <CheckCircle2 className="w-4 h-4" />, color: "#f59e0b", status: "prototype" as ModuleStatus, content: (<><LiveRow label="Udyam Reg. No. Verification" value="API Key Required" color="#f59e0b" /><LiveRow label="NIC Classification" value="Micro / Small / Medium" color="#00D2FF" /><LiveRow label="GST Compliance Check" value="GSTN API Required" color="#f59e0b" /><LiveRow label="IT Act 2000 Compliance" value="§ 43A — Verified" color="#22c55e" /></>) },
      { num: 90, title: "Open API Webhook Manager", tech: "Kong Plugin Gateway · Symmetric Rate Limiting · JWT Scoped Auth", icon: <Wifi className="w-4 h-4" />, color: "#06b6d4", status: "prototype" as ModuleStatus, content: (<><LiveRow label="Kong Gateway" value="Rate: 1000 req/min" color="#00D2FF" /><LiveRow label="Auth Strategy" value="JWT + API Key" color="#22c55e" /><LiveRow label="Webhook Retry Policy" value="Exp. Backoff 3x" color="#00D2FF" /><LiveRow label="CORS Policy" value="Whitelist-only" color="#22c55e" /></>) },
    ]
  },
  {
    title: "GROUP B — GROUND-LEVEL DATA SYSTEMS",
    color: "#22c55e",
    modules: [
      { num: 91, title: "Village-Level Worker Input App", tech: "React Native · SQLite Offline DB · Background Sync · ASHA Worker Portal", icon: <Users className="w-4 h-4" />, color: "#22c55e", status: "prototype" as ModuleStatus, content: (<><LiveRow label="Offline-First Mode" value="SQLite Local DB ✔" color="#22c55e" /><LiveRow label="Sync Strategy" value="Conflict-free CRDT" color="#00D2FF" /><LiveRow label="Data Entry Fields" value="Blood Group, Age, Consent" color="#00D2FF" /><LiveRow label="Last Sync" value="Today 08:32 AM" color="#22c55e" /></>) },
      { num: 92, title: "Block & District Data Aggregator Grid", tech: "Apache Spark · Distributed Batch Aggregator · Delta Lake Storage", icon: <Layers className="w-4 h-4" />, color: "#6366f1", status: "standby" as ModuleStatus, content: (<><LiveRow label="Spark Cluster" value="3-node (standby)" color="#f59e0b" /><LiveRow label="Batch Frequency" value="Every 6 hours" color="#00D2FF" /><LiveRow label="Districts Covered" value="739 (all India)" color="#22c55e" /><LiveRow label="Data Format" value="Parquet · Delta Lake" color="#00D2FF" /></>) },
      { num: 93, title: "State Authority Resource Allocation Grid", tech: "Knapsack Optimization Algorithm · LP Solver · Constraint-based Routing", icon: <Cpu className="w-4 h-4" />, color: "#f97316", status: "prototype" as ModuleStatus, content: <KnapsackViz /> },
    ]
  },
  {
    title: "GROUP C — NATIONAL & GLOBAL INTEGRATION",
    color: "#a78bfa",
    modules: [
      { num: 94, title: "National Blood Grid Master Integration", tech: "gRPC Protocol Buffers · Ultra Low-Latency Bi-directional Stream · mTLS", icon: <Zap className="w-4 h-4" />, color: "#FF1E27", status: "prototype" as ModuleStatus, content: (<><LiveRow label="Protocol" value="gRPC / HTTP2" color="#00D2FF" /><LiveRow label="Latency Target" value="< 50ms P99" color="#22c55e" /><LiveRow label="Auth" value="mTLS + Service Mesh" color="#22c55e" /><LiveRow label="Stream Type" value="Bi-directional" color="#00D2FF" /><LiveRow label="Nodes Active" value="1,247 hospitals" color="#22c55e" /></>) },
      { num: 95, title: "WHO Global Health Analytics Panel", tech: "GraphQL · FHIR R4 Compliant JSON · SNOMED CT · HL7 Messaging", icon: <Globe className="w-4 h-4" />, color: "#00D2FF", status: "prototype" as ModuleStatus, content: <FHIRPanel /> },
      { num: 96, title: "WHO Emergency Override Location Filter", tech: "PostGIS · Spatial QuadTree Indexing · R-Tree Hierarchy · Geo-fence Engine", icon: <MapPin className="w-4 h-4" />, color: "#ef4444", status: "prototype" as ModuleStatus, content: <SpatialGrid /> },
    ]
  },
  {
    title: "GROUP D — REAL-TIME COMMUNICATION",
    color: "#f59e0b",
    modules: [
      { num: 97, title: "Dynamic Customized Text Alert System", tech: "NestJS WebSocket · Sanitized Input Pipeline · XSS Protected · Rate Limited", icon: <Bell className="w-4 h-4" />, color: "#f59e0b", status: "prototype" as ModuleStatus, content: <WebSocketFeed /> },
      { num: 98, title: "Event-Driven Mass Message Broadcaster", tech: "Apache Kafka Parallel Partitions · FCM Cluster · Delivery Receipt · Dead-Letter Queue", icon: <Radio className="w-4 h-4" />, color: "#ec4899", status: "standby" as ModuleStatus, content: <KafkaPartitions /> },
    ]
  },
  {
    title: "GROUP E — AI & VOICE INTELLIGENCE",
    color: "#F4C430",
    modules: [
      { num: 99, title: "In-App Visual AI Camera Scanner API", tech: "WebRTC MediaDevices API · TensorFlow.js MobileNet · ONNX Runtime · LOINC Coded", icon: <Camera className="w-4 h-4" />, color: "#00D2FF", status: "live" as ModuleStatus, content: (<>
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,210,255,0.05)", border: "1px solid rgba(0,210,255,0.15)" }}>
          <div className="text-xs font-black text-white mb-1">Camera Scanner Active</div>
          <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>WebRTC getUserMedia · TF.js MobileNet v3 · 5 detection classes</div>
          <Link href="/donor" className="mt-2 inline-block text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(0,210,255,0.12)", border: "1px solid rgba(0,210,255,0.3)", color: "#00D2FF" }}>
            Open AI Guardian →
          </Link>
        </div>
        <LiveRow label="Model" value="MobileNetV3 (ONNX)" color="#00D2FF" />
        <LiveRow label="Detection Classes" value="5 (injury/snake/insect/burn/cardiac)" color="#22c55e" />
        <LiveRow label="Disclaimer" value="Informational only · Consult expert" color="#FF1E27" />
      </>) },
      { num: 100, title: "Voice-Guided AI Doctor Module", tech: "Google Cloud TTS · Bhashini API Suite · SSML · 22 Scheduled Languages", icon: <Mic className="w-4 h-4" />, color: "#F4C430", status: "live" as ModuleStatus, content: <VoiceDoctor /> },
    ]
  },
];

export default function AdvancedModulesPage() {
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg,#020613 0%,#030812 100%)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(2,6,19,0.97)", borderBottom: "1px solid rgba(0,210,255,0.12)", backdropFilter: "blur(12px)" }}>
        <Link href="/authority" style={{ color: "rgba(255,255,255,0.5)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <div className="text-xs font-black tracking-widest text-white">ADVANCED MODULES</div>
          <div className="text-[8px] tracking-wider" style={{ color: "rgba(0,210,255,0.5)" }}>86–100 · GOV. AI LIFESAVING TOOLKIT</div>
        </div>
        <div className="flex items-center gap-1 text-[8px] font-bold" style={{ color: "#22c55e" }}>
          <Activity className="w-3 h-3" />15 LIVE
        </div>
      </div>

      {/* Compliance Banner */}
      <div className="px-4 py-2 flex flex-wrap gap-2 items-center"
        style={{ background: "rgba(255,30,39,0.04)", borderBottom: "1px solid rgba(255,30,39,0.08)" }}>
        <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "#f59e0b" }} />
        <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          All modules are <strong className="text-white">UI prototypes</strong>. Production requires Govt API credentials (ABDM, e-RaktKosh, Bhashini). No real citizen data processed. DPDP Act 2023 compliant by design.
        </span>
      </div>

      {/* Group Tabs */}
      <div className="flex overflow-x-auto scrollbar-none px-4 py-2 gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {GROUPS.map((g, i) => (
          <button key={i} onClick={() => setActiveGroup(i)}
            className="shrink-0 text-[8px] font-black px-3 py-1.5 rounded-full cursor-pointer transition-all"
            style={{
              background: activeGroup === i ? `${g.color}18` : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeGroup === i ? g.color + "40" : "rgba(255,255,255,0.08)"}`,
              color: activeGroup === i ? g.color : "rgba(255,255,255,0.4)",
            }}>
            {i + 1}. {g.title.split("—")[0].trim()}
          </button>
        ))}
      </div>

      {/* Group Title */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-[8px] font-black tracking-widest" style={{ color: GROUPS[activeGroup].color + "80" }}>
          {GROUPS[activeGroup].title}
        </div>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto px-4 pb-10 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={activeGroup} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4">
            {GROUPS[activeGroup].modules.map(mod => (
              <ModuleCard key={mod.num} num={mod.num} title={mod.title} tech={mod.tech}
                status={mod.status} icon={mod.icon} color={mod.color}>
                {mod.content}
              </ModuleCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
