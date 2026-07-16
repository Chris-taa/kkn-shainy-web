import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Starfish,
  Hibiscus,
  Surfboard,
  SunBurst,
  Sparkle,
  BubbleField,
} from "@/components/icons/SummerIcons";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background: laut + langit (z-0) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gambar_laut.jpg"
          alt="Beach background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Gelembung ambient, digambar via CSS (z-10) */}
      <BubbleField />

      {/* Daun palem pojok kiri atas (z-20) */}
      <Image
        src="/images/gambar_daun_palem.png"
        alt=""
        width={220}
        height={220}
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-4 z-20 w-32 sm:w-44"
      />

      {/* Sun burst kecil di pojok kanan atas, ganti sparkle lama */}
      <SunBurst className="pointer-events-none absolute right-16 top-8 z-20 hidden w-12 rotate-12 sm:block" />

      <div className="relative z-20 mx-auto grid w-[92%] max-w-6xl grid-cols-1 gap-10 px-4 pb-12 pt-22 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:pb-20 lg:pt-28">
        {/* Kolom teks */}
        <div className="relative flex flex-col justify-center">
          <span className="neo-pill mb-4 inline-block w-fit rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy">
            KKN International Summer Batch 2026
          </span>

          <h1 className="relative font-pixel text-4xl leading-[1.15] text-navy [text-shadow:2px_2px_0_#FFC93C,4px_4px_0_#0D2B4E1a] sm:text-5xl md:text-6xl">
            SHAinni
            <span className="relative block text-sky [text-shadow:2px_2px_0_#0D2B4E]">
              UNRAMTEAM
            </span>
            <Sparkle className="absolute -right-8 top-0 h-6 w-6 sm:-right-10 sm:h-8 sm:w-8" />
          </h1>

          <p className="mt-6 max-w-lg font-body text-sm leading-relaxed text-navy/80 sm:text-base">
            SHAinni is a community service team under the collaboration with
            SNU-SR, organized by six seventh-semester students united by a
            shared commitment to growth, collaboration, and social impact.
            Coming from diverse academic backgrounds and areas of expertise,
            each member contributes unique skills and perspectives that
            strengthen our collective work.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#our-team"
              className="neo-card flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
            >
              Our Team
              <ArrowUpRight size={16} />
            </a>
            <a
              href="#our-program"
              className="neo-card flex items-center gap-2 rounded-full bg-sunny px-6 py-3 text-sm font-semibold text-navy"
            >
              Our Program
              <ArrowUpRight size={16} />
            </a>
          </div>

          {/* Papan selancar bersandar di bawah kolom teks (ganti versi gambar lama) */}
          <Surfboard className="pointer-events-none absolute -bottom-20 left-6 z-0 hidden w-9 -rotate-12 sm:block lg:hidden xl:block" />
        </div>

        {/* Kolom foto tim */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          {/* Lapisan "shadow card" di belakang foto untuk kesan 3D bertumpuk */}
          <div className="absolute inset-0 m-auto aspect-[4/5] h-fit w-full max-w-sm translate-x-3 translate-y-3 rounded-t-full bg-sunny" />

          <div className="neo-shadow relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-full border-4 border-navy">
            <Image
              src="/images/gambar_tim_bareng.png"
              alt="Tim SHAinni"
              fill
              className="object-cover"
            />
          </div>

          {/* Badge nama tim */}
          <div className="neo-shadow-sm absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-navy bg-sunny px-8 py-2">
            <span className="font-pixel text-lg text-white [text-shadow:1px_1px_0_#0D2B4E]">
              SHAinni
            </span>
          </div>

          {/* Dekorasi bintang laut & bunga, sekarang SVG (gak pernah broken) */}
          <Starfish className="pointer-events-none absolute -left-2 top-16 w-14 -rotate-12 sm:w-16" />
          <Hibiscus className="pointer-events-none absolute -right-2 top-4 w-16 rotate-6 sm:w-20" />
          <Surfboard className="pointer-events-none absolute -right-4 bottom-8 hidden w-14 rotate-6 sm:block" />
        </div>
      </div>

      {/* Daun monstera pojok kanan bawah (z-20) */}
      <Image
        src="/images/gambar_daun_monstera.png"
        alt=""
        width={220}
        height={220}
        aria-hidden
        className="pointer-events-none absolute -right-0 bottom-0 z-20 hidden w-40 sm:block"
      />

      {/* Wave divider: melebur foto laut ke warna background halaman (z-30, paling atas) */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 z-30 text-[#DFF3FB]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-16 w-full sm:h-24 lg:h-32"
        >
          <path
            fill="currentColor"
            d="M0,60 C240,110 480,10 720,50 C960,90 1200,20 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
