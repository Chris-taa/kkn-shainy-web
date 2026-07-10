import Image from "next/image";

// 1. INI YANG BIKIN MERAHNYA HILANG (TypeScript Interface)
interface EventCardProps {
  badgeText: string;
  imageSrc: string;
  imageAlt?: string; // Tanda tanya (?) berarti opsional
  title: string;
  subtitle: string;
  note?: string;
  eventDateLabel?: string;
  eventDate: string;
  locationText: string;
  registeredCount?: string;
  buttonText: string;
  buttonStatus?: "open" | "closed";
}

// 2. Hubungkan interface di atas ke dalam fungsi komponen ini (: EventCardProps)
export default function EventCard({
  badgeText,
  imageSrc,
  imageAlt = "Event Image",
  title,
  subtitle,
  note,
  eventDateLabel = "Event date:",
  eventDate,
  locationText,
  registeredCount,
  buttonText,
  buttonStatus = "open", // 'open' | 'closed'
}: EventCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-lg rounded-[2.5rem] bg-[#78A4D8] p-6 pb-12 pt-10 shadow-lg sm:p-8 sm:pb-14 sm:pt-12">
      {/* Top Badge */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E8F0FA] px-8 py-2.5 text-sm font-extrabold tracking-wide text-[#0D2B4E] shadow-md sm:text-base">
        {badgeText}
      </div>

      {/* Image Thumbnail */}
      <div className="relative mb-6 w-full overflow-hidden rounded-3xl bg-white/20 pt-[50%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-6 text-white sm:flex-row sm:gap-4">
        {/* Kolom Kiri: Judul & Catatan */}
        <div className="flex flex-1 flex-col">
          <h3 className="mb-1 text-2xl font-bold leading-tight">{title}</h3>
          <p className="mb-2 text-sm text-white/90">{subtitle}</p>
          {note && (
            <p className="pr-2 text-xs font-medium italic leading-relaxed text-[#FDE047]">
              {note}
            </p>
          )}
        </div>

        {/* Kolom Kanan: Tanggal & Lokasi */}
        <div className="flex flex-1 flex-col sm:items-end sm:text-right">
          <p className="mb-0.5 text-sm text-white/90">{eventDateLabel}</p>
          <p className="mb-1 text-lg font-bold">{eventDate}</p>
          
          {/* Memisahkan teks lokasi dengan line break jika ada */}
          <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-white/90">
            {locationText}
          </p>

          {registeredCount && (
            <div className="mt-auto inline-block rounded-full bg-[#96BEE6] px-4 py-1.5 text-xs font-bold text-white">
              {registeredCount}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Button */}
      <button
        disabled={buttonStatus === "closed"}
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full px-12 py-3.5 font-bold tracking-wide text-white shadow-xl transition-transform hover:-translate-y-1 ${
          buttonStatus === "closed"
            ? "cursor-not-allowed bg-[#6B7280] hover:translate-y-0"
            : "bg-[#0D2B4E]"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}