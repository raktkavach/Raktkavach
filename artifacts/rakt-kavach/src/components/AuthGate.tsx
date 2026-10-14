import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { requireSupabase } from "@/lib/supabase";

type Role = "donor" | "hospital" | "lab" | "authority" | "founder";
type GateState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "allowed" }
  | { status: "blocked"; message: string };

export function AuthGate({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: ReactNode;
}) {
  const [state, setState] = useState<GateState>({ status: "loading" });
  const [, navigate] = useLocation();

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const client = requireSupabase();
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          if (active) setState({ status: "signed-out" });
          return;
        }
        const { data: profile, error: profileError } = await client
          .from("profiles")
          .select("role,status")
          .eq("id", data.session.user.id)
          .single();
        if (profileError) throw profileError;
        if (profile.status !== "active") {
          if (active) {
            setState({
              status: "blocked",
              message: "This account is not active. Contact your Rakt Kavach administrator.",
            });
          }
          return;
        }
        if (!allowedRoles.includes(profile.role as Role)) {
          if (active) {
            setState({
              status: "blocked",
              message: "This account does not have permission to open this portal.",
            });
          }
          return;
        }
        if (active) setState({ status: "allowed" });
      } catch (error) {
        if (active) {
          setState({
            status: "blocked",
            message: error instanceof Error ? error.message : "Could not verify this account.",
          });
        }
      }
    };
    void check();
    return () => {
      active = false;
    };
  }, [allowedRoles]);

  if (state.status === "loading") {
    return <div className="min-h-screen bg-[#050b18]" aria-label="Verifying account" />;
  }

  if (state.status === "signed-out") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b18] p-6 text-white">
        <div className="max-w-md rounded-2xl border border-cyan-400/20 bg-slate-950 p-6 text-center">
          <h1 className="text-xl font-bold">Sign in required</h1>
          <p className="mt-2 text-sm text-slate-300">Sign in with your verified phone account to continue.</p>
          <Link href="/" className="mt-5 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-bold">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b18] p-6 text-white">
        <div className="max-w-md rounded-2xl border border-amber-400/20 bg-slate-950 p-6 text-center">
          <h1 className="text-xl font-bold">Portal unavailable</h1>
          <p className="mt-2 text-sm text-slate-300">{state.message}</p>
          <Link href="/" className="mt-5 inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm">
            Return to Rakt Kavach
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => {
          void requireSupabase().auth.signOut().then(() => navigate("/"));
        }}
        className="fixed right-44 top-3 z-50 rounded-full border border-white/15 bg-slate-950/90 px-3 py-2 text-xs font-semibold text-slate-200"
      >
        Sign out
      </button>
    </>
  );
}
