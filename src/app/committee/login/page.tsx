"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getUserRole } from "@/lib/checkRole";

export default function CommitteeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMsg("Email atau password salah.");
      setLoading(false);
      return;
    }

    const role = await getUserRole(data.user.id);
    if (role !== "committee") {
      await supabase.auth.signOut();
      setErrorMsg("Akun ini bukan akun committee.");
      setLoading(false);
      return;
    }

    router.push("/committee");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <form
        onSubmit={handleSubmit}
        className="neo-card relative w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8"
      >
        <div className="neo-pill mb-6 w-fit rounded-full bg-mint px-4 py-1.5">
          <span className="font-pixel text-xs text-navy">
            SHAinni Committee
          </span>
        </div>
        <h1 className="font-pixel text-xl text-navy">Committee Login</h1>
        <p className="mt-1 font-body text-sm text-navy/60">
          Khusus buat absensi Closing Ceremony.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="committee@shainy.id"
              className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
            />
          </label>

          {errorMsg && (
            <p className="font-body text-xs font-semibold text-coral">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="neo-shadow-sm mt-2 flex items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-mint px-6 py-3 font-body text-sm font-bold tracking-widest text-navy transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Masuk...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Masuk
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
