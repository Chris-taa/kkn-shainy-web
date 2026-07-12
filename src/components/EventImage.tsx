"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Sparkle } from "@/components/icons/SummerIcons";

export default function EventImage({
  src,
  alt,
  dimmed = false,
}: {
  src: string;
  alt: string;
  dimmed?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-44 w-full overflow-hidden border-b-[3px] border-navy sm:h-52 lg:h-56">
      {failed ? (
        // Fallback bergaya summer, bukan ikon broken-image bawaan browser
        <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#FFE1A8_0%,#FFC93C_100%)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background-image:radial-gradient(#0D2B4E_1.5px,transparent_1.5px)] [background-size:20px_20px]"
          />
          <Sparkle className="absolute left-6 top-5 h-4 w-4 opacity-70" />
          <Sparkle className="absolute bottom-6 right-8 h-3 w-3 opacity-60" />
          <div className="relative flex flex-col items-center gap-2 text-navy/70">
            <ImageIcon size={32} strokeWidth={1.75} />
            <span className="font-body text-xs font-semibold">
              Foto menyusul
            </span>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {dimmed && <div className="absolute inset-0 bg-navy/25" aria-hidden />}
    </div>
  );
}