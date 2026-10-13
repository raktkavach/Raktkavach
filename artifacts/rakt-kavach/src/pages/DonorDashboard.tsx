import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, Droplet, Bell, User, ArrowLeftRight, Clock,
  Gift, ShieldCheck, Fingerprint, X, Menu, Shield, TriangleAlert,
  ShieldAlert, Siren, Award, Trophy, ChevronRight, Wifi
} from "lucide-react";
import { Link } from "wouter";
import AIGuardian from "@/components/AIGuardian";

export default function DonorDashboard() {
  const { t } = useLanguage();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [transferCredits, setTransferCredits] = useState("1.00");
  const [showAIGuardian, setShowAIGuardian] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg, #020613 0%, #071126 100%)", backgroundAttachment: "fixed" }}>

      {/* Share Credit Modal */}
      <AnimatePresence>
        {showCreditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-sm w-full cyber-card p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,210,255,0.1)", border: "1px solid rgba(0,210,255,0.2)" }}>
                    <Droplet className="w-4 h-4" style={{ color: "#00D2FF" }} />
                  </div>
                  <h3 className="text-sm font-bold text-white">{t("shareCreditTitle")}</h3>
                </div>
                <button data-testid="button-close-credit-modal" onClick={() => setShowCreditModal(false)} className="text-slate-500 hover:text-white transition-colors cursor-pointer ml-2 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{t("shareCreditBody")}</p>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: "rgba(0,210,255,0.05)", border: "1px solid rgba(0,210,255,0.15)" }}>
                <div className="text-2xl font-black text-white">1</div>
                <div>
                  <div className="text-xs font-semibold text-white">{t("bloodCredits")}</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>RKTK-7X9P-2D4F · ABHA Verified</div>
                </div>
              </div>
              <button data-testid="button-credit-modal-close" onClick={() => setShowCreditModal(false)}
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wider uppercase cursor-pointer btn-red-solid hover:opacity-90 transition-opacity">
                {t("shareCreditClose")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Guardian Overlay */}
      <AnimatePresence>
        {showAIGuardian && <AIGuardian onClose={() => setShowAIGuardian(false)} />}
      </AnimatePresence>

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 w-full px-4 py-3 flex items-center justify-between" style={{ background: "rgba(2,6,19,0.95)", borderBottom: "1px solid rgba(0,210,255,0.1)", backdropFilter: "blur(12px)" }}>
        <button className="cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: "#FF1E27" }} />
            <Droplet className="w-2.5 h-2.5 -ml-2.5 mt-0.5 fill-white text-white" />
            <span className="text-white font-bold text-xs tracking-widest ml-1">RAKT KAVACH</span>
          </div>
          <span className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>One Nation • One Blood Grid</span>
        </div>
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center" style={{ background: "#FF1E27" }}>3</span>
        </div>
      </div>

      {/* News Ticker */}
      <div className="w-full overflow-hidden shrink-0" style={{ background: "rgba(255,30,39,0.08)", borderBottom: "1px solid rgba(255,30,39,0.18)", height: "26px" }}>
        <div className="h-full flex items-center gap-2 px-3">
          <span className="text-[9px] font-black tracking-widest shrink-0 px-2 py-0.5 rounded" style={{ background: "#FF1E27", color: "#fff" }}>MYBVP 1.0</span>
          <div className="flex-1 overflow-hidden h-full flex items-center">
            <div className="news-ticker-inner whitespace-nowrap text-[10px] font-bold" style={{ color: "rgba(255,200,200,0.85)" }}>
              🔴 MYBVP 1.0: Upcoming Features: Insurance-Linked Blood Credits &amp; Family Protection Tools &nbsp;•&nbsp; रक्त कवच — One Nation, One Blood Grid &nbsp;•&nbsp; ABHA-Linked Donor Wallet Now Active &nbsp;•&nbsp; Emergency Response Time: National Average 4:32 Min &nbsp;&nbsp;&nbsp;&nbsp;🔴 MYBVP 1.0: Upcoming Features: Insurance-Linked Blood Credits &amp; Family Protection Tools &nbsp;•&nbsp; रक्त कवच — One Nation, One Blood Grid &nbsp;•&nbsp; ABHA-Linked Donor Wallet Now Active &nbsp;•&nbsp; Emergency Response Time: National Average 4:32 Min
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 overflow-y-auto pb-24 px-4 pt-4 flex flex-col gap-4 max-w-sm mx-auto w-full"
      >
        {/* e-RaktKosh / ABDM Compliance Banner */}
        <div className="rounded-xl px-3 py-2.5 flex flex-wrap items-center gap-2"
          style={{ background: "rgba(0,210,255,0.04)", border: "1px solid rgba(0,210,255,0.12)" }}>
          <Wifi className="w-3 h-3 shrink-0" style={{ color: "#22c55e" }} />
          {[
            { label: "e-RaktKosh", status: "SYNCED", color: "#22c55e" },
            { label: "ABDM", status: "CONNECTED", color: "#22c55e" },
            { label: "LOINC", status: "ACTIVE", color: "#00D2FF" },
            { label: "DPDP 2023", status: "COMPLIANT", color: "#00D2FF" },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-1 text-[8px] font-bold tracking-wider">
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{b.label}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30` }}>● {b.status}</span>
            </div>
          ))}
        </div>

        {/* Page Title */}
        <div className="text-center pt-1 pb-2">
          <h1 className="text-xl font-black text-white tracking-wide">
            DIGITAL <span style={{ color: "#FF1E27" }}>BLOOD</span> WALLET
          </h1>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Secure • Transparent • Lifesaving</p>
        </div>

        {/* Digital Donor Card */}
        <div className="cyber-card p-4 relative overflow-hidden" style={{ borderLeft: "3px solid #FF1E27" }}>
          <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "#00D2FF" }}>DIGITAL DONOR CARD</div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-lg font-black text-white tracking-wide">NAVDEEP KUMAR</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>DONOR ID: RKTK-7X9P-2D4F</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>BLOOD GROUP: <span className="font-bold text-white">O+</span></div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>CITY: LUCKNOW, INDIA</div>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3 h-3" style={{ color: "#22c55e" }} />
                <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>VERIFIED DONOR</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-[76px] h-[76px] rounded-lg p-1.5 relative"
                style={{ background: "#060d1e", border: "2px solid #FF1E27", boxShadow: "0 0 12px rgba(255,30,39,0.5), 0 0 24px rgba(255,30,39,0.2)" }}>
                <div className="grid gap-[2px] h-full" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
                  {Array.from({ length: 49 }).map((_, i) => {
                    const pattern = [1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,1,1,1,1,0,1,0,0,0,1,1,1,1,0,0,0,1];
                    return (
                      <div key={i} className="rounded-[1px]"
                        style={{ background: pattern[i % pattern.length] ? "#FF1E27" : "transparent" }} />
                    );
                  })}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#060d1e", border: "1px solid #FF1E27" }}>
                    <Droplet className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                  </div>
                </div>
              </div>
              <div className="text-[7px] font-bold tracking-tight text-center" style={{ color: "#FF1E27" }}>SMART QR • SECURE<br />• VERIFIED</div>
            </div>
          </div>
        </div>

        {/* Blood Credit Balance */}
        <div className="cyber-card p-4 relative overflow-hidden">
          <div className="text-[9px] font-bold tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>YOUR BLOOD CREDIT BALANCE</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Droplet className="w-10 h-10" style={{ color: "#FF1E27", fill: "#FF1E27", filter: "drop-shadow(0 0 8px #FF1E27)" }} />
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(255,30,39,0.2)", animationDuration: "2s" }} />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-white" style={{ lineHeight: 1 }}>1.00</span>
                  <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>CREDITS</span>
                </div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>1 CREDIT = 1 UNIT OF BLOOD</div>
              </div>
            </div>
            {/* ECG line */}
            <div className="flex items-center">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                <path d="M0 20 L12 20 L18 20 L22 6 L28 34 L34 20 L40 20 L46 20 L50 10 L56 30 L62 20 L80 20"
                  stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M0 20 L12 20 L18 20 L22 6 L28 34 L34 20 L40 20 L46 20 L50 10 L56 30 L62 20 L80 20"
                  stroke="#00D2FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0.15 }} />
              </svg>
            </div>
          </div>

          {/* info button */}
          <button data-testid="button-credit-info" onClick={() => setShowCreditModal(true)}
            className="absolute top-3 right-3 cursor-pointer transition-colors hover:opacity-80"
            style={{ color: "rgba(0,210,255,0.5)" }}>
            <TriangleAlert className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Raktveer Loyalty Rank */}
        <div className="cyber-card p-4" style={{ borderLeft: "3px solid #F4C430" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[9px] font-bold tracking-widest" style={{ color: "#F4C430" }}>RAKTVEER RANK — रक्तवीर</div>
            <Trophy className="w-4 h-4" style={{ color: "#F4C430" }} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(205,127,50,0.15)", border: "2px solid rgba(205,127,50,0.5)", boxShadow: "0 0 16px rgba(205,127,50,0.2)" }}>
              <Award className="w-7 h-7" style={{ color: "#CD7F32" }} />
            </div>
            <div className="flex-1">
              <div className="font-black text-white tracking-wide">BRONZE TIER</div>
              <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>1 verified donation · 2 more for Silver</div>
              <div className="mt-2 relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{ width: "33%", background: "linear-gradient(90deg, #CD7F32, #F4C430)" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px]" style={{ color: "#CD7F32" }}>🥉 Bronze</span>
                <span className="text-[8px]" style={{ color: "rgba(192,192,192,0.6)" }}>🥈 Silver (3)</span>
                <span className="text-[8px]" style={{ color: "rgba(244,196,48,0.5)" }}>🥇 Gold (10)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-lg p-2.5" style={{ background: "rgba(205,127,50,0.06)", border: "1px solid rgba(205,127,50,0.2)" }}>
            <div className="text-[9px] font-bold" style={{ color: "#CD7F32" }}>💓 IMPACT: Your O+ donation (AIIMS Delhi) — Blood used in 2025 · Patient outcome: Positive</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Clock className="w-5 h-5" />, label: "History", color: "#FF1E27", bg: "rgba(255,30,39,0.15)", border: "rgba(255,30,39,0.6)" },
            { icon: <Droplet className="w-5 h-5" />, label: "Requests", color: "rgba(0,210,255,0.8)", bg: "rgba(5,15,35,0.8)", border: "rgba(0,210,255,0.3)" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Certs", color: "rgba(0,210,255,0.8)", bg: "rgba(5,15,35,0.8)", border: "rgba(0,210,255,0.3)" },
            { icon: <Gift className="w-5 h-5" />, label: "Rewards", color: "rgba(0,210,255,0.8)", bg: "rgba(5,15,35,0.8)", border: "rgba(0,210,255,0.3)" },
          ].map((item, i) => (
            <button key={i} data-testid={`button-action-${item.label.toLowerCase()}`}
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {}}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{ background: item.bg, border: `1.5px solid ${item.border}`, color: item.color }}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-white">{item.label}</span>
            </button>
          ))}
          {/* SOS Button */}
          <Link href="/sos" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 animate-pulse"
              style={{ background: "rgba(255,30,39,0.18)", border: "1.5px solid rgba(255,30,39,0.7)", color: "#FF1E27", boxShadow: "0 0 12px rgba(255,30,39,0.25)" }}>
              <Siren className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black" style={{ color: "#FF1E27" }}>SOS</span>
          </Link>
          {/* AI Guardian Button */}
          <button onClick={() => setShowAIGuardian(true)}
            className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{ background: "rgba(0,210,255,0.12)", border: "1.5px solid rgba(0,210,255,0.4)", color: "#00D2FF", boxShadow: "0 0 10px rgba(0,210,255,0.15)" }}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black" style={{ color: "#00D2FF" }}>AI Guard</span>
          </button>
        </div>

        {/* Transfer Blood Credit */}
        <div className="cyber-card p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">TRANSFER BLOOD CREDIT</h3>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Secure • Instant • Anywhere in India</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>FROM</span>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: "rgba(5,15,35,0.9)", border: "1px solid rgba(0,210,255,0.2)" }}>
                <User className="w-4 h-4 shrink-0" style={{ color: "rgba(0,210,255,0.6)" }} />
                <div>
                  <div className="text-[11px] font-semibold text-white">My Wallet</div>
                  <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>1.00 Credits</div>
                </div>
              </div>
            </div>
            <div className="flex items-end pb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center mt-4" style={{ background: "rgba(0,210,255,0.1)", border: "1px solid rgba(0,210,255,0.3)" }}>
                <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: "#00D2FF" }} />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>TO</span>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: "rgba(5,15,35,0.9)", border: "1px solid rgba(0,210,255,0.2)" }}>
                <User className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Select Recipient</div>
                  <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Enter Donor ID</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>ENTER CREDITS TO TRANSFER</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-lg px-3 py-2.5" style={{ background: "rgba(5,15,35,0.9)", border: "1px solid rgba(0,210,255,0.2)" }}>
                <input
                  data-testid="input-transfer-credits"
                  type="text"
                  value={transferCredits}
                  onChange={(e) => setTransferCredits(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm font-bold focus:outline-none w-full"
                  placeholder="0.00"
                />
                <span className="text-[10px] font-bold ml-2 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>CREDITS</span>
              </div>
              <button data-testid="button-transfer-now"
                className="btn-red-solid text-white font-black text-[10px] tracking-wide px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap"
                style={{ boxShadow: "0 0 16px rgba(255,30,39,0.4)" }}>
                TRANSFER NOW →
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Blood Request */}
        <div className="cyber-card p-4 flex items-center justify-between gap-3" style={{ borderLeft: "3px solid #FF1E27" }}>
          <div>
            <h3 className="text-sm font-black text-white">EMERGENCY BLOOD REQUEST</h3>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Need Blood Urgently?</p>
          </div>
          <Link href="/sos"
            className="btn-red-solid text-white font-black text-[10px] tracking-wide px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
            style={{ boxShadow: "0 0 20px rgba(255,30,39,0.5)" }}>
            SOS / HELP
            <TriangleAlert className="w-3.5 h-3.5 animate-pulse" />
          </Link>
        </div>

        {/* Donor-Patient Impact Ledger */}
        <div className="cyber-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-widest" style={{ color: "#00D2FF" }}>DONOR–PATIENT IMPACT LEDGER</div>
              <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Anonymized · DPDP Act 2023 Compliant</div>
            </div>
            <div className="text-[8px] px-2 py-1 rounded font-bold" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>3 LIVES IMPACTED</div>
          </div>
          {[
            { date: "Jun 2025", bloodType: "O+", hospital: "AIIMS Delhi", ward: "Trauma Ward", outcome: "Positive — Patient Discharged", vol: "450ml", caseId: "ANON-4X7K" },
            { date: "Jan 2025", bloodType: "O+", hospital: "Safdarjung Hospital", ward: "Surgical ICU", outcome: "Positive — Surgery Successful", vol: "450ml", caseId: "ANON-9R2M" },
            { date: "Aug 2024", bloodType: "O+", hospital: "RML Hospital Delhi", ward: "Maternity Ward", outcome: "Positive — Mother & Child Safe", vol: "450ml", caseId: "ANON-3J8W" },
          ].map((entry, i) => (
            <div key={i} className="rounded-xl p-3 flex flex-col gap-1.5"
              style={{ background: "rgba(0,210,255,0.03)", border: "1px solid rgba(0,210,255,0.1)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "rgba(255,30,39,0.15)", border: "1px solid rgba(255,30,39,0.3)" }}>🩸</div>
                  <span className="text-[10px] font-black" style={{ color: "#FF6B6B" }}>{entry.bloodType}</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{entry.vol}</span>
                </div>
                <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{entry.caseId}</span>
              </div>
              <div className="text-[10px] font-bold text-white">{entry.hospital} <span className="font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>· {entry.ward}</span></div>
              <div className="flex items-center justify-between">
                <div className="text-[9px] font-bold" style={{ color: "#22c55e" }}>✔ {entry.outcome}</div>
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{entry.date}</div>
              </div>
            </div>
          ))}
          <div className="text-[8px] text-center pt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
            Patient identity fully anonymized. Case IDs are non-reversible. Data per DPDP Act 2023 § 8(7).
          </div>
        </div>

        {/* Biometric Section */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full animate-ping" style={{ background: "rgba(0,210,255,0.08)", animationDuration: "2s" }} />
            <div className="absolute w-20 h-20 rounded-full" style={{ background: "rgba(0,210,255,0.12)", border: "1px solid rgba(0,210,255,0.25)" }} />
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(2,10,30,0.9)", border: "2px solid rgba(0,210,255,0.5)", boxShadow: "0 0 20px rgba(0,210,255,0.3), inset 0 0 15px rgba(0,210,255,0.1)" }}>
              <Fingerprint className="w-8 h-8" style={{ color: "#00D2FF", filter: "drop-shadow(0 0 6px #00D2FF)" }} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-black text-white tracking-widest uppercase">LOGIN WITH BIOMETRIC</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Secure Access</div>
          </div>
        </div>

        {/* Back link */}
        <div className="flex justify-center pb-2">
          <Link href="/" className="text-[10px] tracking-wider cursor-pointer transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>
            ← {t("back")} to Gateway
          </Link>
        </div>
      </motion.div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30" style={{ background: "rgba(2,6,19,0.97)", borderTop: "1px solid rgba(0,210,255,0.12)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-end justify-around px-2 pb-safe pt-2 max-w-sm mx-auto">
          {[
            { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
            { id: "network", icon: <Users className="w-5 h-5" />, label: "Network" },
          ].map(tab => (
            <button key={tab.id} data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 cursor-pointer transition-all"
              style={{ color: activeTab === tab.id ? "#FF1E27" : "rgba(255,255,255,0.35)" }}>
              {tab.icon}
              <span className="text-[9px] font-bold tracking-wider">{tab.label}</span>
            </button>
          ))}

          {/* Center Donate tab */}
          <button data-testid="tab-donate"
            onClick={() => setActiveTab("donate")}
            className="flex flex-col items-center gap-1 cursor-pointer -mt-4 transition-all">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FF1E27, #CC0008)", boxShadow: "0 0 20px rgba(255,30,39,0.6), 0 4px 16px rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.1)" }}>
              <Droplet className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="text-[9px] font-bold tracking-wider" style={{ color: activeTab === "donate" ? "#FF1E27" : "rgba(255,255,255,0.35)" }}>Donate</span>
          </button>

          {[
            { id: "alerts", icon: <Bell className="w-5 h-5" />, label: "Alerts" },
            { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
          ].map(tab => (
            <button key={tab.id} data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 cursor-pointer transition-all"
              style={{ color: activeTab === tab.id ? "#FF1E27" : "rgba(255,255,255,0.35)" }}>
              {tab.icon}
              <span className="text-[9px] font-bold tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
