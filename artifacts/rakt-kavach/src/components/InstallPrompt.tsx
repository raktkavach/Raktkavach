import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);
    setIosHelp(/iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed || (!installEvent && !iosHelp)) return null;

  const install = async () => {
    if (!installEvent) {
      setIosHelp(true);
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  };

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-cyan-400/25 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur">
      <div className="flex items-start gap-3">
        <Download className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Install Rakt Kavach</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {iosHelp
              ? "In Safari, tap Share, then Add to Home Screen."
              : "Add the National Blood Grid to your home screen for quick access."}
          </p>
          {installEvent && (
            <button
              type="button"
              onClick={() => void install()}
              className="mt-3 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
            >
              Install app
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss install prompt"
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
