import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { 
  Shield, Droplet, TriangleAlert, Menu, Globe, ChevronRight, ArrowLeft, 
  ShieldCheck, Lock, Network, Bell, Crown
} from "lucide-react";
import { useLocation } from "wouter";

type Step = "gateway" | "roles" | "abha-verify";

export default function GatewayPage() {
  const { language, setLanguage, t } = useLanguage();
  const [showModal, setShowModal] = useState(true);
  const [action, setAction] = useState<"login" | "register" | null>(null);
  const [step, setStep] = useState<Step>("gateway");
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [, setLocation] = useLocation();

  const handleRoleSelect = (rolePath: string) => {
    if (rolePath === "/donor") {
      setStep("abha-verify");
    } else {
      setLocation(rolePath);
    }
  };

  const handleSendOtp = () => {
    if (abhaId.replace(/-/g, "").length >= 14) {
      setOtpSent(true);
    }
  };

  const handleVerify = () => {
    if (otp.length >= 4) {
      setVerifying(true);
      setTimeout(() => {
        setLocation("/donor");
      }, 1800);
    }
  };

  const formatAbhaId = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 14);
    const parts = [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6, 10), digits.slice(10, 14)];
    return parts.filter(Boolean).join("-");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center p-4 relative overflow-hidden">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-sm w-full"
            >
              <GlassCard className="border-amber-500/30">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <TriangleAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{t("noticeTitle")}</h2>
                  <p className="text-sm text-slate-300 text-left leading-relaxed">{t("noticeBody")}</p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase hover:from-blue-500 hover:to-indigo-500 transition-colors cursor-pointer"
                  >
                    {t("noticeUnderstand")}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm flex items-center justify-between pt-2 pb-4">
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-red-500" />
            <Droplet className="w-3 h-3 text-white -ml-3 mt-1 fill-white" />
            <span className="text-white font-bold text-sm tracking-wide">RAKT KAVACH</span>
          </div>
          <span className="text-slate-400 text-[10px]">One Nation • One Blood Grid</span>
        </div>
        <button 
          onClick={() => {
            const langs = ['en', 'hi', 'ta', 'bn', 'gu'] as const;
            const idx = langs.indexOf(language as typeof langs[number]);
            setLanguage(langs[(idx + 1) % langs.length]);
          }}
          className="flex items-center gap-1.5 border border-white/20 rounded-full px-2 py-1 text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">
            {{ en: 'EN', hi: 'HI', ta: 'TA', bn: 'BN', gu: 'GU' }[language] ?? 'EN'}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === "abha-verify" ? (
          <motion.div
            key="abha-verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm flex flex-col gap-5 relative z-10 py-4 flex-1"
          >
            <button
              onClick={() => { setStep("roles"); setOtpSent(false); setOtp(""); setAbhaId(""); setVerifying(false); }}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors w-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF] shrink-0 border border-[#00D2FF]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t("abhaVerifyTitle")}</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{t("abhaVerifySubtext")}</p>
              </div>
            </div>

            <GlassCard className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t("abhaIdLabel")}</label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(formatAbhaId(e.target.value))}
                  placeholder={t("abhaIdPlaceholder")}
                  className="w-full bg-[#050f23] border border-[#00D2FF]/30 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00D2FF] transition-all font-mono tracking-widest"
                  maxLength={19}
                  disabled={otpSent}
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={abhaId.replace(/-/g, "").length < 14}
                  className="w-full py-3 rounded-lg btn-red-solid text-white font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t("sendOtp")}
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t("otpSentTo")} ···· 7823
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t("otpLabel")}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder={t("otpPlaceholder")}
                        className="w-full bg-[#050f23] border border-emerald-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono tracking-[0.5em] text-center"
                        maxLength={6}
                      />
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otp.length < 4 || verifying}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t("verifying")}
                        </>
                      ) : t("verifyBtn")}
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </GlassCard>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium mt-auto">
              <Lock className="w-3 h-3 text-[#00D2FF]" />
              {t("abhaSecureNote")}
            </div>
          </motion.div>
        ) : step === "roles" ? (
          <motion.div
            key="roles"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm flex flex-col gap-4 relative z-10 py-4 flex-1"
          >
            <button
              onClick={() => setStep("gateway")}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors w-fit cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </button>

            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {action === "login" ? t("loginTitle") : t("registerTitle")}
              </h2>
              <p className="text-[#00D2FF] text-xs mt-1">Select your access node</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <RoleCard title={t("roleDonor")} desc={t("roleDonorDesc")} onClick={() => handleRoleSelect("/donor")} />
              <RoleCard title={t("roleHospital")} desc={t("roleHospitalDesc")} onClick={() => handleRoleSelect("/hospital")} />
              <RoleCard title={t("roleLab")} desc={t("roleLabDesc")} onClick={() => handleRoleSelect("/lab")} />
              <RoleCard title={t("roleAuthority")} desc={t("roleAuthorityDesc")} onClick={() => handleRoleSelect("/authority")} />
              <FounderRoleCard onClick={() => handleRoleSelect("/founder")} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gateway"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-sm flex flex-col flex-1 relative z-10"
          >
            <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] relative w-full my-4">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[180px] h-[180px] rounded-full border border-[#00D2FF]/20 animate-pulse-ring absolute"></div>
                <div className="w-[240px] h-[240px] rounded-full border border-[#00D2FF]/10 animate-pulse-ring absolute" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="relative w-[220px] h-[250px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D2FF]/20 to-[#FF1E27]/20 blur-xl rounded-full"></div>
                <div 
                  className="relative z-10 w-[180px] h-[210px] cyber-card overflow-hidden flex items-center justify-center"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)",
                    background: "linear-gradient(135deg, rgba(0,210,255,0.1) 0%, rgba(5,15,35,0.9) 50%, rgba(255,30,39,0.1) 100%)",
                    border: "none"
                  }}
                >
                  <div className="absolute inset-0" style={{ 
                    boxShadow: "inset 0 0 20px rgba(0,210,255,0.5), inset 0 0 40px rgba(255,30,39,0.5)" 
                  }}></div>
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#00D2FF]/20 to-transparent"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#FF1E27]/20 to-transparent"></div>
                  
                  <div className="relative flex flex-col items-center justify-center h-full w-full">
                    <Droplet className="w-16 h-16 text-[#FF1E27] fill-[#FF1E27] logo-glow absolute" />
                    <svg className="w-24 h-24 absolute text-white z-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 0 50 L 25 50 L 35 20 L 50 80 L 65 50 L 100 50" className="animate-heartbeat" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 text-[#00D2FF] text-[10px] font-bold tracking-widest flex items-center gap-1">
                  DONOR <div className="w-8 h-[1px] border-b border-dashed border-[#00D2FF]/50"></div>
                </div>
                <div className="absolute -top-4 -right-4 text-[#00D2FF] text-[10px] font-bold tracking-widest flex items-center gap-1">
                  <div className="w-8 h-[1px] border-b border-dashed border-[#00D2FF]/50"></div> HOSPITAL
                </div>
                <div className="absolute -bottom-4 -left-4 text-[#00D2FF] text-[10px] font-bold tracking-widest flex items-center gap-1">
                  LAB <div className="w-8 h-[1px] border-b border-dashed border-[#00D2FF]/50"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-[#00D2FF] text-[10px] font-bold tracking-widest flex items-center gap-1">
                  <div className="w-8 h-[1px] border-b border-dashed border-[#00D2FF]/50"></div> CLINIC
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-[#00D2FF]/20 animate-pulse absolute -bottom-4 blur-md"></div>
            </div>

            <div className="text-center mt-2 mb-6">
              <h1 className="text-4xl font-black tracking-tight mb-2">
                <span className="text-[#FF1E27]">RAKT</span> <span className="text-white">KAVACH</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                NATIONAL BLOOD & HEALTH NETWORK
              </p>
              <div className="mt-4">
                <p className="text-[#FF1E27] font-bold text-sm mb-1">रक्तदान • जीवनदान • राष्ट्रदान</p>
                <p className="text-slate-400 text-xs">Donate Blood • Save Lives • Strengthen Nation</p>
              </div>
            </div>

            <div className="cyber-card p-4 mb-6 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">स्वागत है</h3>
                  <p className="text-slate-400 text-[10px]">आपका एक कदम, किसी की जिंदगी</p>
                </div>
                <div className="text-right border-l border-white/10 pl-4">
                  <h3 className="text-lg font-bold text-white mb-1">WELCOME</h3>
                  <p className="text-slate-400 text-[10px]">Your one step, Someone's life</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-slate-500 text-[10px]">
                <span>स्वागतम्</span> <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span>मुआगउ है</span> <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span>झागठम</span>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              </div>
              <div className="absolute right-2 bottom-2 opacity-20">
                <svg className="w-16 h-8 text-[#FF1E27]" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M 0 20 L 20 20 L 30 5 L 45 35 L 60 20 L 100 20" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full mb-8">
              <button
                onClick={() => { setAction("register"); setStep("roles"); }}
                className="w-full h-[52px] rounded-lg btn-red-solid text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_20px_rgba(255,30,39,0.3)]"
              >
                GET STARTED <ChevronRight className="w-5 h-5 ml-1" />
              </button>
              <button
                onClick={() => { setAction("login"); setStep("roles"); }}
                className="w-full h-[52px] rounded-lg btn-dark-border text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
              >
                SIGN IN <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>

            <div className="mt-auto grid grid-cols-4 gap-2 mb-6">
              <TrustBadge icon={<Shield className="w-4 h-4" />} label="SECURE" />
              <TrustBadge icon={<Lock className="w-4 h-4" />} label="PRIVATE" />
              <TrustBadge icon={<Network className="w-4 h-4" />} label="VERIFIED" />
              <TrustBadge icon={<Bell className="w-4 h-4" />} label="ALERTS" />
            </div>

            <div className="text-center pb-4 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Powered by SMART STAR SOLUTIONS</div>
              <div className="text-[9px] text-slate-600">Building a healthier, stronger India. Version 1.0.0</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({ title, desc, onClick }: { title: string, desc: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 cyber-card hover:bg-white/5 transition-all duration-300 flex items-center justify-between cursor-pointer border-[#00D2FF]/20 group"
    >
      <div>
        <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-[#00D2FF] transition-colors">{title}</h4>
        <p className="text-slate-400 text-xs mt-1">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[#00D2FF] transition-colors" />
    </button>
  );
}

function FounderRoleCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid="button-role-founder"
      className="w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between cursor-pointer group"
      style={{
        background: "rgba(30,20,2,0.85)",
        border: "1px solid rgba(244,196,48,0.3)",
        boxShadow: "0 0 16px rgba(244,196,48,0.06)"
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(244,196,48,0.1)", border: "1px solid rgba(244,196,48,0.3)" }}>
          <Crown className="w-5 h-5" style={{ color: "#F4C430" }} />
        </div>
        <div>
          <h4 className="font-black text-sm tracking-wide" style={{ color: "#F4C430" }}>SUPER ADMIN / FOUNDER</h4>
          <p className="text-xs mt-0.5" style={{ color: "rgba(244,196,48,0.5)" }}>Supreme authority — all nodes, WHO oversight</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 transition-colors" style={{ color: "rgba(244,196,48,0.4)" }} />
    </button>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 opacity-70">
      <div className="text-[#00D2FF]">{icon}</div>
      <span className="text-[8px] text-white font-bold tracking-wider">{label}</span>
    </div>
  );
}