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
  nickname: string;
  hangeul: string;
  department: string;
  role: string;
  photo: string;
  badge: "sunny" | "coral" | "mint" | "sky";
};

// Urutan array = urutan tampilan di DESKTOP (honeycomb zigzag)
// Urutan: [kiri-atas, tengah-atas, kanan-atas, kiri-bawah, tengah-bawah, kanan-bawah]
const TEAM: TeamMember[] = [
  {
    name: "Tiara Andriani Isnawati",
    nickname: "Ara",
    hangeul: "아라",
    department: "Faculty of Economics & Business, Management",
    role: "Secretary",
    photo: "/images/Member/tya.png",
    badge: "mint",
  },
  {
    name: "Christian Hadi Candra",
    nickname: "Chess",
    hangeul: "체스",
    department: "Department of Informatics Engineering",
    role: "Leader",
    photo: "/images/Member/chess.png",
    badge: "coral",
  },
  {
    name: "Aylira Natasha Susanto",
    nickname: "Ay",
    hangeul: "에이",
    department: "Department of Industry Engineering",
    role: "Treasurer",
    photo: "/images/Member/ay.png",
    badge: "sunny",
  },
  {
    name: "Muhammad Rizki Juniardi",
    nickname: "Jun",
    hangeul: "준",
    department: "Department of Informatics Engineering",
    role: "Technical Lead",
    photo: "/images/Member/jun.png",
    badge: "sky",
  },
  {
    name: "Linda Julivia",
    nickname: "Lyn",
    hangeul: "린",
    department: "Department of Informatics Engineering",
    role: "Creative Lead",
    photo: "/images/Member/lyn.png",
    badge: "sky",
  },
  {
    name: "Hendru Elban Anshori",
    nickname: "Hen",
    hangeul: "헨",
    department: "Faculty of Economics & Business, Accounting",
    role: "Public Relation",
    photo: "/images/Member/hen.png",
    badge: "mint",
  },
];

// offset vertikal tiap kartu (desktop) biar zigzag kaya honeycomb
const OFFSET_Y = [
  "sm:mt-16", // kiri-atas
  "sm:mt-0", // tengah-atas (paling naik)
  "sm:mt-16", // kanan-atas
  "sm:mt-12", // kiri-bawah
  "sm:mt-28", // tengah-bawah
  "sm:mt-12", // kanan-bawah
];

// urutan tampilan khusus MODE HP: Leader, Secretary, Treasurer, PR, Tech, Design
// angkanya merujuk ke index array TEAM di atas (0-based)
const MOBILE_ORDER = [2, 1, 3, 5, 6, 4]; // order-* per index array TEAM (i=0..5)

const BADGE_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-sunny text-navy",
  coral: "bg-coral text-white",
  mint: "bg-mint text-navy",
  sky: "bg-sky text-white",
};

// warna pancaran sinar matahari di belakang tiap foto, biar senada sama badge-nya
const GLOW_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-[radial-gradient(circle,#FFE9A8_0%,transparent_70%)]",
  coral: "bg-[radial-gradient(circle,#FFC9B8_0%,transparent_70%)]",
  mint: "bg-[radial-gradient(circle,#B8F5D8_0%,transparent_70%)]",
  sky: "bg-[radial-gradient(circle,#B8E4F5_0%,transparent_70%)]",
};

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="neo-card relative flex w-full max-w-[240px] flex-col items-center overflow-visible rounded-3xl bg-white px-5 pb-5">
      {/* mini matahari nempel di pojok kartu */}
      <span className="absolute -right-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border-3 border-navy bg-sunny text-sm shadow-[2px_2px_0_0_#0D2B4E]">
        ☀️
      </span>

      {/* spacer: ngasih "jatah tempat" buat foto yang nongol ke atas */}
      <div className="relative h-[210px] w-full sm:h-[240px]">
        {/* pancaran cahaya lembut di belakang foto */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[160px] rounded-full opacity-80 sm:h-[180px] ${GLOW_BG[member.badge]}`}
        />

        {/* frame dekoratif sand, ukurannya tetap sama kaya sebelumnya */}
        <div className="neo-border absolute inset-x-0 bottom-0 h-[150px] rounded-2xl bg-sand sm:h-[170px]" />

        {/* garis dekor bergelombang di frame, kesan ombak/pantai */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full opacity-40 sm:h-[170px]"
          viewBox="0 0 180 170"
          preserveAspectRatio="none"
        >
          <path
            d="M0 150 Q 22.5 138 45 150 T 90 150 T 135 150 T 180 150"
            stroke="#0D2B4E"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

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

      <p className="relative z-10 mt-1 text-center font-body text-xs font-semibold text-navy/70 sm:text-sm">
        &ldquo;{member.nickname}&rdquo;{" "}
        <span className="text-navy/50">· {member.hangeul}</span>
      </p>

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
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#FFF6DE_0%,#FDEBB0_10%,#DFF3FB_35%,#9FD8E8_60%,#3FA6C9_82%,#1C5E8A_100%)] pb-32 pt-32 sm:pb-56 sm:pt-40"
    >
      {/* tekstur pasir di paling atas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50 [background-image:radial-gradient(#E8C888_1.5px,transparent_1.5px)] [background-size:16px_16px]"
      />

      {/* garis-garis ombak halus makin ke bawah makin banyak, kesan air makin dalam */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full opacity-25"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M0 300 Q 180 280 360 300 T 720 300 T 1080 300 T 1440 300"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0 480 Q 180 455 360 480 T 720 480 T 1080 480 T 1440 480"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0 650 Q 180 620 360 650 T 720 650 T 1080 650 T 1440 650"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0 800 Q 180 770 360 800 T 720 800 T 1080 800 T 1440 800"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* Gelembung ambient, konsisten sama Hero */}
      <BubbleField />

      {/* Dekorasi summer */}
      <SunBurst className="pointer-events-none absolute right-10 top-10 hidden w-14 rotate-12 sm:block" />
      <SunBurst className="pointer-events-none absolute -left-6 bottom-10 hidden w-10 -rotate-6 opacity-70 lg:block" />
      <Starfish className="pointer-events-none absolute -left-2 top-1/3 hidden w-16 -rotate-12 md:block" />
      <Starfish className="pointer-events-none absolute right-4 top-2/3 hidden w-10 rotate-45 opacity-70 lg:block" />
      <Hibiscus className="pointer-events-none absolute -right-2 bottom-24 hidden w-20 rotate-6 md:block" />
      <Hibiscus className="pointer-events-none absolute -left-4 bottom-4 hidden w-14 -rotate-12 opacity-80 lg:block" />

      <div className="relative z-10 mx-auto w-[92%] max-w-5xl px-4 text-center">
        <span className="neo-pill mb-4 inline-block w-fit rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          🏖️ KKN International Summer Batch 2026
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

        {/* Grid 3 kolom. Mobile: order custom (Leader, Secretary, Bendahara, PR, Tech, Design). Desktop: honeycomb zigzag sesuai urutan array asli */}
        <div className="mt-16 grid grid-cols-1 items-start justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-y-10">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              style={{ order: MOBILE_ORDER[i] }}
              className={`${OFFSET_Y[i]} sm:!order-none`}
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider bawah — sekarang biru laut lebih dalam, transisi ke section berikutnya */}
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
