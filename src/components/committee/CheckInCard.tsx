"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, UserCheck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Registration = {
  id: string;
  ticket_id: string;
  nama: string;
  instansi: string;
  no_wa: string;
  event_title: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

export default function CheckInCard({
  ticketId,
  onReset,
}: {
  ticketId: string;
  onReset: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setRegistration(null);

    supabase
      .from("registrations")
      .select("*")
      .eq("ticket_id", ticketId.trim())
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setNotFound(true);
        } else {
          setRegistration(data as Registration);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ticketId]);

  const handleCheckIn = async () => {
    if (!registration) return;
    setCheckingIn(true);
    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from("registrations")
      .update({ checked_in: true, checked_in_at: nowIso })
      .eq("id", registration.id);

    if (!error) {
      setRegistration((prev) =>
        prev ? { ...prev, checked_in: true, checked_in_at: nowIso } : prev,
      );
    }
    setCheckingIn(false);
  };

  return (
    <div className="neo-card mt-6 w-full max-w-md rounded-3xl bg-white p-6">
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 size={28} className="animate-spin text-navy/40" />
          <p className="font-body text-sm text-navy/50">Nyari data tiket...</p>
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <XCircle size={36} className="text-coral" />
          <p className="font-body text-sm font-bold text-navy">
            Kode tiket gak ketemu
          </p>
          <p className="font-body text-xs text-navy/50">
            Kode: <span className="font-mono">{ticketId}</span>
          </p>
          <button
            type="button"
            onClick={onReset}
            className="neo-shadow-sm mt-2 rounded-full border-[3px] border-navy bg-navy px-5 py-2 font-body text-xs font-bold text-white"
          >
            Coba Lagi
          </button>
        </div>
      ) : registration ? (
        <div className="flex flex-col items-center gap-3 text-center">
          {registration.checked_in ? (
            <div className="neo-shadow-sm flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-navy bg-sunny">
              <Clock size={24} className="text-navy" />
            </div>
          ) : (
            <div className="neo-shadow-sm flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-navy bg-mint">
              <UserCheck size={24} className="text-navy" />
            </div>
          )}

          <div>
            <p className="font-pixel text-lg text-navy">{registration.nama}</p>
            <p className="font-body text-xs text-navy/50">
              {registration.instansi}
            </p>
            <p className="mt-1 font-mono text-xs text-navy/40">
              {registration.ticket_id}
            </p>
          </div>

          {registration.checked_in ? (
            <div className="neo-pill rounded-full bg-sunny px-4 py-1.5">
              <span className="font-body text-xs font-bold text-navy">
                Sudah check-in
                {registration.checked_in_at &&
                  ` · ${new Date(registration.checked_in_at).toLocaleTimeString(
                    "id-ID",
                    { hour: "2-digit", minute: "2-digit" },
                  )}`}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-mint px-6 py-3 font-body text-sm font-bold text-navy disabled:opacity-60"
            >
              {checkingIn ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Tandai Hadir
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="mt-2 font-body text-xs font-semibold text-navy/40 underline"
          >
            {registration.checked_in ? "Cek Peserta Lain" : "Batal"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
