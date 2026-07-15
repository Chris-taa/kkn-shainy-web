"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  PackageOpen,
  CalendarClock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const MENU = [
  { label: "Kelola Pesanan", href: "/admin", icon: PackageOpen },
  { label: "Peserta Closing Ceremony", href: "/admin/peserta", icon: Users },
  { label: "Kelola Event", href: "/admin/events", icon: CalendarClock },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b-[3px] border-navy bg-white px-4 py-3 lg:hidden">
        <h2 className="font-pixel text-lg text-navy">Admin</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay saat drawer terbuka (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-navy/40 lg:hidden"
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col justify-between border-r-[3px] border-navy bg-white px-4 py-6 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div>
          <h2 className="mb-8 px-2 font-pixel text-lg text-navy">Admin</h2>
          <nav className="flex flex-col gap-1">
            {MENU.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-semibold transition-colors ${
                    active
                      ? "bg-navy text-white"
                      : "text-navy/70 hover:bg-navy/5"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-semibold text-navy/70 hover:bg-navy/5"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </aside>
    </>
  );
}
