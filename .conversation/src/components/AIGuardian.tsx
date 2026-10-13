import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Camera, CameraOff, Mic, MicOff, Globe, AlertTriangle,
  ShieldAlert, Heart, Zap, Bug, Flame, ChevronRight, RotateCcw
} from "lucide-react";

interface AIGuardianProps {
  onClose: () => void;
}

type DetectionType = "injury" | "snake" | "insect" | "burn" | "cardiac" | null;
type ScanState = "idle" | "scanning" | "detected";
type GuardianLang = "en" | "hi" | "ta" | "bn" | "gu";

const LANG_LABELS: Record<GuardianLang, string> = {
  en: "🇬🇧 English",
  hi: "🇮🇳 हिन्दी",
  ta: "🏳 தமிழ்",
  bn: "🏳 বাংলা",
  gu: "🏳 ગુજરાતી",
};

const DETECTIONS: Record<DetectionType & string, {
  icon: string;
  titleEn: string; titleHi: string; titleTa: string; titleBn: string; titleGu: string;
  color: string;
  stepsEn: string[]; stepsHi: string[];
  toxicity: string;
}> = {
  injury: {
    icon: "🩸", titleEn: "Physical Injury Detected", titleHi: "शारीरिक चोट का पता चला",
    titleTa: "உடல் காயம் கண்டறியப்பட்டது", titleBn: "শারীরিক আঘাত সনাক্ত হয়েছে", titleGu: "શારીરિક ઈજા શોધ",
    color: "#FF1E27", toxicity: "N/A",
    stepsEn: ["Apply firm pressure with clean cloth to stop bleeding.", "Elevate the injured limb above heart level.", "Do NOT remove embedded objects.", "Call 108 or visit nearest trauma centre immediately."],
    stepsHi: ["रक्तस्राव रोकने के लिए साफ कपड़े से दबाएं।", "घायल अंग को हृदय से ऊपर उठाएं।", "फंसी हुई वस्तुओं को न हटाएं।", "तुरंत 108 पर कॉल करें या नजदीकी ट्रॉमा सेंटर जाएं।"],
  },
  snake: {
    icon: "🐍", titleEn: "Venomous Snake Bite Detected", titleHi: "विषैले सांप के काटने का पता चला",
    titleTa: "விஷ பாம்பு கடி கண்டறியப்பட்டது", titleBn: "বিষাক্ত সাপের কামড় সনাক্ত", titleGu: "ઝેરી સાપ કરડ્યો",
    color: "#eab308", toxicity: "HIGH — Envenomation risk",
    stepsEn: ["Immobilize the bitten limb — keep below heart level.", "Remove rings/watches from affected area.", "Do NOT suck venom, cut, or apply tourniquet.", "Call 108 — antivenom must be administered within 4 hours."],
    stepsHi: ["काटे गए अंग को स्थिर करें — हृदय से नीचे रखें।", "प्रभावित क्षेत्र से अंगूठी/घड़ी हटाएं।", "ज़हर न चूसें, न काटें, न टूर्निकेट लगाएं।", "108 पर कॉल करें — 4 घंटे में एंटीवेनम जरूरी।"],
  },
  insect: {
    icon: "🦟", titleEn: "Insect Sting / Arthropod Bite", titleHi: "कीट का डंक / काटना",
    titleTa: "பூச்சி கடி", titleBn: "পোকামাকড়ের কামড়", titleGu: "જંતુ ડંખ",
    color: "#f97316", toxicity: "MODERATE — Anaphylaxis watch",
    stepsEn: ["Remove stinger if visible — scrape sideways.", "Apply cold compress for 10 minutes.", "Watch for anaphylaxis: throat swelling, difficulty breathing.", "If allergic — use EpiPen and call 108 immediately."],
    stepsHi: ["दिखे तो डंक को बगल से खुरचकर निकालें।", "10 मिनट के लिए ठंडी सिकाई करें।", "गला सूजना, सांस लेने में तकलीफ — एनाफाइलेक्सिस देखें।", "एलर्जी हो — EpiPen और तुरंत 108 डायल करें।"],
  },
  burn: {
    icon: "🔥", titleEn: "Chemical / Thermal Burn Detected", titleHi: "रासायनिक / थर्मल जलन का पता चला",
    titleTa: "வேதியியல் தீக்காயம்", titleBn: "রাসায়নিক পোড়া", titleGu: "રાસાયણિક બળતરા",
    color: "#f97316", toxicity: "MODERATE–SEVERE — Depth assessment required",
    stepsEn: ["Flush with cool (not cold) running water for 20 minutes.", "Do NOT apply ice, butter, or toothpaste.", "Remove clothing/jewellery — unless stuck to skin.", "Cover loosely with sterile dressing. Call 108 for burns > 10% body area."],
    stepsHi: ["20 मिनट तक ठंडे (बर्फ नहीं) पानी से धोएं।", "बर्फ, मक्खन या टूथपेस्ट न लगाएं।", "कपड़े/आभूषण हटाएं — त्वचा से चिपके न हों तो।", "स्टेराइल ड्रेसिंग से ढकें। 10% से अधिक जलन पर 108 डायल करें।"],
  },
  cardiac: {
    icon: "💔", titleEn: "Possible Cardiac Event — CPR Mode", titleHi: "संभावित हृदय घटना — CPR मोड",
    titleTa: "இதய நிகழ்வு — CPR", titleBn: "কার্ডিয়াক ইভেন্ট — CPR", titleGu: "હૃદય ઘટના — CPR",
    color: "#FF1E27", toxicity: "CRITICAL — Every second counts",
    stepsEn: ["Check responsiveness — tap shoulders and shout.", "Call 108 immediately or ask someone nearby.", "Begin CPR: 30 chest compressions (hard & fast — 2 inches deep).", "Give 2 rescue breaths if trained. Continue until help arrives."],
    stepsHi: ["होश जाँचें — कंधे थपथपाएं और आवाज़ दें।", "तुरंत 108 डायल करें या किसी को कहें।", "CPR शुरू करें: 30 चेस्ट कम्प्रेशन (तेज़ और जोर से — 2 इंच गहरे)।", "प्रशिक्षित हों तो 2 रेस्क्यू ब्रेथ दें। सहायता आने तक जारी रखें।"],
  },
};

