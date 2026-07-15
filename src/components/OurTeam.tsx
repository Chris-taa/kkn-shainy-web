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
    name: "Muhammad Hazim Maulana",
    department: "Department of Informatics Engineering",
    role: "Technical Lead",
    photo: "/images/team/hazim.png",
    badge: "sky",
  },
  {
    name: "Muhammad Naufal Rahmatullah",
    department: "Department of Informatics Engineering",
    role: "Leader",
    photo: "/images/team/naufal.png",
    badge: "coral",
  },
  {
    name: "Lalu Muhammad Faqih Firmansyah",
    department: "Department of Architecture",
    role: "Creative Lead",
    photo: "/images/team/lalu.png",
    badge: "sky",
  },
  {
    name: "Fitry Wau",
    department: "Department of Food Science & Technology",
    role: "Secretary",
    photo: "/images/team/fitry.png",
    badge: "mint",
  },
  {
    name: "Nadya Azzahra",
    department: "Department of Informatics Engineering",
    role: "Treasurer",
    photo: "/images/team/nadya.png",
    badge: "sunny",
  },
  {
    name: "Revata Anwar",
    department: "Department of Food Science & Technology",
    role: "Public Relation",
    photo: "/images/team/revata.png",
    badge: "mint",
  },
];

// offset vertikal tiap kartu biar zigzag kaya honeycomb
const OFFSET_Y = [
  "sm:translate-y-16", // kiri-atas
  "sm:translate-y-0", // tengah-atas (paling naik)
  "sm:translate-y-16", // kanan-atas
  "sm:translate-y-28", // kiri-bawah
  "sm:translate-y-44", // tengah-bawah
  "sm:translate-y-28", // kanan-bawah
];

const BADGE_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-sunny text-navy",
  coral: "bg-coral text-white",
  mint: "bg-mint text-navy",
  sky: "bg-sky text-white",
};

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="neo-card relative flex w-full max-w-[240px] flex-col items-center rounded-3xl bg-white px-5 pb-5 pt-5">
      {/* foto */}
      <div className="neo-border relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-4 text-center font-pixel text-sm leading-snug text-navy [text-shadow:1px_1px_0_#FFC93C] sm:text-base">
        {member.name}
      </h3>

      <p className="mt-2 text-center font-body text-[10px] uppercase leading-relaxed tracking-wide text-navy/60 sm:text-xs">
        {member.department}
      </p>

      <span
        className={`neo-shadow-sm mt-3 inline-block rounded-full border-3 border-navy px-5 py-1.5 text-center font-pixel text-[10px] sm:text-xs ${BADGE_BG[member.badge]}`}
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
      className="relative w-full overflow-hidden bg-[#DFF3FB] pb-24 pt-32 sm:pb-40 sm:pt-40"
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
          Six seventh-semester students from diverse academic backgrounds,
          united by a shared commitment to growth, collaboration, and social
          impact.
        </p>

        {/* Grid 3 kolom, kartu tengah lebih naik (efek zigzag/honeycomb) */}
        <div className="mt-16 grid grid-cols-1 items-start justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-y-6">
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
    