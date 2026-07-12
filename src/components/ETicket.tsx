import { Calendar, MapPin } from "lucide-react";

type ETicketProps = {
  ticketId: string;
  nama: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  onClose: () => void;
};

export default function ETicket({
  ticketId,
  nama,
  eventTitle,
  eventDate,
  eventLocation,
  onClose,
}: ETicketProps) {
  // QR sederhana lewat layanan gratis (tanpa perlu install library QR).
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    ticketId
  )}`;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="neo-pill mb-4 w-fit rounded-full bg-mint px-4 py-1.5">
        <span className="font-pixel text-xs text-navy">
          Pendaftaran Berhasil!
        </span>
      </div>

      <div className="neo-card w-full overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#FFE1A8_0%,#FFC93C_100%)]">
        <div className="flex flex-col items-center gap-1 px-6 pt-6">
          <p className="font-body text-[11px] font-semibold uppercase tracking-widest text-navy/70">
            E-Tiket
          </p>
          <h4 className="font-pixel text-base text-navy">{eventTitle}</h4>
        </div>

        <div className="mx-6 my-4 flex flex-col items-center gap-2 rounded-xl border-[3px] border-dashed border-navy/40 bg-white/70 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR tiket ${ticketId}`}
            width={120}
            height={120}
            className="h-28 w-28"
          />
          <p className="font-pixel text-xs text-navy">{ticketId}</p>
        </div>

        <div className="flex flex-col gap-1.5 px-6 pb-6 text-left font-body text-sm text-navy">
          <p className="font-bold">{nama}</p>
          <div className="flex items-center gap-2 text-navy/80">
            <Calendar size={14} className="shrink-0" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-navy/80">
            <MapPin size={14} className="shrink-0" />
            <span>{eventLocation}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 font-body text-xs text-navy/50">
        Screenshot atau simpan halaman ini sebagai bukti pendaftaran kamu.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="neo-shadow-sm mt-5 rounded-full border-[3px] border-navy bg-navy px-6 py-2.5 font-body text-sm font-bold text-white"
      >
        Selesai
      </button>
    </div>
  );
}