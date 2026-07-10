import Hero from "@/components/Hero";
import WeekRecap from "@/components/WeekRecap";

export default function Home() {
  return (
    // Menggunakan tag <main> lebih baik secara semantik
    // Tambahkan 'relative' agar layout tetap terkontrol
    <main className="relative min-h-screen bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-4">
      <Hero />
      <WeekRecap />
    </main>
  );
}
