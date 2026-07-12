/* ===================================================================
   Ikon dekorasi summer — digambar langsung sebagai SVG (bukan file
   gambar) supaya tidak pernah "broken image" dan gampang diberi efek
   sticker/3D lewat drop-shadow keras (khas neobrutalism). Dipakai di
   Hero dan section lain yang butuh sentuhan pantai.
   =================================================================== */

export function Starfish({ className = "" }: { className?: string }) {
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

export function Hibiscus({ className = "" }: { className?: string }) {
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

export function Surfboard({ className = "" }: { className?: string }) {
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

export function SunBurst({ className = "" }: { className?: string }) {
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

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#FFC93C" />
    </svg>
  );
}

export function Shell({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`drop-shadow-[3px_3px_0_#0D2B4E] ${className}`}
      aria-hidden
    >
      <path
        d="M32 8 C48 8 58 26 58 40 C58 46 52 50 46 46 C44 52 38 56 32 56 C26 56 20 52 18 46 C12 50 6 46 6 40 C6 26 16 8 32 8 Z"
        fill="#FFF3D6"
        stroke="#0D2B4E"
        strokeWidth="2.5"
      />
      {[16, 24, 32, 40, 48].map((x) => (
        <line
          key={x}
          x1={x}
          y1="14"
          x2="32"
          y2="52"
          stroke="#FFC93C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/* Gelembung "summer" digambar pakai div bulat, bukan file gambar */
export function BubbleField({
  bubbles = [
    { top: "8%", left: "6%", size: 18, opacity: 0.5 },
    { top: "18%", left: "42%", size: 10, opacity: 0.4 },
    { top: "30%", left: "70%", size: 14, opacity: 0.5 },
    { top: "55%", left: "12%", size: 12, opacity: 0.4 },
    { top: "70%", left: "88%", size: 20, opacity: 0.35 },
    { top: "85%", left: "35%", size: 9, opacity: 0.45 },
    { top: "40%", left: "92%", size: 8, opacity: 0.4 },
  ],
}: {
  bubbles?: { top: string; left: string; size: number; opacity: number }[];
}) {
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