"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, Keyboard, ListChecks, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function PanitiaHubPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/committee/login");
        return;
      }
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/committee/login");
      },
    );
    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/committee/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)]">
        <Loader2 size={28} className="animate-spin text-navy/50" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-md text-center">
        <h1 className="font-pixel text-2xl text-navy">
          Absensi Closing Ceremony
        </h1>
        <p className="mt-2 font-body text-sm text-navy/60">
          Pilih cara absen peserta.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/committee/scan"
            className="neo-card flex items-center gap-4 rounded-2xl bg-white p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-sunny">
              <QrCode size={22} className="text-navy" />
            </div>
            <div>
              <p className="font-body text-sm font-bold text-navy">
                Scan QR Tiket
              </p>
              <p className="font-body text-xs text-navy/50">
                Pakai kamera buat scan e-tiket peserta
              </p>
            </div>
          </Link>

          <Link
            href="/committee/code"
            className="neo-card flex items-center gap-4 rounded-2xl bg-white p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-mint">
              <Keyboard size={22} className="text-navy" />
            </div>
            <div>
              <p className="font-body text-sm font-bold text-navy">
                Input Kode Manual
              </p>
              <p className="font-body text-xs text-navy/50">
                Kalau QR-nya susah discan
              </p>
            </div>
          </Link>

          <Link
            href="/committee/list"
            className="neo-card flex items-center gap-4 rounded-2xl bg-white p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-sky">
              <ListChecks size={22} className="text-white" />
            </div>
            <div>
              <p className="font-body text-sm font-bold text-navy">
                Daftar Peserta
              </p>
              <p className="font-body text-xs text-navy/50">
                Lihat semua peserta & status hadir
              </p>
            </div>
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="neo-shadow-sm mt-8 inline-flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  );
}
