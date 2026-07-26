"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import CheckInCard from "@/components/committee/CheckInCard";

export default function KodeManualPage() {
  const [code, setCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmittedCode(code.trim().toUpperCase());
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setCode("");
  };

  return (
    <div className="relative mx-auto flex w-[92%] max-w-md flex-col items-center">
      <h1 className="font-pixel text-xl text-navy">Input Kode Tiket</h1>

      {!submittedCode && (
        <form
          onSubmit={handleSubmit}
          className="neo-card mt-6 w-full rounded-3xl bg-white p-6"
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Kode Tiket
            </span>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SHAINY-XXXXXXX"
              className="rounded-xl border-[3px] border-navy px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-wide text-navy outline-none focus:bg-sand/30"
            />
          </label>
          <button
            type="submit"
            className="neo-shadow-sm mt-4 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-mint px-6 py-3 font-body text-sm font-bold text-navy"
          >
            <Search size={16} />
            Cari Peserta
          </button>
        </form>
      )}

      {submittedCode && (
        <CheckInCard ticketId={submittedCode} onReset={handleReset} />
      )}
    </div>
  );
}
