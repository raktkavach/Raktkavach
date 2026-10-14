import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import type { Language } from "@/lib/translations";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="fixed right-3 top-3 z-50 flex items-center gap-2 rounded-full border border-cyan-400/25 bg-slate-950/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur">
      <Globe className="h-4 w-4 text-cyan-300" aria-hidden="true" />
      <span className="sr-only">{t("chooseLanguage")}</span>
      <select
        aria-label={t("chooseLanguage")}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="max-w-28 cursor-pointer bg-transparent font-semibold outline-none"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code} className="bg-slate-950">
            {item.native} · {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
