"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isBackoffice =
    pathname?.startsWith("/admin") || pathname?.startsWith("/committee");

  if (isBackoffice) return null;

  return <Navbar />;
}
