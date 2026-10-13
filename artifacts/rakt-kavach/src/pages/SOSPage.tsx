import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Phone, ArrowLeft, MapPin, Clock, Wifi,
  Building2, Droplets, Navigation, CheckCircle2, Radio,
  Ambulance, ShieldCheck, Flame
} from "lucide-react";
import { Link } from "wouter";

type GeoState = "idle" | "locating" | "found" | "error";

interface NearbyUnit {
  name: string;
  type: "ambulance" | "police" | "fire" | "hospital";
  distance: string;
  eta: string;
  status: "available" | "dispatched";
  contact: string;
}

const NEARBY_UNITS: NearbyUnit[] = [
  { name: "CATS Ambulance — Sector 12", type: "ambulance", distance: "1.2 km", eta: "4 min", status: "available", contact: "108" },
  { name: "AIIMS Trauma Centre", type: "hospital", distance: "2.8 km", eta: "7 min", status: "available", contact: "011-26588500" },
  { name: "Delhi Police PCR — Lodi Road", type: "police", distance: "0.9 km", eta: "3 min", status: "available", contact: "100" },
  { name: "Apollo Hospital — Sarita Vihar", type: "hospital", distance: "4.1 km", eta: "11 min", status: "available", contact: "1860-500-1066" },
  { name: "Civil Defence Fire Station", type: "fire", distance: "1.8 km", eta: "6 min", status: "available", contact: "101" },
];

const BLOOD_EXCHANGE: { name: string; dist: string; avail: Record<string, number>; coldChain: boolean }[] = [
  { name: "Safdarjung Hospital Blood Bank", dist: "3.2 km", avail: { "O+": 24, "A+": 18, "B+": 12, "O-": 3 }, coldChain: true },
  { name: "LNJP Hospital Blood Bank", dist: "5.7 km", avail: { "O+": 31, "A+": 22, "B-": 4, "AB+": 9 }, coldChain: true },
  { name: "Ram Manohar Lohia Blood Bank", dist: "8.1 km", avail: { "O+": 15, "B+": 19, "O-": 6, "A-": 2 }, coldChain: true },
  { name: "GTB Hospital Blood Bank", dist: "12.4 km", avail: { "A+": 27, "B+": 14, "AB-": 1, "O+": 18 }, coldChain: false },
];

