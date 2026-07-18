import Image from "next/image";
import {
  Starfish,
  Hibiscus,
  Sparkle,
  SunBurst,
  BubbleField,
} from "@/components/icons/SummerIcons";
import { JSX } from "react/jsx-runtime";

type Animal =
  | "pufferfish"
  | "starfish"
  | "orca"
  | "jellyfish"
  | "penguin"
  | "octopus";

type TeamMember = {
  name: string;
  nickname: string;
  hangeul: string;
  department: string;
  role: string;
  photo: string;
  badge: "sunny" | "coral" | "mint" | "sky";
  animal: Animal;
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
    animal: "jellyfish",
  },
  {
    name: "Christian Hadi Candra",
    nickname: "Chess",
    hangeul: "체스",
    department: "Department of Informatics Engineering",
    role: "Leader",
    photo: "/images/Member/chess.png",
    badge: "coral",
    animal: "orca",
  },
  {
    name: "Aylira Natasha Susanto",
    nickname: "Ay",
    hangeul: "에이",
    department: "Department of Industry Engineering",
    role: "Treasurer",
    photo: "/images/Member/ay.png",
    badge: "mint",
    animal: "starfish",
  },
  {
    name: "Muhammad Rizki Juniardi",
    nickname: "Jun",
    hangeul: "준",
    department: "Department of Informatics Engineering",
    role: "Technical Lead",
    photo: "/images/Member/jun.png",
    badge: "sky",
    animal: "octopus",
  },
  {
    name: "Linda Julivia",
    nickname: "Lyn",
    hangeul: "린",
    department: "Department of Informatics Engineering",
    role: "Creative Lead",
    photo: "/images/Member/lyn.png",
    badge: "sunny",
    animal: "penguin",
  },
  {
    name: "Hendru Elban Anshori",
    nickname: "Hen",
    hangeul: "헨",
    department: "Faculty of Economics & Business, Accounting",
    role: "Public Relation",
    photo: "/images/Member/hen.png",
    badge: "sky",
    animal: "pufferfish",
  },
];

const OFFSET_Y = [
  "sm:mt-16",
  "sm:mt-0",
  "sm:mt-16",
  "sm:mt-12",
  "sm:mt-28",
  "sm:mt-12",
];

const MOBILE_ORDER = [2, 1, 3, 5, 6, 4];

const BADGE_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-sunny text-navy",
  coral: "bg-coral text-white",
  mint: "bg-mint text-navy",
  sky: "bg-sky text-white",
};

const GLOW_BG: Record<TeamMember["badge"], string> = {
  sunny: "bg-[radial-gradient(circle,#FFE9A8_0%,transparent_70%)]",
  coral: "bg-[radial-gradient(circle,#FFC9B8_0%,transparent_70%)]",
  mint: "bg-[radial-gradient(circle,#B8F5D8_0%,transparent_70%)]",
  sky: "bg-[radial-gradient(circle,#B8E4F5_0%,transparent_70%)]",
};

const ANIMAL_LABEL: Record<Animal, string> = {
  pufferfish: "si Ikan Buntal",
  starfish: "si Bintang Laut",
  orca: "si Paus Orca",
  jellyfish: "si Ubur-Ubur",
  penguin: "si Penguin",
  octopus: "si Gurita",
};

/* ---------------------------------------------------------
   Ikon maskot laut — versi kawaii: mata bulat besar,
   pipi merona, senyum. Konsisten satu "wajah" di semua.
--------------------------------------------------------- */

