"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";

const WEEKS = [
  { week: 13, date: "6 July", icon: "gambar_daun_kecil.png" },
  { week: 12, date: "29 June", icon: "gambar_bunga_kecil.png" },
  { week: 11, date: "22 June", icon: "gambar_bintang_laut_kecil.png" },
  { week: 10, date: "15 June", icon: "gambar_pelampung.png" },
  { week: 9, date: "8 June", icon: "gambar_sandal_jepit.png" },
];

export default function WeekRecap() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollerRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto -mt-10 w-[92%] max-w-6xl pb-16">
      {/* Lapisan pasir */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[calc(100%+3rem)] rounded-b-[2.5rem] bg-[linear-gradient(180deg,#FCEFD2_0%,#F7E2B0_100%)]" />

      <div className="grid grid-cols-1 gap-6 px-4 pt-16 sm:px-8 lg:grid-cols-[280px_1fr] lg:items-center">
        {/* Banner opening ceremony */}
        <div className="relative overflow-hidden rounded-3xl border-4 border-white/70 bg-[linear-gradient(160deg,#8FD3F4_0%,#4E9FD4_100%)] p-6 text-center shadow-lg">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/90">
            Coming soon
          </p>
          <p className="font-pixel mt-2 text-2xl text-white [text-shadow:1px_1px_0_#0D2B4E]">
            Opening
            <br />
            Ceremony
          </p>
          <p className="mt-2 font-body text-[11px] text-white/90">
            Training &amp; cultural exchange
          </p>
          <p className="font-pixel mt-1 text-sm text-sunny">Summer 2025</p>
          <Image
            src="/images/gambar_bunga_kecil.png"
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="pointer-events-none absolute -bottom-2 -left-2 w-10"
          />
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollerRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {WEEKS.map((item, i) => (
              <div
                key={item.week}
                className="relative flex min-w-[150px] shrink-0 flex-col items-start rounded-2xl border-2 border-white bg-white/60 px-4 py-5 shadow-sm"
              >
                <Image
                  src="/images/gambar_payung_pantai.png"
                  alt=""
                  width={36}
                  height={36}
                  aria-hidden
                  className="absolute -top-4 right-3 w-9"
                />
                <span className="font-body text-xs font-semibold uppercase tracking-widest text-navy/60">
                  Week
                </span>
                <span className="font-pixel text-3xl text-navy">
                  {item.week}
                </span>
                <span className="font-body text-xs font-semibold text-navy/60">
                  Recap
                </span>
                <span className="mt-1 font-body text-[11px] italic text-navy/40">
                  {item.date}
                </span>

                {/* Garis jejak putus-putus penghubung kartu */}
                {i < WEEKS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-[-1.5rem] top-1/2 hidden h-px w-6 border-t-2 border-dotted border-navy/30 sm:block"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Lihat recap minggu lainnya"
            className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-md hover:bg-sunny hover:text-white sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}