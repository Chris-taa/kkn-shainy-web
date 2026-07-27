"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, CheckCircle2, Circle, FileDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  Header,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  HeightRule,
} from "docx";

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
  // simpan id yang lagi diproses biar tombolnya bisa dikasih loading state per-baris
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("nama", { ascending: true }); // urut A-Z

    if (!error && data) setList(data as Registration[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return list
      .filter((r) => {
        if (onlyNotYet && r.checked_in) return false;
        const q = search.trim().toLowerCase();
        if (
          q &&
          !r.nama.toLowerCase().includes(q) &&
          !r.instansi.toLowerCase().includes(q) &&
          !r.ticket_id.toLowerCase().includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama, "id")); // jaga-jaga tetap A-Z
  }, [list, search, onlyNotYet]);

  const totalHadir = list.filter((r) => r.checked_in).length;

  // ==== TOGGLE ABSEN (klik langsung di tabel) ====
  const handleToggleCheckIn = async (r: Registration) => {
    const newStatus = !r.checked_in;
    const newTimestamp = newStatus ? new Date().toISOString() : null;

    setUpdatingIds((prev) => new Set(prev).add(r.id));

    // optimistic update biar responsif waktu dipakai buat ngabsen rame-rame
    setList((prev) =>
      prev.map((item) =>
        item.id === r.id
          ? { ...item, checked_in: newStatus, checked_in_at: newTimestamp }
          : item,
      ),
    );

    const { error } = await supabase
      .from("registrations")
      .update({ checked_in: newStatus, checked_in_at: newTimestamp })
      .eq("id", r.id);

    if (error) {
      // revert kalau gagal
      setList((prev) =>
        prev.map((item) =>
          item.id === r.id
            ? {
                ...item,
                checked_in: r.checked_in,
                checked_in_at: r.checked_in_at,
              }
            : item,
        ),
      );
      alert("Gagal update status hadir: " + error.message);
    }

    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.delete(r.id);
      return next;
    });
  };

  // Ganti dua baris ini sesuai event yang lagi jalan (belum ada field-nya di tabel registrations)
  const EVENT_INFO = {
    venue: "Gedung Dome H. Sunarpi, University of Mataram",
    date: "Monday, July 27th 2026",
  };

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" };

  // ==== EXPORT WORD (.docx) pakai library docx: kop surat + logo berulang tiap halaman ====
  const handleExport = async () => {
    // ambil logo (taruh unram.png & scube.png di folder /public)
    let unramBuffer: ArrayBuffer | null = null;
    let scubeBuffer: ArrayBuffer | null = null;
    try {
      const [unramRes, scubeRes] = await Promise.all([
        fetch("/images/unram.png"),
        fetch("/images/scube.png"),
      ]);
      unramBuffer = await unramRes.arrayBuffer();
      scubeBuffer = await scubeRes.arrayBuffer();
    } catch (err) {
      console.warn("Gagal memuat logo untuk export:", err);
    }

    const headerTextLines: { text: string; bold?: boolean; size?: number }[] = [
      {
        text: "KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI",
        size: 22,
      },
      { text: "UNIVERSITAS MATARAM", size: 26 },
      { text: "FAKULTAS TEKNIK", size: 22 },
      {
        text: "SAMICK-SEOUL NATIONAL UNIVERSITY-SUSTAINABILITY (S-CUBE) CENTER",
        size: 20,
      },
      { text: "Gedung A Fakultas Teknik Lt. 3", bold: false, size: 18 },
      {
        text: "Jl. Majapahit No.62 Mataram, Nusa Tenggara Barat, Indonesia 83125",
        bold: false,
        size: 18,
      },
      {
        text: "email: scube@unram.ac.id   IG: @scubecenter",
        bold: false,
        size: 18,
      },
    ];

    // logo kiri, teks kop surat di tengah, logo kanan -> disusun pakai tabel tanpa border
    const kopSuratTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: unramBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: unramBuffer,
                          type: "png",
                          transformation: { width: 70, height: 70 },
                        }),
                      ],
                    }),
                  ]
                : [new Paragraph("")],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: headerTextLines.map(
                (line) =>
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: line.text,
                        bold: line.bold ?? true,
                        size: line.size ?? 20,
                      }),
                    ],
                  }),
              ),
            }),
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: scubeBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: scubeBuffer,
                          type: "png",
                          transformation: { width: 70, height: 70 },
                        }),
                      ],
                    }),
                  ]
                : [new Paragraph("")],
            }),
          ],
        }),
      ],
    });

    // garis pembatas di bawah kop surat
    const dividerParagraph = new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
      },
      children: [new TextRun("")],
    });

    // ==== JUDUL ATTENDEE LIST (cuma di halaman pertama, bukan di header) ====
    const eventName = filtered[0]?.event_title ?? "Event";
    const titleParagraphs = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [
          new TextRun({ text: "ATTENDEE LIST", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: eventName.toUpperCase(), bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: EVENT_INFO.venue, size: 20 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [new TextRun({ text: EVENT_INFO.date, size: 20 })],
      }),
    ];

    // ==== TABEL ABSENSI: No, Name, Institution, Signature ====
    const cellBorders = {
      top: thinBorder,
      bottom: thinBorder,
      left: thinBorder,
      right: thinBorder,
    };

    const headerCell = (text: string) =>
      new TableCell({
        borders: cellBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text, bold: true, size: 20 })],
          }),
        ],
      });

    const dataCell = (text: string, align = AlignmentType.LEFT) =>
      new TableCell({
        borders: cellBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: align,
            children: [new TextRun({ text, size: 20 })],
          }),
        ],
      });

    const tableHeaderRow = new TableRow({
      tableHeader: true, // biar baris judul kolom ini ikut berulang tiap halaman
      children: [
        headerCell("No"),
        headerCell("Name"),
        headerCell("Institution"),
        headerCell("Signature"),
      ],
    });

    const dataRows = filtered.map(
      (r, idx) =>
        new TableRow({
          height: { value: 500, rule: HeightRule.ATLEAST },
          children: [
            dataCell(String(idx + 1), AlignmentType.CENTER as any),
            dataCell(r.nama),
            dataCell(r.instansi),
            dataCell(""), // kosong buat ttd manual
          ],
        }),
    );

    const attendanceTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [800, 4200, 3000, 2600],
      rows: [tableHeaderRow, ...dataRows],
    });

    // ==== SUSUN DOKUMEN, header (kop surat) otomatis muncul di tiap halaman ====
    const doc = new Document({
      sections: [
        {
          properties: {
            page: { margin: { top: 700, bottom: 700, left: 900, right: 900 } },
          },
          headers: {
            default: new Header({
              children: [kopSuratTable, dividerParagraph],
            }),
          },
          children: [...titleParagraphs, attendanceTable],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendee-List-${new Date().toISOString().slice(0, 10)}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative mx-auto w-[95%] max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-pixel text-xl text-navy">Daftar Peserta</h1>
          <p className="font-body text-xs text-navy/50">
            Menampilkan {filtered.length} dari {list.length} peserta terdaftar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="neo-pill rounded-full bg-mint px-3 py-1 font-body text-xs font-bold text-navy">
            {totalHadir} / {list.length} Hadir
          </span>
          <button
            onClick={handleExport}
            className="neo-pill flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5 font-body text-xs font-bold text-navy"
          >
            <FileDown size={14} />
            Export Word
          </button>
        </div>
      </div>

      <div className="neo-card mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, instansi, atau ticket id..."
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

      <div className="neo-card mt-4 overflow-x-auto rounded-2xl bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-navy/40" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center font-body text-sm text-navy/40">
            Gak ada peserta yang cocok.
          </p>
        ) : (
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b-2 border-navy/10 bg-cream/60 font-body text-xs font-bold uppercase text-navy/60">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Instansi</th>
                <th className="px-4 py-3">No WA</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {filtered.map((r, idx) => {
                const isUpdating = updatingIds.has(r.id);
                return (
                  <tr key={r.id} className="font-body text-sm text-navy">
                    <td className="px-4 py-3 text-navy/40">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-navy/70">
                      {r.ticket_id}
                    </td>
                    <td className="px-4 py-3 font-bold">{r.nama}</td>
                    <td className="px-4 py-3 text-navy/60">{r.instansi}</td>
                    <td className="px-4 py-3 text-navy/60">{r.no_wa}</td>
                    <td className="px-4 py-3 text-navy/60">{r.event_title}</td>
                    <td className="px-4 py-3">
                      {r.checked_in ? (
                        <span
                          className="flex items-center gap-1 text-xs font-semibold"
                          style={{ color: "#1a9b7f" }}
                        >
                          <CheckCircle2 size={14} />
                          Hadir
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-navy/30">
                          <Circle size={14} />
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCheckIn(r)}
                        disabled={isUpdating}
                        className={`neo-pill rounded-full px-3 py-1 text-xs font-bold disabled:opacity-50 ${
                          r.checked_in
                            ? "bg-navy/10 text-navy/60"
                            : "bg-mint text-navy"
                        }`}
                      >
                        {isUpdating ? "..." : r.checked_in ? "Batal" : "Absen"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