function Face({
  eyeX = 6,
  eyeY = 0,
  smileY = 4,
  cheekY = 3,
}: {
  eyeX?: number;
  eyeY?: number;
  smileY?: number;
  cheekY?: number;
}) {
  return (
    <>
      <ellipse
        cx={-4.5}
        cy={cheekY}
        rx="2.6"
        ry="1.7"
        fill="#FF8A73"
        opacity="0.55"
      />
      <ellipse
        cx={4.5}
        cy={cheekY}
        rx="2.6"
        ry="1.7"
        fill="#FF8A73"
        opacity="0.55"
      />
      <circle
        cx={-eyeX / 2}
        cy={eyeY}
        r="2.3"
        fill="#FFFFFF"
        stroke="#0D2B4E"
        strokeWidth="1"
      />
      <circle
        cx={eyeX / 2}
        cy={eyeY}
        r="2.3"
        fill="#FFFFFF"
        stroke="#0D2B4E"
        strokeWidth="1"
      />
      <circle cx={-eyeX / 2 + 0.5} cy={eyeY + 0.4} r="1.1" fill="#0D2B4E" />
      <circle cx={eyeX / 2 + 0.5} cy={eyeY + 0.4} r="1.1" fill="#0D2B4E" />
      <path
        d={`M-3 ${smileY} Q0 ${smileY + 2.4} 3 ${smileY}`}
        stroke="#0D2B4E"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function PufferfishIcon({ className }: { className?: string }) {
  const spikeAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <g>
        {spikeAngles.map((a) => (
          <path
            key={a}
            d="M20 10.5 L17.4 4 L22.6 4 Z"
            fill="#FFC93C"
            stroke="#0D2B4E"
            strokeWidth="1.6"
            strokeLinejoin="round"
            transform={`rotate(${a} 20 22)`}
          />
        ))}
      </g>
      <circle
        cx="20"
        cy="22"
        r="12.5"
        fill="#FFDD85"
        stroke="#0D2B4E"
        strokeWidth="2.4"
      />
      <g transform="translate(20 22)">
        <Face eyeX={7} eyeY={-2} smileY={4.5} cheekY={2} />
      </g>
    </svg>
  );
}

function OrcaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <path
        d="M4 24 C4 14 13 8 22 8 C31 8 36 13 36 19 C36 19 30 18 27 20 C31 21 34 25 33 30 C27 34 17 34 11 30 C6 29 4 27 4 24 Z"
        fill="#16324F"
        stroke="#0D2B4E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M21 8 L26 1.5 L27.5 10 Z"
        fill="#16324F"
        stroke="#0D2B4E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 27 C13 31.5 21 32 26 28.5 C21 33.5 12 32.5 9 27 Z"
        fill="#FFFFFF"
      />
      <ellipse
        cx="13.5"
        cy="16.5"
        rx="3.2"
        ry="2"
        fill="#FFFFFF"
        transform="rotate(-18 13.5 16.5)"
      />
      <circle cx="14.2" cy="16.7" r="1.1" fill="#0D2B4E" />
      <path
        d="M11 24 Q15 26.5 19 24.5"
        stroke="#FFFFFF"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function StarfishMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <path
        d="M20 4 L24.7 13.5 L35.2 15.1 L27.6 22.5 L29.4 32.9 L20 28 L10.6 32.9 L12.4 22.5 L4.8 15.1 L15.3 13.5 Z"
        fill="#FF9A85"
        stroke="#0D2B4E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="9" r="1.1" fill="#0D2B4E" opacity="0.35" />
      <circle cx="30" cy="18" r="1.1" fill="#0D2B4E" opacity="0.35" />
      <circle cx="25" cy="28" r="1.1" fill="#0D2B4E" opacity="0.35" />
      <circle cx="14" cy="28" r="1.1" fill="#0D2B4E" opacity="0.35" />
      <circle cx="10" cy="18" r="1.1" fill="#0D2B4E" opacity="0.35" />
      <g transform="translate(20 21)">
        <Face eyeX={6.5} eyeY={-1} smileY={3.5} cheekY={2} />
      </g>
    </svg>
  );
}

function JellyfishIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <path
        d="M5 19 C5 9 35 9 35 19 C35 21.5 5 21.5 5 19 Z"
        fill="#C9ECF9"
        stroke="#0D2B4E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="1" fill="#0D2B4E" opacity="0.3" />
      <circle cx="28" cy="13" r="1" fill="#0D2B4E" opacity="0.3" />
      <circle cx="20" cy="10.5" r="1" fill="#0D2B4E" opacity="0.3" />
      <g transform="translate(20 16)">
        <Face eyeX={7} eyeY={-1} smileY={2.6} cheekY={1.4} />
      </g>
      <g stroke="#0D2B4E" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M11 20 q-1 7 -3 12" />
        <path d="M17.5 20.5 q0.5 8 -1.5 14" />
        <path d="M22.5 20.5 q-0.5 8 1.5 14" />
        <path d="M29 20 q1 7 3 12" />
      </g>
      <circle
        cx="7"
        cy="34"
        r="1.3"
        fill="#C9ECF9"
        stroke="#0D2B4E"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle
        cx="33"
        cy="33"
        r="1"
        fill="#C9ECF9"
        stroke="#0D2B4E"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}

function PenguinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <path
        d="M9 22 C9 26 8 30 10.5 32 C10 27 10.5 23 12.5 20 Z"
        fill="#16324F"
        stroke="#0D2B4E"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M31 22 C31 26 32 30 29.5 32 C30 27 29.5 23 27.5 20 Z"
        fill="#16324F"
        stroke="#0D2B4E"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <ellipse
        cx="20"
        cy="23"
        rx="10.5"
        ry="14"
        fill="#16324F"
        stroke="#0D2B4E"
        strokeWidth="2.2"
      />
      <ellipse cx="20" cy="25.5" rx="6" ry="9" fill="#FFFFFF" />
      <g transform="translate(20 17.5)">
        <Face eyeX={6.5} eyeY={0} smileY={0} cheekY={2.2} />
      </g>
      <path
        d="M20 19.5 l3 2 -3 1.2 Z"
        fill="#FFC93C"
        stroke="#0D2B4E"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 34.5 l3 -2.3 3 2.3 Z"
        fill="#FFC93C"
        stroke="#0D2B4E"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 34.5 l3 -2.3 3 2.3 Z"
        fill="#FFC93C"
        stroke="#0D2B4E"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OctopusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <g stroke="#0D2B4E" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M11 22 q-5 6 -1 13 q3.5 -4 1.5 -9.5" />
        <path d="M16.5 25.5 q-2.5 6.5 2 11.5 q2 -5.5 -1 -10.5" />
        <path d="M23.5 25.5 q2.5 6.5 -2 11.5 q-2 -5.5 1 -10.5" />
        <path d="M29 22 q5 6 1 13 q-3.5 -4 -1.5 -9.5" />
      </g>
      <circle
        cx="20"
        cy="17"
        r="11"
        fill="#D9B8F5"
        stroke="#0D2B4E"
        strokeWidth="2.2"
      />
      <g transform="translate(20 16.5)">
        <Face eyeX={7} eyeY={-1} smileY={3.5} cheekY={2.2} />
      </g>
    </svg>
  );
}

const ANIMAL_ICON: Record<
  Animal,
  (props: { className?: string }) => JSX.Element
> = {
  pufferfish: PufferfishIcon,
  orca: OrcaIcon,
  starfish: StarfishMascot,
  jellyfish: JellyfishIcon,
  penguin: PenguinIcon,
  octopus: OctopusIcon,
};

