"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, CheckCircle2, Circle } from "lucide-react";
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

export default function DaftarPesertaPage() {
  const [list, setList] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyNotYet, setOnlyNotYet] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("nama", { ascending: true });

    if (!error && data) setList(data as Registration[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return list.filter((r) => {
      if (onlyNotYet && r.checked_in) return false;
      if (
        search.trim() &&
        !r.nama.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [list, search, onlyNotYet]);

  const totalHadir = list.filter((r) => r.checked_in).length;

  return (
    <div className="relative mx-auto w-[92%] max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-pixel text-xl text-navy">Daftar Peserta</h1>
        <span className="neo-pill rounded-full bg-mint px-3 py-1 font-body text-xs font-bold text-navy">
          {totalHadir} / {list.length} Hadir
        </span>
      </div>

      <div className="neo-card mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4">
        <div className="relative min-w-[160px] flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama..."
            className="w-full rounded-lg border-2 border-navy/30 py-1.5 pl-8 pr-3 font-body text-sm text-navy outline-none focus:border-navy"
          />
        </div>
        <label className="flex items-center gap-2 font-body text-xs font-semibold text-navy/70">
          <input
            type="checkbox"
            checked={onlyNotYet}
            onChange={(e) => setOnlyNotYet(e.target.checked)}
            className="h-4 w-4 accent-[#0d2b4e]"
          />
          Belum hadir aja
        </label>
      </div>

      <div className="neo-card mt-4 divide-y divide-navy/10 rounded-2xl bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-navy/40" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center font-body text-sm text-navy/40">
            Gak ada peserta yang cocok.
          </p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-body text-sm font-bold text-navy">
                  {r.nama}
                </p>
                <p className="font-body text-xs text-navy/50">{r.instansi}</p>
              </div>
              {r.checked_in ? (
                <span
                  className="flex items-center gap-1 font-body text-xs font-semibold"
                  style={{ color: "#1a9b7f" }}
                >
                  <CheckCircle2 size={14} />
                  Hadir
                </span>
              ) : (
                <span className="flex items-center gap-1 font-body text-xs font-semibold text-navy/30">
                  <Circle size={14} />
                  Belum
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
