"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Sparkle } from "@/components/icons/SummerIcons";

type Category = "shirt" | "totebag" | "mug" | "keychain" | "tumbler" | "other";

type ProductCardProps = {
  category: Category;
  categoryLabel: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  price: string;
  description: string;
  href?: string;
};

const CATEGORY_BADGE: Record<Category, string> = {
  shirt: "bg-navy text-white",
  totebag: "bg-mint text-navy",
  mug: "bg-sunny text-navy",
  keychain: "bg-sky text-white",
  tumbler: "bg-coral text-white",
  other: "bg-coral text-white",
};

export default function ProductCard({
  category,
  categoryLabel,
  imageSrc,
  imageAlt,
  title,
  price,
  description,
  href = "#",
}: ProductCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="neo-card relative flex flex-col overflow-hidden rounded-3xl bg-white">
      {/* Badge kategori mengambang di pojok kanan atas gambar */}
      <div
        className={`neo-pill absolute right-4 top-4 z-10 rounded-full px-4 py-1.5 ${CATEGORY_BADGE[category]}`}
      >
        <span className="font-pixel text-[10px] sm:text-xs">
          {categoryLabel}
        </span>
      </div>

      {/* Area gambar produk, dengan fallback kalau file belum ada */}
      <div className="relative h-52 w-full border-b-[3px] border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)] sm:h-60">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-navy/50">
            <ImageIcon size={32} strokeWidth={1.75} />
            <span className="font-body text-xs font-semibold">
              Foto menyusul
            </span>
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain p-6"
            onError={() => setFailed(true)}
          />
        )}
        <Sparkle className="pointer-events-none absolute left-4 top-4 h-4 w-4 opacity-60" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-body text-base font-bold leading-snug text-navy sm:text-lg">
          {title}
        </h3>
        <p className="mt-1 font-pixel text-lg text-sunny [text-shadow:1.5px_1.5px_0_#0D2B4E] sm:text-xl">
          {price}
        </p>
        <p className="mt-2 flex-1 font-body text-sm text-navy/70">
          {description}
        </p>

        <Link
          href={href}
          className="neo-shadow-sm mt-5 flex w-full items-center justify-center rounded-full border-[3px] border-navy bg-navy px-6 py-3 text-center font-body text-sm font-bold tracking-widest text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          VIEW DETAILS
        </Link>
      </div>
    </div>
  );
}