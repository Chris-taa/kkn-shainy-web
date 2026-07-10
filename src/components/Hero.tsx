import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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

      {/* Bubble ambient (z-10) */}
      <Image
        src="/images/gambar_bubble.png"
        alt=""
        width={500}
        height={500}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover opacity-70 mix-blend-screen"
      />

      {/* Daun palem pojok kiri atas (z-20) */}
      <Image
        src="/images/gambar_daun_palem.png"
        alt=""
        width={220}
        height={220}
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-4 z-20 w-32 sm:w-44"
      />

      {/* 
        Konten Utama 
        PERUBAHAN: pt-32 diubah jadi pt-40, dan lg:pt-40 diubah jadi lg:pt-52 
        agar posisinya lebih turun dan tidak menabrak Navbar.
      */}
      <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 pb-12 pt-22 sm:px-10 lg:grid-cols-2 lg:gap-6 lg:pb-20 lg:pt-28">
        {/* Kolom teks */}
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-block w-fit rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy backdrop-blur-sm">
            KKN International Summer Batch 2025
          </span>

          <h1 className="font-pixel text-4xl leading-[1.15] text-navy sm:text-5xl md:text-6xl">
            Shainy
            <span className="relative inline-block text-sunny">
              kita bareng!
              <svg
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 w-full text-sunny"
                aria-hidden
              >
                <path
                  d="M2 12 C 60 2, 120 18, 180 8 S 260 4, 298 14"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-lg font-body text-sm leading-relaxed text-navy/80 sm:text-base">
            Shainy is a community service team under the collaboration with
            SNU-SR, organized by six seventh-semester students united by a
            shared commitment to growth, collaboration, and social impact.
            Coming from diverse academic backgrounds and areas of expertise,
            each member contributes unique skills and perspectives that
            strengthen our collective work.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#our-team"
              className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Our Team
              <ArrowUpRight size={16} />
            </a>
            <a
              href="#our-program"
              className="flex items-center gap-2 rounded-full border border-navy/20 bg-white/80 px-6 py-3 text-sm font-semibold text-navy backdrop-blur-sm transition-transform hover:-translate-y-0.5"
            >
              Our Program
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Kolom foto tim */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-full border-4 border-white/80 shadow-2xl">
            <Image
              src="/images/gambar_tim_bareng.png"
              alt="Tim Hamkke Bareng"
              fill
              className="object-cover"
            />
          </div>

          {/* Badge nama tim */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-sunny px-8 py-2 shadow-lg">
            <span className="font-pixel text-lg text-white [text-shadow:1px_1px_0_#0D2B4E]">
              SHAINY
            </span>
          </div>

          {/* Dekorasi bintang laut & bunga */}
          <Image
            src="/images/gambar_bintang_laut.png"
            alt=""
            width={70}
            height={70}
            aria-hidden
            className="pointer-events-none absolute -left-4 top-16 w-14 rotate-[-12deg] sm:w-16"
          />
          <Image
            src="/images/gambar_bunga_anggrek.png"
            alt=""
            width={90}
            height={90}
            aria-hidden
            className="pointer-events-none absolute -right-6 top-6 w-20 rotate-6 sm:w-24"
          />
          <Image
            src="/images/gambar_papan_selancar.png"
            alt=""
            width={70}
            height={200}
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-10 hidden w-16 sm:block"
          />
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
    </section>
  );
}
