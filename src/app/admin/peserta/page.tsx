"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, Search, X, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Registration = {
  id: string;
  ticket_id: string;
  nama: string;
  instansi: string;
  no_wa: string;
  event_title: string;
  created_at: string;
};

export default function AdminPesertaPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [instansiFilter, setInstansiFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setData(data as Registration[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setChecking(false);
      fetchData();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router, fetchData]);

  const eventTitles = useMemo(() => {
    const set = new Set(data.map((r) => r.event_title));
    return Array.from(set);
  }, [data]);

  const instansiList = useMemo(() => {
    const set = new Set(data.map((r) => r.instansi).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const hasActiveFilters =
    eventFilter !== "all" ||
    instansiFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    search.trim() !== "";

  const resetFilters = () => {
    setSearch("");
    setEventFilter("all");
    setInstansiFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchEvent = eventFilter === "all" || r.event_title === eventFilter;
      const matchInstansi =
        instansiFilter === "all" || r.instansi === instansiFilter;

      const regDate = new Date(r.created_at);
      const matchFrom = !dateFrom || regDate >= new Date(`${dateFrom}T00:00:00`);
      const matchTo = !dateTo || regDate <= new Date(`${dateTo}T23:59:59`);

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.nama.toLowerCase().includes(q) ||
        r.instansi.toLowerCase().includes(q) ||
        r.ticket_id.toLowerCase().includes(q);

      return matchEvent && matchInstansi && matchFrom && matchTo && matchSearch;
    });
  }, [data, search, eventFilter, instansiFilter, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("registrations").delete().eq("id", id);

    if (!error) {
      setData((prev) => prev.filter((r) => r.id !== id));
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)]">
        <Loader2 size={28} className="animate-spin text-navy/50" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-2xl text-navy">
              Peserta Closing Ceremony
            </h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              Menampilkan {filtered.length} dari {data.length} peserta terdaftar
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex flex-1 min-w-[220px] items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2">
          <Search size={16} className="text-navy/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, instansi, atau ticket id..."
            suppressHydrationWarning
            className="w-full bg-transparent font-body text-sm text-navy outline-none placeholder:text-navy/40"
          />
        </div>

        {/* Filter row */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              Event
            </span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy outline-none"
            >
              <option value="all">Semua Event</option>
              {eventTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              Instansi
            </span>
            <select
              value={instansiFilter}
              onChange={(e) => setInstansiFilter(e.target.value)}
              className="rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy outline-none"
            >
              <option value="all">Semua Instansi</option>
              {instansiList.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              Dari Tanggal
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              Sampai Tanggal
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy outline-none"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 flex items-center gap-1 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy hover:bg-sand/20"
            >
              <X size={14} />
              Reset Filter
            </button>
          )}
        </div>

        {/* Tabel peserta */}
        <div className="neo-card mt-6 overflow-hidden rounded-2xl bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-navy/40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <Users size={32} className="text-navy/30" />
              <p className="font-body text-sm font-semibold text-navy/50">
                Belum ada peserta yang cocok.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b-[3px] border-navy bg-sand/30">
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      No
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Ticket ID
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Nama
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Instansi
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      No WA
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Event
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Tanggal Daftar
                    </th>
                    <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-wide text-navy/70">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((peserta, idx) => (
                    <tr
                      key={peserta.id}
                      className="border-b border-navy/10 hover:bg-sand/10"
                    >
                      <td className="px-4 py-3 font-body text-sm text-navy/60">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-pixel text-xs text-sunny [text-shadow:1px_1px_0_#0D2B4E]">
                        {peserta.ticket_id}
                      </td>
                      <td className="px-4 py-3 font-body text-sm font-bold text-navy">
                        {peserta.nama}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-navy/70">
                        {peserta.instansi}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-navy/70">
                        {peserta.no_wa}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-navy/70">
                        {peserta.event_title}
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-navy/50">
                        {new Date(peserta.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {confirmId === peserta.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(peserta.id)}
                              disabled={deletingId === peserta.id}
                              className="rounded-full border-[3px] border-coral bg-coral px-3 py-1.5 font-body text-xs font-bold text-white disabled:opacity-60"
                            >
                              {deletingId === peserta.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Ya, hapus"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              disabled={deletingId === peserta.id}
                              className="rounded-full border-[3px] border-navy bg-white px-3 py-1.5 font-body text-xs font-semibold text-navy"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(peserta.id)}
                            className="flex items-center gap-1 rounded-full border-[3px] border-navy bg-white px-3 py-1.5 font-body text-xs font-semibold text-navy hover:bg-coral/10 hover:border-coral hover:text-coral"
                          >
                            <Trash2 size={13} />
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}