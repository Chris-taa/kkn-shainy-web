import Image from "next/image";

type Program = {
  title: string;
  description: string;
  image: string;
  mascot: string;
  accent: "sunny" | "coral" | "mint";
};

const PROGRAMS: Program[] = [
  {
    title: "Basic Korean",
    description: "Learn Hangul and everyday beginner conversations.",
    image: "/images/basic korean.png",
    mascot: "/images/gambar_basic.png",
    accent: "sunny",
  },
  {
    title: "EPS TOPIK",
    description: "Focused EPS-TOPIK exam prep with targeted practice.",
    image: "/images/eps.png",
    mascot: "/images/gambar_eps.png",
    accent: "coral",
  },
  {
    title: "Korean for Tourism",
    description: "Practical Korean for travel and tourism services.",
    image: "/images/kft.png",
    mascot: "/images/gambar_kft.png",
    accent: "mint",
  },
  {
    title: "Korean for Business",
    description:
      "Professional Korean for workplace and business communication.",
    image: "/images/kfb.png",
    mascot: "/images/gambar_kfb.png",
    accent: "sunny",
  },
  {
    title: "Digital Business",
    description:
      "Build and grow a business through digital marketing strategies.",
    image: "/images/dibi.png",
    mascot: "/images/gambar_db.png",
    accent: "coral",
  },
];

const ACCENT_BG: Record<Program["accent"], string> = {
  sunny: "bg-sunny",
  coral: "bg-coral",
  mint: "bg-mint",
};

function ProgramCard({
  program,
  gridClass,
}: {
  program: Program;
  gridClass: string;
}) {
  return (
    <div className={`relative ${gridClass}`}>
      {/* Badge judul mengambang di atas kartu */}
      <div className="neo-pill absolute -top-5 left-1/2 z-10 w-[85%] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-center">
        <span className="font-pixel text-xs text-navy sm:text-sm">
          {program.title.toUpperCase()}
        </span>
      </div>

      {/* Kartu utama */}
      <div className="neo-card relative flex h-full flex-col overflow-hidden rounded-3xl bg-white pt-8">
        <div className="relative mx-4 mt-2 aspect-[4/3] overflow-hidden rounded-2xl border-[3px] border-navy">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
          />
        </div>
        <p className="px-5 py-5 text-center font-body text-sm text-navy/80">
          {program.description}
        </p>

        {/* Maskot dino nempel di pojok kartu */}
        {/* Maskot dino nempel di pojok kartu */}
        <div
          className={`pointer-events-none absolute -right-4 -bottom-3 flex h-16 w-16 items-center justify-center rounded-full overflow-hidden ${ACCENT_BG[program.accent]} neo-shadow-sm border-[3px] border-navy sm:h-20 sm:w-20`}
        >
          <Image
            src={program.mascot}
            alt=""
            width={80} // Disesuaikan dengan ukuran maksimal sm:w-20 (80px)
            height={80}
            aria-hidden
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function OurProgram() {
  return (
    <section
      id="our-program"
      className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#9FCBEF_0%,#6FA9DE_100%)] px-6 py-16 sm:px-10"
    >
      {/* Dekorasi kotak-kotak kecil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(90deg,white_0,white_2px,transparent_2px,transparent_16px)]"
      />

      <div className="relative flex flex-col items-center">
        <div className="neo-pill mb-14 rounded-full bg-white px-8 py-3">
          <h2 className="font-pixel text-xl text-navy sm:text-2xl">
            Our Program
          </h2>
        </div>

        {/* Baris 1: 3 kartu */}
        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.slice(0, 3).map((program) => (
            <ProgramCard key={program.title} program={program} gridClass="" />
          ))}
        </div>

        {/* Baris 2: 2 kartu, di-center pakai grid 6 kolom di layar besar */}
        <div className="mt-14 grid w-full grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-6">
          <ProgramCard
            program={PROGRAMS[3]}
            gridClass="lg:col-span-2 lg:col-start-2"
          />
          <ProgramCard
            program={PROGRAMS[4]}
            gridClass="lg:col-span-2 lg:col-start-4"
          />
        </div>
      </div>
    </section>
  );
}
