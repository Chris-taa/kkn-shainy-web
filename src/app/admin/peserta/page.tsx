"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  Search,
  X,
  Trash2,
  FileDown,
  CopyCheck,
} from "lucide-react";
import ExcelJS from "exceljs";
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
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        if (!session) router.replace("/admin/login");
      },
    );

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

  // Normalisasi string: trim + lowercase + rapikan spasi ganda, biar "Astuti", "ASTUTI ", "astuti" dianggap sama
  const normalize = (val?: string) =>
    (val ?? "").trim().toLowerCase().replace(/\s+/g, " ");

  // Duplikat terdeteksi berdasarkan Nama saja (No WA sengaja tidak dipakai,
  // karena satu nomor bisa dipakai orang tua untuk daftarin beberapa anak)
  const duplicateNamaCounts = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((r) => {
      const key = normalize(r.nama);
      if (!key) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [data]);

  const isDuplicateRow = useCallback(
    (r: Registration) => {
      const namaCount = duplicateNamaCounts.get(normalize(r.nama)) ?? 0;
      return namaCount > 1;
    },
    [duplicateNamaCounts],
  );

  const duplicateCount = useMemo(() => {
    return data.filter((r) => isDuplicateRow(r)).length;
  }, [data, isDuplicateRow]);

  const hasActiveFilters =
    eventFilter !== "all" ||
    instansiFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    search.trim() !== "" ||
    showDuplicatesOnly;

  const resetFilters = () => {
    setSearch("");
    setEventFilter("all");
    setInstansiFilter("all");
    setDateFrom("");
    setDateTo("");
    setShowDuplicatesOnly(false);
  };

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchEvent = eventFilter === "all" || r.event_title === eventFilter;
      const matchInstansi =
        instansiFilter === "all" || r.instansi === instansiFilter;

      const regDate = new Date(r.created_at);
      const matchFrom =
        !dateFrom || regDate >= new Date(`${dateFrom}T00:00:00`);
      const matchTo = !dateTo || regDate <= new Date(`${dateTo}T23:59:59`);

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.nama.toLowerCase().includes(q) ||
        r.instansi.toLowerCase().includes(q) ||
        r.ticket_id.toLowerCase().includes(q);

      const matchDuplicate = !showDuplicatesOnly || isDuplicateRow(r);

      return (
        matchEvent &&
        matchInstansi &&
        matchFrom &&
        matchTo &&
        matchSearch &&
        matchDuplicate
      );
    });
  }, [
    data,
    search,
    eventFilter,
    instansiFilter,
    dateFrom,
    dateTo,
    showDuplicatesOnly,
    isDuplicateRow,
  ]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (!error) {
      setData((prev) => prev.filter((r) => r.id !== id));
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  const handleExport = async () => {
    if (filtered.length === 0) return;
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Admin Panel";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Peserta", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Ticket ID", key: "ticket_id", width: 16 },
        { header: "Nama", key: "nama", width: 28 },
        { header: "Instansi", key: "instansi", width: 28 },
        { header: "No WA", key: "no_wa", width: 18 },
        { header: "Event", key: "event_title", width: 28 },
        { header: "Tanggal Daftar", key: "created_at", width: 22 },
        { header: "Status", key: "status", width: 14 },
      ];

      // Styling header
      const headerRow = worksheet.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0D2B4E" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      filtered.forEach((r, idx) => {
        const isDup = isDuplicateRow(r);
        const row = worksheet.addRow({
          no: idx + 1,
          ticket_id: r.ticket_id,
          nama: r.nama,
          instansi: r.instansi,
          no_wa: r.no_wa,
          event_title: r.event_title,
          created_at: new Date(r.created_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          status: isDup ? "Duplikat" : "Unik",
        });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD9D9D9" } },
            left: { style: "thin", color: { argb: "FFD9D9D9" } },
            bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
            right: { style: "thin", color: { argb: "FFD9D9D9" } },
          };
          cell.alignment = { vertical: "middle" };
        });

        if (isDup) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFE1E1" },
            };
            cell.font = { color: { argb: "FFB3261E" }, bold: true };
          });
        } else if (idx % 2 === 1) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF7F7F7" },
            };
          });
        }
      });

      worksheet.autoFilter = {
        from: "A1",
        to: `H${filtered.length + 1}`,
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `peserta-closing-ceremony-${dateStr}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal export ke Excel. Coba lagi.");
    } finally {
      setExporting(false);
    }
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
              {duplicateCount > 0 && (
                <span className="ml-1 font-semibold text-coral">
                  · {duplicateCount} terindikasi duplikat (Nama sama)
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || filtered.length === 0}
            className="flex items-center gap-2 rounded-full border-[3px] border-navy bg-sunny px-4 py-2 font-body text-sm font-bold text-navy hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileDown size={16} />
            )}
            Export Excel
          </button>
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

          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              &nbsp;
            </span>
            <button
              type="button"
              onClick={() => setShowDuplicatesOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border-[3px] px-4 py-2 font-body text-sm font-semibold ${
                showDuplicatesOnly
                  ? "border-coral bg-coral text-white"
                  : "border-navy bg-white text-navy hover:bg-coral/10 hover:border-coral hover:text-coral"
              }`}
            >
              <CopyCheck size={14} />
              Hanya Duplikat
              {duplicateCount > 0 && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    showDuplicatesOnly
                      ? "bg-white/25 text-white"
                      : "bg-coral/15 text-coral"
                  }`}
                >
                  {duplicateCount}
                </span>
              )}
            </button>
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
              <table className="w-full min-w-[850px] border-collapse text-left">
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
                  {filtered.map((peserta, idx) => {
                    const isDup = isDuplicateRow(peserta);
                    return (
                      <tr
                        key={peserta.id}
                        className={`border-b border-navy/10 hover:bg-sand/10 ${
                          isDup ? "bg-coral/5" : ""
                        }`}
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
                          <span className="inline-flex items-center gap-1.5">
                            {peserta.no_wa}
                            {isDup && (
                              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold text-coral">
                                Duplikat
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-navy/70">
                          {peserta.event_title}
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-navy/50">
                          {new Date(peserta.created_at).toLocaleString(
                            "id-ID",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
