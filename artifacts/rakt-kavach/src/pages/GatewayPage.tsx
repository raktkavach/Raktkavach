import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Droplet, Shield, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { requireSupabase, supabaseConfigured } from "@/lib/supabase";

type PortalRole = "donor" | "hospital" | "lab" | "authority" | "founder";
type Mode = "welcome" | "login" | "register" | "verify" | "reset";

const portalPaths: Record<PortalRole, string> = {
  donor: "/donor",
  hospital: "/hospital",
  lab: "/lab",
  authority: "/authority",
  founder: "/founder",
};

const roles: { id: PortalRole; label: string; description: string }[] = [
  { id: "donor", label: "Donor", description: "Blood wallet and donor services" },
  { id: "hospital", label: "Hospital node", description: "Inventory and emergency exchange" },
  { id: "lab", label: "Lab / clinic", description: "Facility services" },
  { id: "authority", label: "National authority", description: "Authorized command center" },
  { id: "founder", label: "Founder", description: "Restricted system oversight" },
];

export default function GatewayPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("welcome");
  const [role, setRole] = useState<PortalRole>("donor");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const routeUser = async (userId: string) => {
    const client = requireSupabase();
    const { data, error: profileError } = await client
      .from("profiles")
      .select("role,status")
      .eq("id", userId)
      .single();
    if (profileError) throw profileError;
    if (data.status !== "active") throw new Error("This account is not active. Contact your administrator.");
    navigate(portalPaths[data.role as PortalRole] ?? "/");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const client = requireSupabase();
      if (mode === "login") {
        const { data, error: authError } = await client.auth.signInWithPassword({
          phone: phone.trim(),
          password,
        });
        if (authError) throw authError;
        if (!data.user) throw new Error("Sign in did not return an account.");
        await routeUser(data.user.id);
      } else if (mode === "register") {
        if (role !== "donor") {
          throw new Error("Facility and authority accounts must be created by an administrator.");
        }
        const { data, error: authError } = await client.auth.signUp({
          phone: phone.trim(),
          password,
          options: { data: { requested_role: role } },
        });
        if (authError) throw authError;
        if (data.session && data.user) {
          await routeUser(data.user.id);
        } else {
          setMode("verify");
          setMessage("Enter the SMS code sent to your phone to activate your account.");
        }
      } else if (mode === "verify") {
        const { data, error: authError } = await client.auth.verifyOtp({
          phone: phone.trim(),
          token: otp.trim(),
          type: "sms",
        });
        if (authError) throw authError;
        if (!data.user) throw new Error("Phone verification did not return an account.");
        await routeUser(data.user.id);
      } else if (mode === "reset") {
        if (!otp || newPassword.length < 8) {
          throw new Error("Enter the SMS code and a password with at least 8 characters.");
        }
        const { data, error: otpError } = await client.auth.verifyOtp({
          phone: phone.trim(),
          token: otp.trim(),
          type: "sms",
        });
        if (otpError) throw otpError;
        const { error: updateError } = await client.auth.updateUser({ password: newPassword });
        if (updateError) throw updateError;
        setPassword("");
        setMessage("Password updated. Sign in with your new password.");
        setMode("login");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  const sendResetCode = async () => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const { error: otpError } = await requireSupabase().auth.signInWithOtp({
        phone: phone.trim(),
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setMode("reset");
      setMessage("A verification code has been sent to your phone.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send a verification code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#030916] px-4 py-20 text-white">
      <div className="w-full max-w-lg">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
            <Droplet className="h-7 w-7 fill-red-500 text-red-500" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            {t("tagline")}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Rakt Kavach</h1>
          <p className="mt-2 text-sm text-slate-400">National Blood Grid</p>
        </header>

        {!supabaseConfigured && (
          <div role="alert" className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            Supabase is not configured. Add the project URL and public anon key to enable sign in.
          </div>
        )}

        <section className="rounded-2xl border border-cyan-400/15 bg-slate-950/90 p-5 shadow-2xl sm:p-7">
          {mode === "welcome" ? (
            <>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                <div>
                  <h2 className="text-lg font-bold">Secure access</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Sign in with your phone number and password. Portal access is assigned to your account.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold hover:bg-red-500"
              >
                Sign in <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="mt-3 w-full rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/5"
              >
                Register as a donor
              </button>
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-400">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                Aadhaar is not collected or stored. Authorized-provider verification remains unavailable until a provider is configured.
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setMode("welcome");
                  setError("");
                  setMessage("");
                }}
                className="mb-5 text-sm text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold">
                {mode === "register" ? "Create donor account" : mode === "verify" ? "Verify phone" : mode === "reset" ? "Reset password" : t("loginTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-400">Use the phone number linked to your Rakt Kavach account.</p>

              <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
                <label className="block text-sm font-medium">
                  Portal
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as PortalRole)}
                    disabled={mode === "verify" || mode === "reset"}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-3 text-white"
                  >
                    {roles.map((item) => (
                      <option key={item.id} value={item.id}>{item.label} — {item.description}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Phone number (international format)
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    pattern="\\+[1-9][0-9]{7,14}"
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-3 text-white placeholder:text-slate-600"
                  />
                </label>
                {(mode === "login" || mode === "register") && (
                  <label className="block text-sm font-medium">
                    Password
                    <input
                      type="password"
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-3 text-white"
                    />
                  </label>
                )}
                {(mode === "verify" || mode === "reset") && (
                  <label className="block text-sm font-medium">
                    SMS verification code
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\\D/g, "").slice(0, 8))}
                      required
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-3 text-white"
                    />
                  </label>
                )}
                {mode === "reset" && (
                  <label className="block text-sm font-medium">
                    New password
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      required
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-3 text-white"
                    />
                  </label>
                )}
                {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
                {message && <p role="status" className="rounded-lg bg-cyan-500/10 p-3 text-sm text-cyan-200">{message}</p>}
                <button
                  type="submit"
                  disabled={busy || !supabaseConfigured}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Working…" : mode === "register" ? "Create account" : mode === "verify" ? "Verify phone" : mode === "reset" ? "Set new password" : "Sign in"}
                </button>
              </form>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => void sendResetCode()}
                  disabled={!phone || busy || !supabaseConfigured}
                  className="mt-3 w-full text-sm text-cyan-300 hover:text-cyan-100 disabled:opacity-40"
                >
                  Send password reset code
                </button>
              )}
              {mode === "login" && (
                <button type="button" onClick={() => setMode("register")} className="mt-3 w-full text-sm text-slate-400 hover:text-white">
                  Need a donor account? Register
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
