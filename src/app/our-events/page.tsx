import type { Metadata } from "next";
import OurEvents from "@/components/OurEvents";

export const metadata: Metadata = {
  title: "Our Events | Shainy",
  description:
    "Jadwal dan pendaftaran acara Shainy — Closing Ceremony dan Open Recruitment.",
};

export default function OurEventsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-4 pt-28">
      {/* Tekstur titik halus, konsisten dengan halaman utama */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />
      <div className="relative">
        <OurEvents />
      </div>
    </div>
  );
}
