"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { X, Ticket as TicketIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import ETicket from "./ETicket";

type RegistrationModalProps = {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  onClose: () => void;
};

type FormState = {
  nama: string;
  instansi: string;
  noWa: string;
};

function toTitleCase(text: string) {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function RegistrationModal({
  eventTitle,
  eventDate,
  eventLocation,
  onClose,
}: RegistrationModalProps) {
  const [form, setForm] = useState<FormState>({
    nama: "",
    instansi: "",
    noWa: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [ticketId, setTicketId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.instansi.trim() || !form.noWa.trim()) {
      return;
    }
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const namaRapi = toTitleCase(form.nama);
    const instansiRapi = toTitleCase(form.instansi);
    const newTicketId = `SHAINY-${Date.now().toString(36).toUpperCase()}`;

    // Semua penjaminan (kuota + duplikat nama) terjadi ATOMIK
    // di dalam function `register_participant` di database.
    const { error } = await supabase.rpc("register_participant", {
      p_ticket_id: newTicketId,
      p_nama: namaRapi,
      p_instansi: instansiRapi,
      p_no_wa: form.noWa.trim(),
      p_event_title: eventTitle,
    });

    if (error) {
      setStatus("error");

      if (error.message?.includes("EVENT_FULL")) {
        setErrorMsg("Maaf, kuota untuk event ini sudah penuh.");
      } else if (error.code === "23505") {
        setErrorMsg(
          `Nama "${namaRapi}" sudah terdaftar di event ini. Gunakan nama lain kalau ini bukan kamu.`,
        );
      } else if (error.message?.includes("EVENT_NOT_FOUND")) {
        setErrorMsg("Event tidak ditemukan. Coba muat ulang halaman.");
      } else {
        setErrorMsg("Gagal menyimpan pendaftaran. Coba lagi sebentar lagi ya.");
      }
      return;
    }

    setTicketId(newTicketId);
    setStatus("success");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="neo-card relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-navy bg-white text-navy"
        >
          <X size={16} />
        </button>

        {status === "success" ? (
          <ETicket
            ticketId={ticketId}
            nama={toTitleCase(form.nama)}
            instansi={toTitleCase(form.instansi)}
            noWa={form.noWa}
            eventTitle={eventTitle}
            eventDate={eventDate}
            eventLocation={eventLocation}
            onClose={onClose}
          />
        ) : (
          <>
            <div className="neo-pill mb-6 w-fit rounded-full bg-sunny px-4 py-1.5">
              <span className="font-pixel text-xs text-navy">
                Daftar Sekarang
              </span>
            </div>
            <h3 className="font-pixel text-lg text-navy sm:text-xl">
              {eventTitle}
            </h3>
            <p className="mt-1 font-body text-sm text-navy/60">
              {eventDate} · {eventLocation}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
                  Nama Lengkap
                </span>
                <input
                  required
                  value={form.nama}
                  onChange={handleChange("nama")}
                  placeholder="Nama kamu"
                  className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
                  Instansi / Universitas
                </span>
                <input
                  required
                  value={form.instansi}
                  onChange={handleChange("instansi")}
                  placeholder="Nama instansi"
                  className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
                  Nomor WhatsApp
                </span>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  value={form.noWa}
                  onChange={handleChange("noWa")}
                  placeholder="08xxxxxxxxxx"
                  className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
                />
              </label>

              {status === "error" && (
                <p className="font-body text-xs font-semibold text-coral">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="neo-shadow-sm mt-2 flex items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-sunny px-6 py-3 font-body text-sm font-bold tracking-widest text-navy transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <TicketIcon size={16} />
                    Daftar &amp; Dapatkan E-Tiket
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
