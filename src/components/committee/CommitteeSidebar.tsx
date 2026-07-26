"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  QrCode,
  Keyboard,
  ListChecks,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const NAV_LINKS = [
  { href: "/committee", label: "Dashboard", icon: LayoutDashboard },
  { href: "/committee/scan", label: "Scan QR", icon: QrCode },
  { href: "/committee/code", label: "Input Kode", icon: Keyboard },
  { href: "/committee/list", label: "Daftar Peserta", icon: ListChecks },
];

export default function CommitteeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tutup drawer mobile otomatis tiap pindah halaman
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/committee/login");
  };

  const NavContent = (
    <>
      <div className="neo-pill mb-8 w-fit rounded-full bg-mint px-4 py-1.5">
        <span className="font-pixel text-xs text-navy">Committee</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/committee"
              ? pathname === "/committee"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-body text-sm font-semibold transition-colors ${
                active
                  ? "border-[3px] border-navy bg-sunny text-navy"
                  : "border-[3px] border-transparent text-navy/60 hover:bg-navy/5"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="neo-shadow-sm mt-6 flex items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2.5 font-body text-sm font-semibold text-navy"
      >
        <LogOut size={16} />
        Keluar
      </button>
    </>
  );

  return (
    <>
      {/* Sidebar tetap — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r-[3px] border-navy/10 bg-white p-6 sm:flex">
        {NavContent}
      </aside>

      {/* Top bar + drawer — mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b-[3px] border-navy/10 bg-white px-4 py-3 sm:hidden">
        <span className="font-pixel text-sm text-navy">Committee</span>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-navy bg-white text-navy"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 sm:hidden">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r-[3px] border-navy bg-white p-6 pt-16">
            {NavContent}
          </aside>
        </div>
      )}
    </>
  );
}