/* ---------------------------------------------------------
   Pohon kelapa — batang melengkung alami + daun ngefan
   + gerombol kelapa di bawah mahkota daun
--------------------------------------------------------- */
function PalmTree({ className }: { className?: string }) {
  const fronds = [
    { rotate: -80 },
    { rotate: -48 },
    { rotate: -16 },
    { rotate: 16, flip: true },
    { rotate: 48, flip: true },
    { rotate: 80, flip: true },
  ];
  return (
    <svg viewBox="0 0 120 170" fill="none" className={className}>
      {/* batang */}
      <path
        d="M62 166 C55 149 67 129 60 111 C55 97 65 83 60 68"
        stroke="#0D2B4E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M62 166 C55 149 67 129 60 111 C55 97 65 83 60 68"
        stroke="#C89A5B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M54 149 q6 3.5 12 0"
        stroke="#0D2B4E"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M55 126 q6 3.5 11 0"
        stroke="#0D2B4E"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M56 98 q5 3.5 10 0"
        stroke="#0D2B4E"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* daun ngefan dari mahkota */}
      <g transform="translate(60 66)">
        {fronds.map((f, i) => (
          <path
            key={i}
            d="M0 0 C -9 -7 -25 -8 -42 2 C -27 -3 -12 -2 0 0 Z"
            fill={i % 2 === 0 ? "#7ED0A0" : "#5FBE95"}
            stroke="#0D2B4E"
            strokeWidth="2.2"
            strokeLinejoin="round"
            transform={`rotate(${f.rotate}) scale(${f.flip ? -1 : 1} 1)`}
          />
        ))}
      </g>

      {/* gerombol kelapa */}
      <circle
        cx="54"
        cy="71"
        r="4.2"
        fill="#6B4226"
        stroke="#0D2B4E"
        strokeWidth="1.8"
      />
      <circle
        cx="63"
        cy="75"
        r="3.8"
        fill="#6B4226"
        stroke="#0D2B4E"
        strokeWidth="1.8"
      />
      <circle
        cx="58"
        cy="78.5"
        r="3.8"
        fill="#6B4226"
        stroke="#0D2B4E"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/* ---------------------------------------------------------
   Jejak kaki — jalan dari laut dalam (samar) naik ke
   pasir kering (makin jelas), nyambung sama gradasi section
--------------------------------------------------------- */
function Footprint({
  x,
  y,
  rotate,
  opacity,
  flip = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  flip?: 1 | -1;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip} 1)`}
      opacity={opacity}
      fill="#8B5A2B"
    >
      <ellipse cx="0" cy="0" rx="9" ry="14" />
      <circle cx="-6" cy="-16.5" r="2.6" />
      <circle cx="-2" cy="-18.5" r="2.8" />
      <circle cx="3" cy="-18.5" r="2.8" />
      <circle cx="7.5" cy="-17" r="2.4" />
      <circle cx="11" cy="-14.5" r="2" />
    </g>
  );
}

function FootprintTrail({ className }: { className?: string }) {
  const steps: {
    x: number;
    y: number;
    rotate: number;
    opacity: number;
    flip: 1 | -1;
  }[] = [
    { x: 120, y: 1330, rotate: -8, opacity: 0.1, flip: 1 },
    { x: 152, y: 1256, rotate: 10, opacity: 0.13, flip: -1 },
    { x: 108, y: 1178, rotate: -6, opacity: 0.16, flip: 1 },
    { x: 146, y: 1098, rotate: 8, opacity: 0.2, flip: -1 },
    { x: 104, y: 1010, rotate: -10, opacity: 0.25, flip: 1 },
    { x: 140, y: 918, rotate: 6, opacity: 0.3, flip: -1 },
    { x: 98, y: 818, rotate: -8, opacity: 0.36, flip: 1 },
    { x: 134, y: 718, rotate: 9, opacity: 0.42, flip: -1 },
    { x: 94, y: 600, rotate: -6, opacity: 0.5, flip: 1 },
    { x: 128, y: 480, rotate: 8, opacity: 0.56, flip: -1 },
    { x: 98, y: 340, rotate: -8, opacity: 0.64, flip: 1 },
    { x: 124, y: 200, rotate: 6, opacity: 0.7, flip: -1 },
    { x: 104, y: 78, rotate: -6, opacity: 0.78, flip: 1 },
  ];

  return (
    <svg
      viewBox="0 0 240 1400"
      preserveAspectRatio="xMidYMin meet"
      className={className}
    >
      {steps.map((s, i) => (
        <Footprint key={i} {...s} />
      ))}
    </svg>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const AnimalIcon = ANIMAL_ICON[member.animal];

  return (
    <div className="neo-card relative flex w-full max-w-[240px] flex-col items-center overflow-visible rounded-3xl bg-white px-5 pb-5">
      <span className="absolute -right-3 -top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border-3 border-navy bg-white shadow-[2px_2px_0_0_#0D2B4E] sm:h-12 sm:w-12">
        <AnimalIcon className="h-8 w-8 sm:h-9 sm:w-9" />
      </span>

      <div className="relative h-[210px] w-full sm:h-[240px]">
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[160px] rounded-full opacity-80 sm:h-[180px] ${GLOW_BG[member.badge]}`}
        />

        <div className="neo-border absolute inset-x-0 bottom-0 h-[150px] rounded-2xl bg-sand sm:h-[170px]" />

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

      <p className="relative z-10 mt-2 text-center font-body text-[10px] italic text-navy/45 sm:text-xs">
        {ANIMAL_LABEL[member.animal]}
      </p>
    </div>
  );
}

export default function OurTeam() {
  return (
    <section
      id="our-team"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#FFF6DE_0%,#FDEBB0_10%,#DFF3FB_35%,#9FD8E8_60%,#3FA6C9_82%,#1C5E8A_100%)] pb-32 pt-32 sm:pb-56 sm:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50 [background-image:radial-gradient(#E8C888_1.5px,transparent_1.5px)] [background-size:16px_16px]"
      />

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

      {/* Jejak kaki: samar di laut dalam (bawah), makin jelas di pasir (atas) */}
      <FootprintTrail
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-48 -translate-x-1/2 sm:block sm:w-56 lg:w-64"
      />

      {/* Pohon kelapa — digeser turun biar ga nabrak sunburst */}
      <PalmTree
        aria-hidden
        className="pointer-events-none absolute -left-8 top-24 z-0 hidden w-20 -rotate-6 opacity-95 sm:block lg:top-28 lg:w-28"
      />
      <PalmTree
        aria-hidden
        className="pointer-events-none absolute -right-10 top-20 z-0 hidden w-24 rotate-6 scale-x-[-1] opacity-95 sm:block lg:top-24 lg:w-32"
      />

      <BubbleField />

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
