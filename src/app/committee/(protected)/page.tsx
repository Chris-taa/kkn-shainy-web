"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QrCode, Keyboard, Users, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function CommitteeDashboardPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [checkedIn, setCheckedIn] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("registrations")
      .select("checked_in")
      .then(({ data }) => {
        if (!data) return;
        setTotal(data.length);
        setCheckedIn(data.filter((r) => r.checked_in).length);
      });
  }, []);

  return (
    <div className="relative mx-auto w-[92%] max-w-3xl">
      <h1 className="font-pixel text-2xl text-navy">Halo, Committee! 👋</h1>
      <p className="mt-2 font-body text-sm text-navy/60">
        Ini progress absensi Closing Ceremony hari ini.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="neo-card rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 text-navy/50">
            <Users size={16} />
            <span className="font-body text-xs font-semibold uppercase tracking-wide">
              Total Terdaftar
            </span>
          </div>
          <p className="mt-2 font-pixel text-2xl text-navy">{total ?? "…"}</p>
        </div>
        <div className="neo-card rounded-2xl bg-mint p-5">
          <div className="flex items-center gap-2 text-navy/70">
            <CheckCircle2 size={16} />
            <span className="font-body text-xs font-semibold uppercase tracking-wide">
              Sudah Hadir
            </span>
          </div>
          <p className="mt-2 font-pixel text-2xl text-navy">
            {checkedIn ?? "…"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/committee/scan"
          className="neo-card flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 transition-transform hover:-translate-y-0.5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-sunny">
            <QrCode size={22} className="text-navy" />
          </div>
          <div>
            <p className="font-body text-sm font-bold text-navy">
              Scan QR Tiket
            </p>
            <p className="font-body text-xs text-navy/50">
              Mulai absen pakai kamera
            </p>
          </div>
        </Link>

        <Link
          href="/committee/kode"
          className="neo-card flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 transition-transform hover:-translate-y-0.5"
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
      </div>
    </div>
  );
}
