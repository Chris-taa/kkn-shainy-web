"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, CalendarClock, Download, Copy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import ExcelJS from "exceljs";

type EventStatus = "not_open" | "open" | "closed";

type EventRow = {
  id: string;
  title: string;
  status: EventStatus;
  event_date: string | null;
  location: string | null;
  capacity: number;
};

const STATUS_LABEL: Record<EventStatus, string> = {
  not_open: "Belum Open",
  open: "Register",
  closed: "Closed",
};

const STATUS_STYLE: Record<EventStatus, string> = {
  not_open: "bg-sunny text-navy",
  open: "bg-mint text-navy",
  closed: "bg-coral text-white",
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setEvents(data as EventRow[]);
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
      fetchEvents();
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/admin/login");
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [router, fetchEvents]);

  const handleStatusChange = async (id: string, status: EventStatus) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e)),
      );
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // Cari judul event yang muncul lebih dari sekali (dibandingkan tanpa peduli besar/kecil huruf & spasi)
  const duplicateTitles = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((ev) => {
      const key = ev.title.trim().toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key),
    );
  }, [events]);

  const isDuplicate = (ev: EventRow) =>
    duplicateTitles.has(ev.title.trim().toLowerCase());

  const visibleEvents = showDuplicatesOnly
    ? events.filter(isDuplicate)
    : events;

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Shainy Admin";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Events", {
        views: [{ state: "frozen", ySplit: 1 }], // header tetap keliatan pas scroll
      });

      sheet.columns = [
        { header: "Judul Event", key: "title", width: 38 },
        { header: "Status", key: "status", width: 16 },
        { header: "Tanggal", key: "date", width: 18 },
        { header: "Lokasi", key: "location", width: 32 },
        { header: "Kapasitas", key: "capacity", width: 12 },
        { header: "Duplikat?", key: "duplicate", width: 12 },
      ];

      // Style header
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1A2238" }, // navy
      };
      headerRow.alignment = { vertical: "middle", horizontal: "left" };
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF1A2238" } },
          bottom: { style: "thin", color: { argb: "FF1A2238" } },
          left: { style: "thin", color: { argb: "FF1A2238" } },
          right: { style: "thin", color: { argb: "FF1A2238" } },
        };
      });

      // Isi data
      events.forEach((ev) => {
        const duplicate = isDuplicate(ev);
        const row = sheet.addRow({
          title: ev.title,
          status: STATUS_LABEL[ev.status],
          date: ev.event_date ?? "-",
          location: ev.location ?? "-",
          capacity: ev.capacity,
          duplicate: duplicate ? "Ya" : "Tidak",
        });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFDDE3EA" } },
            bottom: { style: "thin", color: { argb: "FFDDE3EA" } },
            left: { style: "thin", color: { argb: "FFDDE3EA" } },
            right: { style: "thin", color: { argb: "FFDDE3EA" } },
          };
          cell.alignment = { vertical: "middle" };
        });

        // Highlight kuning-merah muda buat baris yang duplikat
        if (duplicate) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFE4E4" },
            };
          });
          row.getCell("duplicate").font = {
            bold: true,
            color: { argb: "FFD64545" },
          };
        }

        // Warnain teks status sesuai kondisi
        const statusCell = row.getCell("status");
        if (ev.status === "open") {
          statusCell.font = { bold: true, color: { argb: "FF1F9D66" } };
        } else if (ev.status === "closed") {
          statusCell.font = { bold: true, color: { argb: "FFD64545" } };
        } else {
          statusCell.font = { bold: true, color: { argb: "FF9A7B1F" } };
        }
      });

      // Auto-filter di header biar bisa disortir/filter langsung di Excel
      sheet.autoFilter = {
        from: "A1",
        to: `F${events.length + 1}`,
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `daftar-event-${today}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
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

      <div className="relative mx-auto w-[92%] max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-2xl text-navy">Kelola Event</h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              Atur status event yang tampil di website
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={events.length === 0 || exporting}
              className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-mint px-4 py-2 font-body text-sm font-semibold text-navy disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {exporting ? "Membuat file..." : "Export Excel"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>

        {/* Filter cari duplikat */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDuplicatesOnly((prev) => !prev)}
            className={`neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy px-4 py-2 font-body text-xs font-semibold transition-colors ${
              showDuplicatesOnly ? "bg-coral text-white" : "bg-white text-navy"
            }`}
          >
            <Copy size={14} />
            {showDuplicatesOnly ? "Menampilkan duplikat saja" : "Cari Duplikat"}
          </button>
          {duplicateTitles.size > 0 && (
            <span className="font-body text-xs font-semibold text-coral">
              Ditemukan {duplicateTitles.size} judul event yang duplikat
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-navy/40" />
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="neo-card flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-16 text-center">
              <CalendarClock size={32} className="text-navy/30" />
              <p className="font-body text-sm font-semibold text-navy/50">
                {showDuplicatesOnly
                  ? "Tidak ada event duplikat."
                  : "Belum ada event terdaftar."}
              </p>
            </div>
          ) : (
            visibleEvents.map((ev) => (
              <div
                key={ev.id}
                className={`neo-card rounded-2xl bg-white p-5 sm:p-6 ${
                  isDuplicate(ev) ? "ring-2 ring-coral" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-body text-base font-bold text-navy">
                        {ev.title}
                      </p>
                      {isDuplicate(ev) && (
                        <span className="neo-pill rounded-full bg-coral px-2.5 py-0.5 font-pixel text-[9px] text-white">
                          DUPLIKAT
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-navy/50">
                      {ev.event_date} · {ev.location}
                    </p>
                    <p className="font-body text-xs text-navy/40">
                      Kapasitas: {ev.capacity}
                    </p>
                  </div>

                  <span
                    className={`neo-pill rounded-full px-3 py-1 font-pixel text-[10px] ${STATUS_STYLE[ev.status]}`}
                  >
                    {STATUS_LABEL[ev.status]}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t-[3px] border-dashed border-navy/15 pt-4">
                  <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50">
                    Ubah status:
                  </span>
                  <select
                    value={ev.status}
                    disabled={updatingId === ev.id}
                    onChange={(e) =>
                      handleStatusChange(ev.id, e.target.value as EventStatus)
                    }
                    className="rounded-full border-[3px] border-navy bg-white px-3 py-1.5 font-body text-xs font-semibold text-navy outline-none disabled:opacity-50"
                  >
                    <option value="not_open">Belum Open</option>
                    <option value="open">Register</option>
                    <option value="closed">Closed</option>
                  </select>
                  {updatingId === ev.id && (
                    <Loader2 size={14} className="animate-spin text-navy/40" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
