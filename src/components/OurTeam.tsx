import Image from "next/image";
import {
  Starfish,
  Hibiscus,
  Sparkle,
  SunBurst,
  BubbleField,
} from "@/components/icons/SummerIcons";

type TeamMember = {
  name: string;
  department: string;
  role: string;
  photo: string;
  badge: "sunny" | "coral" | "mint" | "sky";
};

// Urutan: [kiri-atas, tengah-atas, kanan-atas, kiri-bawah, tengah-bawah, kanan-bawah]
const TEAM: TeamMember[] = [
  {
    name: "Tiara Andriani Isnawati",
    department: "Department of Food Science & Technology",
    role: "Secretary",
    photo: "/images/Member/tya.png",
    badge: "mint",
  },
  {
    name: "Christian Hadi Candra",
    department: "Department of Informatics Engineering",
    role: "Leader",
    photo: "/images/Member/chess.png",
    badge: "coral",
  },
  {
    name: "Aylira Natasha Susanto",
    department: "Department of Informatics Engineering",
    role: "Treasurer",
    photo: "/images/Member/ay.png",
    badge: "sunny",
  },
  {
    name: "Muhammad Rizki Juniardi",
    department: "Department of Informatics Engineering",
    role: "Technical Lead",
    photo: "/images/Member/jun.png",
    badge: "sky",
  },
  {
    name: "Linda Julivia",
    department: "Department of Architecture",
    role: "Creative Lead",
    photo: "/images/Member/lyn.png",
    badge: "sky",
  },
  {
    name: "Hendru Elban Anshori",
    department: "Department of Food Science & Technology",
    role: "Public Relation",
    photo: "/images/Member/hen.png",
    badge: "mint",
  },
];

// offset vertikal tiap kartu biar zigzag kaya honeycomb
// pakai margin-top (bukan translate) supaya tinggi section ikut menyesuaikan,
// jadi kartu paling bawah nggak kepotong sama overflow-hidden section
const OFFSET_Y = [
  "sm:mt-16", // kiri-atas
  "sm:mt-0", // tengah-atas (paling naik)
  "sm:mt-16", // kanan-atas
  "sm:mt-12", // kiri-bawah
  "sm:mt-28", // tengah-bawah
  "sm:mt-12", // kanan-bawah
];

const BADGE_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-sunny text-navy",
  coral: "bg-coral text-white",
  mint: "bg-mint text-navy",
  sky: "bg-sky text-white",
};

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="neo-card relative flex w-full max-w-[240px] flex-col items-center overflow-visible rounded-3xl bg-white px-5 pb-5">
      {/* spacer: ngasih "jatah tempat" buat foto yang nongol ke atas */}
      <div className="relative h-[210px] w-full sm:h-[240px]">
        {/* frame dekoratif sand, ukurannya tetap sama kaya sebelumnya */}
        <div className="neo-border absolute inset-x-0 bottom-0 h-[150px] rounded-2xl bg-sand sm:h-[170px]" />

        {/* foto — lebih besar dari frame, nongol ke atas, TAPI tetap di dalam area spacer */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[210px] w-[180px] sm:h-[240px] sm:w-[210px]">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-contain object-bottom drop-shadow-[3px_5px_0_rgba(13,43,78,0.2)]"
          />
        </div>
      </div>

      <h3 className="relative z-10 mt-4 text-center font-pixel text-sm leading-snug text-navy [text-shadow:1px_1px_0_#FFC93C] sm:text-base">
        {member.name}
      </h3>

      <p className="relative z-10 mt-2 text-center font-body text-[10px] uppercase leading-relaxed tracking-wide text-navy/60 sm:text-xs">
        {member.department}
      </p>

      <span
        className={`neo-shadow-sm relative z-10 mt-3 inline-block rounded-full border-3 border-navy px-5 py-1.5 text-center font-pixel text-[10px] sm:text-xs ${BADGE_BG[member.badge]}`}
      >
        {member.role.toUpperCase()}
      </span>
    </div>
  );
}

export default function OurTeam() {
  return (
    <section
      id="our-team"
      className="relative w-full overflow-hidden bg-[#DFF3FB] pb-32 pt-32 sm:pb-56 sm:pt-40"
    >
      {/* Gelembung ambient, konsisten sama Hero */}
      <BubbleField />

      {/* Dekorasi summer */}
      <SunBurst className="pointer-events-none absolute right-10 top-10 hidden w-14 rotate-12 sm:block" />
      <Starfish className="pointer-events-none absolute -left-2 top-1/3 hidden w-16 -rotate-12 md:block" />
      <Hibiscus className="pointer-events-none absolute -right-2 bottom-24 hidden w-20 rotate-6 md:block" />

      <div className="relative z-10 mx-auto w-[92%] max-w-5xl px-4 text-center">
        <span className="neo-pill mb-4 inline-block w-fit rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          KKN International Summer Batch 2026
        </span>

        <h2 className="relative mx-auto font-pixel text-3xl leading-[1.15] text-navy [text-shadow:2px_2px_0_#FFC93C,4px_4px_0_#0D2B4E1a] sm:text-5xl">
          MEET OUR
          <span className="relative block text-sky [text-shadow:2px_2px_0_#0D2B4E]">
            TEAM
            <Sparkle className="absolute -right-8 top-0 h-5 w-5 sm:-right-10 sm:h-7 sm:w-7" />
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-relaxed text-navy/80 sm:text-base">
          Six sixth-semester students from diverse academic backgrounds, united
          by a shared commitment to growth, collaboration, and social impact.
        </p>

        {/* Grid 3 kolom, kartu tengah lebih naik (efek zigzag/honeycomb) */}
        <div className="mt-16 grid grid-cols-1 items-start justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-y-10">
          {TEAM.map((member, i) => (
            <div key={member.name} className={OFFSET_Y[i]}>
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider bawah, konsisten sama Hero */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 z-30 text-white">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-12 w-full sm:h-20 lg:h-28"
        >
          <path
            fill="currentColor"
            d="M0,60 C240,10 480,110 720,70 C960,30 1200,100 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
