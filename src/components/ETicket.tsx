import { useEffect, useRef, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

type ETicketProps = {
  ticketId: string;
  nama: string;
  instansi: string;
  noWa: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  onClose: () => void;
};

export default function ETicket({
  ticketId,
  nama,
  instansi,
  noWa,
  eventTitle,
  eventDate,
  eventLocation,
  onClose,
}: ETicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    ticketId,
  )}`;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 100;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`e-tiket-${ticketId}.pdf`);
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (autoDownloaded) return;
    setAutoDownloaded(true);
    handleDownloadPDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="neo-pill mb-3 flex w-fit items-center gap-1.5 rounded-full bg-mint px-4 py-1.5">
        <CheckCircle2 size={14} className="text-navy" />
        <span className="font-pixel text-xs text-navy">
          Pendaftaran Berhasil!
        </span>
      </div>

      {/* Area yang di-capture jadi PDF */}
      <div
        ref={ticketRef}
        className="relative w-full overflow-hidden rounded-2xl border-[3px] border-navy bg-white shadow-[6px_6px_0px_0px_#1A2238]"
      >
        {/* Header gradient summer */}
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#FFE9B8_0%,#FFC93C_50%,#FF9F5A_100%)] px-5 pb-5 pt-4">
          <svg
            className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 opacity-90"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="#FFF4D6"
              stroke="#1A2238"
              strokeWidth="2.5"
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 50 + Math.cos(angle) * 28;
              const y1 = 50 + Math.sin(angle) * 28;
              const x2 = 50 + Math.cos(angle) * 37;
              const y2 = 50 + Math.sin(angle) * 37;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#1A2238"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <span className="relative font-body text-[9px] font-bold uppercase tracking-[0.15em] text-navy/70">
            ☀️ Official E-Ticket
          </span>

          <h4 className="relative mt-2 text-left font-pixel text-base leading-snug text-navy">
            {eventTitle}
          </h4>

          <div className="relative mt-2 flex flex-col gap-1 text-left font-body text-xs text-navy/80">
            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A2238"
                strokeWidth="2.2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 2v4M16 2v4" />
              </svg>
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A2238"
                strokeWidth="2.2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{eventLocation}</span>
            </div>
          </div>
        </div>

        {/* garis perforasi */}
        <div className="relative flex items-center">
          <div className="absolute -left-3 h-5 w-5 rounded-full bg-[#DFF3FB]" />
          <div className="h-0 flex-1 border-t-[3px] border-dashed border-navy/25" />
          <div className="absolute -right-3 h-5 w-5 rounded-full bg-[#DFF3FB]" />
        </div>

        {/* Body: data peserta + QR */}
        <div className="flex flex-col gap-3 px-5 py-4">
          <div className="flex flex-col gap-2 text-left">
            <div>
              <p className="font-body text-[9px] font-bold uppercase tracking-widest text-navy/40">
                Nama Peserta
              </p>
              <p className="font-body text-sm font-bold text-navy">{nama}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-body text-[9px] font-bold uppercase tracking-widest text-navy/40">
                  Instansi
                </p>
                <p className="font-body text-xs font-semibold text-navy">
                  {instansi}
                </p>
              </div>
              <div>
                <p className="font-body text-[9px] font-bold uppercase tracking-widest text-navy/40">
                  No. WhatsApp
                </p>
                <p className="font-body text-xs font-semibold text-navy">
                  {noWa}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 rounded-xl border-[3px] border-dashed border-navy/30 bg-sand/20 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR tiket ${ticketId}`}
              width={110}
              height={110}
              className="h-[110px] w-[110px]"
              crossOrigin="anonymous"
            />
            <p className="font-mono text-xs font-bold text-navy">{ticketId}</p>
            <p className="font-body text-[9px] text-navy/50">
              Tunjukkan QR ini saat check-in
            </p>
          </div>
        </div>

        {/* Footer strip */}
        <div className="bg-navy px-6 py-2 text-center">
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
            SHAinni
          </p>
        </div>
      </div>

      <p className="mt-3 font-body text-[11px] text-navy/50">
        {downloading
          ? "Lagi nyiapin PDF tiket kamu..."
          : "Tiket otomatis terdownload. Simpan sebagai bukti pendaftaran ya!"}
      </p>

      {downloadError && (
        <p className="mt-1 font-body text-[11px] font-semibold text-coral">
          Gagal download otomatis, coba tombol di bawah ya.
        </p>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-5 py-2 font-body text-xs font-bold text-navy disabled:opacity-50"
        >
          <Download size={14} />
          {downloading ? "Membuat PDF..." : "Download Lagi"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="neo-shadow-sm rounded-full border-[3px] border-navy bg-navy px-5 py-2 font-body text-xs font-bold text-white"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
