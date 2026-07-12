import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/* ===================================================================
   Ikon dekorasi summer — digambar langsung sebagai SVG (bukan file
   gambar) supaya tidak pernah "broken image" dan gampang diberi efek
   sticker/3D lewat drop-shadow keras (khas neobrutalism).
   =================================================================== */

function Starfish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`drop-shadow-[3px_3px_0_#0D2B4E] ${className}`}
      aria-hidden
    >
      <path
        d="M32 2 L38 22 L58 14 L44 30 L62 38 L41 40 L46 60 L32 46 L18 60 L23 40 L2 38 L20 30 L6 14 L26 22 Z"
        fill="#FFC93C"
        stroke="#0D2B4E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="3" fill="#0D2B4E" />
    </svg>
  );
}

function Hibiscus({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`drop-shadow-[3px_3px_0_#0D2B4E] ${className}`}
      aria-hidden
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="16"
          rx="10"
          ry="16"
          fill="#FF6F61"
          stroke="#0D2B4E"
          strokeWidth="2.5"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="7" fill="#FFC93C" stroke="#0D2B4E" strokeWidth="2.5" />
    </svg>
  );
}

function Surfboard({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 140"
      className={`drop-shadow-[3px_3px_0_#0D2B4E] ${className}`}
      aria-hidden
    >
      <path
        d="M20 2 C34 2 38 40 38 70 C38 100 34 138 20 138 C6 138 2 100 2 70 C2 40 6 2 20 2 Z"
        fill="#6FD6C4"
        stroke="#0D2B4E"
        strokeWidth="2.5"
      />
      <path
        d="M20 12 C20 50 20 90 20 128"
        stroke="#0D2B4E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 45 C20 40 20 40 32 45"
        stroke="#FFC93C"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SunBurst({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`drop-shadow-[3px_3px_0_#0D2B4E] ${className}`}
      aria-hidden
    >
      <circle cx="32" cy="32" r="14" fill="#FFC93C" stroke="#0D2B4E" strokeWidth="2.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <rect
            key={i}
            x="30"
            y="2"
            width="4"
            height="12"
            rx="2"
            fill="#FFC93C"
            stroke="#0D2B4E"
            strokeWidth="1.5"
            transform={`rotate(${angle} 32 32)`}
          />
        );
      })}
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="#FFC93C"
      />
    </svg>
  );
}

/* Gelembung "summer" digambar pakai div bulat + gradient, bukan file gambar */
function BubbleField() {
  const bubbles = [
    { top: "8%", left: "6%", size: 18, opacity: 0.5 },
    { top: "18%", left: "42%", size: 10, opacity: 0.4 },
    { top: "30%", left: "70%", size: 14, opacity: 0.5 },
    { top: "55%", left: "12%", size: 12, opacity: 0.4 },
    { top: "70%", left: "88%", size: 20, opacity: 0.35 },
    { top: "85%", left: "35%", size: 9, opacity: 0.45 },
    { top: "40%", left: "92%", size: 8, opacity: 0.4 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 shadow-inner"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}

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
            KKN International Summer Batch 2025
          </span>

          <h1 className="relative font-pixel text-4xl leading-[1.15] text-navy [text-shadow:2px_2px_0_#FFC93C,4px_4px_0_#0D2B4E1a] sm:text-5xl md:text-6xl">
            Shainy
            <span className="relative inline-block text-sunny [text-shadow:2px_2px_0_#0D2B4E]">
              kita bareng!
              <svg
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 w-full text-navy"
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
            <Sparkle className="absolute -right-8 top-0 h-6 w-6 sm:-right-10 sm:h-8 sm:w-8" />
          </h1>

          <p className="mt-6 max-w-lg font-body text-sm leading-relaxed text-navy/80 sm:text-base">
            Shainy is a community service team under the collaboration with
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
              alt="Tim Shainy"
              fill
              className="object-cover"
            />
          </div>

          {/* Badge nama tim */}
          <div className="neo-shadow-sm absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-navy bg-sunny px-8 py-2">
            <span className="font-pixel text-lg text-white [text-shadow:1px_1px_0_#0D2B4E]">
              SHAINY
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