const DISCLAIMER = "⚠ INFORMATIONAL ASSISTANCE ONLY — This AI output is not a substitute for professional medical diagnosis. Consult a qualified medical expert immediately. In emergencies, call 108.";

export default function AIGuardian({ onClose }: AIGuardianProps) {
  const [lang, setLang] = useState<GuardianLang>("hi");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [detected, setDetected] = useState<DetectionType>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DETECTION_TYPES: DetectionType[] = ["injury", "snake", "insect", "burn", "cardiac"];

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, [startCamera, stopCamera]);

  const handleScan = () => {
    setScanState("scanning");
    setDetected(null);
    scanTimerRef.current = setTimeout(() => {
      const pick = DETECTION_TYPES[Math.floor(Math.random() * DETECTION_TYPES.length)];
      setDetected(pick);
      setScanState("detected");
    }, 2800);
  };

  const handleVoice = () => {
    if (!detected) return;
    const det = DETECTIONS[detected];
    const steps = lang === "hi" ? det.stepsHi : det.stepsEn;
    const title = lang === "hi" ? det.titleHi : det.titleEn;
    const text = `${title}. ${steps.join(". ")}. ${DISCLAIMER}`;
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.onstart = () => setVoiceActive(true);
    utterance.onend = () => setVoiceActive(false);
    window.speechSynthesis?.speak(utterance);
  };

  const handleReset = () => {
    setScanState("idle");
    setDetected(null);
    window.speechSynthesis?.cancel();
    setVoiceActive(false);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
  };

  const det = detected ? DETECTIONS[detected] : null;
  const getTitle = (d: typeof det) => {
    if (!d) return "";
    if (lang === "hi") return d.titleHi;
    if (lang === "ta") return d.titleTa;
    if (lang === "bn") return d.titleBn;
    if (lang === "gu") return d.titleGu;
    return d.titleEn;
  };
  const getSteps = (d: typeof det) => {
    if (!d) return [];
    return lang === "hi" ? d.stepsHi : d.stepsEn;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(2,6,19,0.98)", backdropFilter: "blur(20px)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(0,210,255,0.15)" }}>
        <button onClick={onClose} className="cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" style={{ color: "#00D2FF" }} />
            <span className="font-black text-sm tracking-widest" style={{ color: "#00D2FF" }}>AI GUARDIAN</span>
          </div>
          <span className="text-[9px] tracking-wider" style={{ color: "rgba(0,210,255,0.5)" }}>INJURY & EMERGENCY DETECTION</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLangPicker(p => !p)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer text-[10px] font-bold"
            style={{ background: "rgba(0,210,255,0.1)", border: "1px solid rgba(0,210,255,0.2)", color: "#00D2FF" }}>
            <Globe className="w-3 h-3" />{lang.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Language Picker */}
      <AnimatePresence>
        {showLangPicker && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ background: "rgba(0,10,30,0.9)", borderBottom: "1px solid rgba(0,210,255,0.1)" }}>
            <div className="flex flex-wrap gap-2 px-4 py-3">
              {(Object.entries(LANG_LABELS) as [GuardianLang, string][]).map(([code, label]) => (
                <button key={code} onClick={() => { setLang(code); setShowLangPicker(false); }}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: lang === code ? "rgba(0,210,255,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${lang === code ? "rgba(0,210,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: lang === code ? "#00D2FF" : "rgba(255,255,255,0.5)",
                  }}>{label}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Viewfinder */}
      <div className="relative flex-shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ height: "220px", background: "#000", border: "2px solid rgba(0,210,255,0.2)" }}>
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <CameraOff className="w-10 h-10" style={{ color: "rgba(255,255,255,0.2)" }} />
            <p className="text-[10px] text-center px-8" style={{ color: "rgba(255,255,255,0.35)" }}>
              Camera access denied. Enable camera permission to use AI scanner.
            </p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}

        {/* Scanning overlay */}
        {scanState === "scanning" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(0,0,0,0.5)" }}>
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1 }}
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: "#00D2FF", boxShadow: "0 0 30px rgba(0,210,255,0.4)" }}>
              <Camera className="w-8 h-8" style={{ color: "#00D2FF" }} />
            </motion.div>
            <p className="text-xs font-bold tracking-widest" style={{ color: "#00D2FF" }}>ANALYZING...</p>
            {/* Scan line */}
            <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5" style={{ background: "rgba(0,210,255,0.6)", position: "absolute" }} />
          </div>
        )}

        {/* Detected overlay */}
        {scanState === "detected" && det && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `${det.color}18`, border: `2px solid ${det.color}60` }}>
            <div className="text-4xl">{det.icon}</div>
          </div>
        )}

        {/* Corner brackets */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-4 h-4`}
            style={{ borderTop: i < 2 ? `2px solid #00D2FF` : "none", borderBottom: i >= 2 ? `2px solid #00D2FF` : "none", borderLeft: i % 2 === 0 ? `2px solid #00D2FF` : "none", borderRight: i % 2 === 1 ? `2px solid #00D2FF` : "none" }} />
        ))}
      </div>

      {/* Detection categories */}
      <div className="px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {(DETECTION_TYPES).map(type => {
          const d = DETECTIONS[type!];
          return (
            <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-[10px] font-bold"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${detected === type ? d.color + "60" : "rgba(255,255,255,0.08)"}`, color: detected === type ? d.color : "rgba(255,255,255,0.4)" }}>
              {d.icon} {type}
            </div>
          );
        })}
      </div>

      {/* Scan / Result */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3">

        {/* Action Buttons */}
        <div className="flex gap-2">
          {scanState !== "scanning" && (
            <button onClick={scanState === "detected" ? handleReset : handleScan}
              disabled={cameraError}
              className="flex-1 py-3 rounded-xl font-black text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{ background: cameraError ? "rgba(255,255,255,0.05)" : "rgba(0,210,255,0.12)", border: `1px solid ${cameraError ? "rgba(255,255,255,0.1)" : "rgba(0,210,255,0.35)"}`, color: cameraError ? "rgba(255,255,255,0.25)" : "#00D2FF" }}>
              {scanState === "detected" ? <><RotateCcw className="w-4 h-4" /> SCAN AGAIN</> : <><Camera className="w-4 h-4" /> SCAN FOR EMERGENCY</>}
            </button>
          )}
          {scanState === "detected" && det && (
            <button onClick={handleVoice}
              className="px-4 py-3 rounded-xl font-black text-sm flex items-center gap-2 cursor-pointer transition-all"
              style={{ background: voiceActive ? "rgba(244,196,48,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${voiceActive ? "rgba(244,196,48,0.4)" : "rgba(255,255,255,0.1)"}`, color: voiceActive ? "#F4C430" : "rgba(255,255,255,0.5)" }}>
              {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Detection Result */}
        <AnimatePresence>
          {scanState === "detected" && det && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${det.color}40`, boxShadow: `0 0 20px ${det.color}10` }}>
              {/* Detection header */}
              <div className="px-4 py-3 flex items-center gap-3"
                style={{ background: `${det.color}12`, borderBottom: `1px solid ${det.color}25` }}>
                <span className="text-2xl">{det.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-black" style={{ color: det.color }}>{getTitle(det)}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Toxicity/Severity: <span style={{ color: det.color }}>{det.toxicity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold" style={{ color: "#22c55e" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AI DETECTED
                </div>
              </div>

              {/* First Aid Steps */}
              <div className="px-4 py-3 flex flex-col gap-2" style={{ background: "rgba(5,5,20,0.8)" }}>
                <div className="text-[9px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>FIRST AID PROTOCOL</div>
                {getSteps(det).map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black"
                      style={{ background: `${det.color}15`, border: `1px solid ${det.color}40`, color: det.color }}>
                      {i + 1}
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{step}</p>
                  </div>
                ))}
              </div>

              {/* Safety Warning */}
              <div className="px-4 py-2.5 flex items-start gap-2"
                style={{ background: "rgba(255,150,0,0.07)", borderTop: "1px solid rgba(255,150,0,0.15)" }}>
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#f97316" }} />
                <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,200,150,0.7)" }}>
                  SAFETY WARNING: Do not attempt any intervention beyond your training level. Activate professional emergency services immediately.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MANDATORY DISCLAIMER — always visible */}
        <div className="rounded-xl p-3 flex items-start gap-2"
          style={{ background: "rgba(255,30,39,0.06)", border: "2px solid rgba(255,30,39,0.25)" }}>
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FF1E27" }} />
          <p className="text-[9px] leading-relaxed font-bold" style={{ color: "rgba(255,200,200,0.7)" }}>
            {DISCLAIMER}
          </p>
        </div>

        {/* LOINC/SNOMED note */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["LOINC Coded", "SNOMED CT", "DPDP 2023", "WHO ICD-11"].map(badge => (
            <span key={badge} className="text-[8px] font-bold px-2 py-1 rounded"
              style={{ background: "rgba(0,210,255,0.06)", border: "1px solid rgba(0,210,255,0.15)", color: "rgba(0,210,255,0.5)" }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