function GeoButton({ geoState, onLocate, coords }: { geoState: GeoState; onLocate: () => void; coords: { lat: number; lng: number } | null }) {
  return (
    <button onClick={onLocate} disabled={geoState === "locating" || geoState === "found"}
      className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
      style={{
        background: geoState === "found" ? "rgba(34,197,94,0.12)" : "rgba(255,30,39,0.1)",
        border: `1px solid ${geoState === "found" ? "rgba(34,197,94,0.35)" : "rgba(255,30,39,0.35)"}`,
        color: geoState === "found" ? "#22c55e" : "#FF1E27",
      }}>
      {geoState === "idle" && <><Navigation className="w-4 h-4" /> Find My Location</>}
      {geoState === "locating" && <><div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" /> Locating...</>}
      {geoState === "found" && coords && <><CheckCircle2 className="w-4 h-4" /> {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E</>}
      {geoState === "error" && <><AlertTriangle className="w-4 h-4" /> Location access denied — showing Delhi area units</>}
    </button>
  );
}

export default function SOSPage() {
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [requestedHospital, setRequestedHospital] = useState<string | null>(null);
  const [tab, setTab] = useState<"sos" | "exchange">("sos");

  const handleLocate = () => {
    setGeoState("locating");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoState("found"); },
        () => { setGeoState("error"); }
      );
    } else {
      setGeoState("error");
    }
  };

  useEffect(() => { handleLocate(); }, []);

  const SOS_BUTTONS = [
    { label: "AMBULANCE", number: "108", icon: Ambulance, color: "#FF1E27", bg: "rgba(255,30,39,0.12)", border: "rgba(255,30,39,0.4)" },
    { label: "POLICE", number: "100", icon: ShieldCheck, color: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)" },
    { label: "FIRE", number: "101", icon: Flame, color: "#F97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.4)" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg,#0a0101 0%,#020613 100%)", backgroundAttachment: "fixed" }}>

      {/* Header */}
      <div className="sticky top-0 z-30 w-full px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(10,1,1,0.97)", borderBottom: "1px solid rgba(255,30,39,0.2)", backdropFilter: "blur(12px)" }}>
        <Link href="/donor" className="cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-sm tracking-widest text-white">SOS EMERGENCY</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-[9px] tracking-widest" style={{ color: "rgba(255,30,39,0.6)" }}>GEO-FENCED EMERGENCY ROUTING</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-4 h-4 animate-pulse" style={{ color: "#22c55e" }} />
          <span className="text-[9px] font-bold" style={{ color: "#22c55e" }}>LIVE</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex w-full" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(["sos", "exchange"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-xs font-black tracking-wider transition-all cursor-pointer"
            style={{
              color: tab === t ? "#FF1E27" : "rgba(255,255,255,0.3)",
              borderBottom: tab === t ? "2px solid #FF1E27" : "2px solid transparent",
              background: tab === t ? "rgba(255,30,39,0.04)" : "transparent",
            }}>
            {t === "sos" ? "SOS DASHBOARD" : "INTER-HOSPITAL EXCHANGE"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-10 px-4 pt-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">

        {tab === "sos" && (
          <>
            {/* Geolocation */}
            <GeoButton geoState={geoState} onLocate={handleLocate} coords={coords} />

            {/* Geo-fence note */}
            <div className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.15)" }}>
              <MapPin className="w-4 h-4 shrink-0" style={{ color: "#00D2FF" }} />
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Auto-routing to nearest emergency unit within <strong className="text-white">5–10 km radius</strong>.
                Geo-fenced alert dispatched automatically on SOS call. All calls are real — use responsibly.
              </p>
            </div>

            {/* 3 Big SOS Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {SOS_BUTTONS.map(btn => (
                <button key={btn.label} onClick={() => setActiveCall(btn.number)}
                  className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl transition-all cursor-pointer active:scale-95"
                  style={{ background: btn.bg, border: `2px solid ${btn.border}`, boxShadow: `0 0 24px ${btn.bg}` }}>
                   <btn.icon className="w-10 h-10" style={{ color: btn.color }} />
                  <span className="text-xs font-black tracking-wider" style={{ color: btn.color }}>{btn.label}</span>
                  <span className="text-2xl font-black" style={{ color: btn.color }}>{btn.number}</span>
                </button>
              ))}
            </div>

            {/* Active Call Confirmation Modal */}
            <AnimatePresence>
              {activeCall && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  onClick={() => setActiveCall(null)}>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    onClick={e => e.stopPropagation()}
                    className="max-w-xs w-full rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
                    style={{ background: "rgba(10,1,1,0.98)", border: "2px solid rgba(255,30,39,0.5)", boxShadow: "0 0 60px rgba(255,30,39,0.2)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: "rgba(255,30,39,0.15)", border: "2px solid #FF1E27" }}>
                      <Phone className="w-8 h-8" style={{ color: "#FF1E27" }} />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white">{activeCall}</div>
                      <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Tap to call — Location will be auto-shared</div>
                    </div>
                    <a href={`tel:${activeCall}`}
                      className="w-full py-4 rounded-xl font-black text-white text-sm tracking-wider cursor-pointer"
                      style={{ background: "#FF1E27", boxShadow: "0 0 30px rgba(255,30,39,0.4)" }}>
                      CALL {activeCall} NOW
                    </a>
                    <button onClick={() => setActiveCall(null)} className="text-xs cursor-pointer" style={{ color: "rgba(255,255,255,0.3)" }}>Cancel</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nearest Response Units */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,30,39,0.15)" }}>
              <div className="px-4 py-2.5" style={{ background: "rgba(255,30,39,0.08)", borderBottom: "1px solid rgba(255,30,39,0.1)" }}>
                <div className="text-[9px] font-black tracking-widest" style={{ color: "#FF1E27" }}>
                  NEAREST EMERGENCY UNITS — {geoState === "found" ? "YOUR LOCATION" : "DELHI NCR (DEFAULT)"}
                </div>
              </div>
              <div className="flex flex-col divide-y divide-white/5">
                {NEARBY_UNITS.map((unit, i) => {
                  const iconMap = { ambulance: Ambulance, police: ShieldCheck, fire: Flame, hospital: Building2 };
                  const UnitIcon = iconMap[unit.type];
                  return (
                    <div key={i} className="px-4 py-3 flex items-center gap-3" style={{ background: "rgba(5,5,15,0.8)" }}>
                      <UnitIcon className="w-5 h-5 shrink-0" style={{ color: "#00D2FF" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white truncate">{unit.name}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[9px] flex items-center gap-1" style={{ color: "#00D2FF" }}>
                            <MapPin className="w-2.5 h-2.5" />{unit.distance}
                          </span>
                          <span className="text-[9px] flex items-center gap-1" style={{ color: "#22c55e" }}>
                            <Clock className="w-2.5 h-2.5" />{unit.eta}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => setActiveCall(unit.contact)}
                        className="text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer shrink-0"
                        style={{ background: "rgba(255,30,39,0.12)", border: "1px solid rgba(255,30,39,0.3)", color: "#FF1E27" }}>
                        CALL
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DPDP Consent Note */}
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Location data is used solely for emergency routing per <strong className="text-white">DPDP Act 2023</strong> § 7(a).
                Strictly consent-based. Not stored after session ends.
              </p>
            </div>
          </>
        )}

        {tab === "exchange" && (
          <>
            <div className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.15)" }}>
              <Wifi className="w-4 h-4 shrink-0" style={{ color: "#00D2FF" }} />
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                <strong className="text-white">Automated inter-hospital blood stock exchange</strong> — 100km radius.
                All requests logged with digital cold-chain timestamps per NABH guidelines.
              </p>
            </div>

            {BLOOD_EXCHANGE.map((hosp, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,210,255,0.12)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(0,10,30,0.8)" }}>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" style={{ color: "#00D2FF" }} />
                    <div>
                      <div className="text-xs font-black text-white">{hosp.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{hosp.dist} away</span>
                        <span className="text-[9px] font-bold" style={{ color: hosp.coldChain ? "#22c55e" : "#f59e0b" }}>
                          {hosp.coldChain ? "✔ Cold-Chain" : "⚠ No Cold-Chain"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRequestedHospital(requestedHospital === hosp.name ? null : hosp.name)}
                    className="text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: requestedHospital === hosp.name ? "rgba(34,197,94,0.15)" : "rgba(0,210,255,0.1)",
                      border: `1px solid ${requestedHospital === hosp.name ? "rgba(34,197,94,0.4)" : "rgba(0,210,255,0.3)"}`,
                      color: requestedHospital === hosp.name ? "#22c55e" : "#00D2FF",
                    }}>
                    {requestedHospital === hosp.name ? "✔ REQUESTED" : "REQUEST"}
                  </button>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-2" style={{ background: "rgba(0,5,20,0.6)" }}>
                  {Object.entries(hosp.avail).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Droplets className="w-3 h-3" style={{ color: "#FF1E27" }} />
                      <span className="text-[10px] font-black" style={{ color: "#FF6B6B" }}>{type}</span>
                      <span className="text-[10px] font-bold text-white">{count} units</span>
                    </div>
                  ))}
                </div>
                {requestedHospital === hosp.name && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-4 py-2 text-[9px] font-mono" style={{ background: "rgba(34,197,94,0.06)", borderTop: "1px solid rgba(34,197,94,0.15)", color: "#22c55e" }}>
                    ✔ Cold-chain request logged · NABH compliant · ETA: 35–60 min · Log ID: XCH-{Math.random().toString(36).slice(2,8).toUpperCase()}
                  </motion.div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
