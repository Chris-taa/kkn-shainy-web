import Hero from "@/components/Hero";
import AboutKKN from "@/components/AboutKKN";
import OurProgram from "@/components/OurProgram";
import TotalParticipant from "@/components/TotalParticipant";

export default function Home() {
  return (
    // Bukan <main> di sini — layout.tsx sudah bungkus {children} dengan <main>,
    // dua tag <main> bersarang itu invalid di HTML.
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-4">
      {/* Tekstur titik halus supaya gap antar section gak terasa kosong/polos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />
      <div className="relative">
        <Hero />
        <AboutKKN />
        <OurProgram />
        <TotalParticipant />
      </div>
    </div>
  );
}
