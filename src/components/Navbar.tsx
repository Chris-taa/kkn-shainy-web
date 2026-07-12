"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Our Team", href: "/#our-team" }, // Tambahkan slash '/' agar bisa kembali ke home
  { label: "Our Program", href: "/#our-program" },
  { label: "Our Events", href: "/our-events" }, // <-- Ubah bagian ini
  { label: "Store", href: "/#store" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    // Mengubah "sticky" menjadi "fixed left-0 right-0" agar melayang di atas konten
    <header className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[92%] max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-[0_4px_20px_rgba(13,43,78,0.08)] backdrop-blur-md sm:px-6">
      {/* Logo */}
      <a href="" className="flex shrink-0 items-center gap-2">
        <Image
          src="/images/gambar_logo.png"
          alt="Hamkke Bareng logo"
          width={44}
          height={44}
          className="h-10 w-10 object-contain sm:h-11 sm:w-11"
        />
      </a>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 lg:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-heading text-sm font-semibold tracking-wide text-navy transition-colors hover:text-sunny"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Cart (desktop) */}
      <button className="hidden items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 lg:flex">
        <ShoppingCart size={16} />
        Cart
      </button>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] flex w-full flex-col gap-1 rounded-3xl border border-white/60 bg-white/95 p-4 shadow-xl lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-heading text-sm font-semibold text-navy hover:bg-sunny/10"
            >
              {link.label}
            </a>
          ))}
          <button className="mt-2 flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
            <ShoppingCart size={16} />
            Cart
          </button>
        </div>
      )}
    </header>
  );
}
