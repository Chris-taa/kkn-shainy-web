import type { Metadata } from "next";
import Store from "@/components/Store";

export const metadata: Metadata = {
  title: "Store | SHAini",
  description:
    "Belanja merchandise resmi SHAini — kaos, totebag, mug, dan keychain.",
};

export default function StorePage() {
  return (
    <div className="font-bold relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-4 pt-28">
      {/* Tekstur titik halus, konsisten dengan halaman utama */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />
      <div className="relative">
        <Store />
      </div>
    </div>
  );
}
