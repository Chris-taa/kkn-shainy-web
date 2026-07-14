import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Shainy",
  description: "Selesaikan pesanan merchandise Shainy kamu.",
};

export default function CheckoutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-2xl">
        <Link
          href="/cart"
          className="neo-shadow-sm mb-6 inline-flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
        >
          <ArrowLeft size={16} />
          Kembali ke Keranjang
        </Link>

        <h1 className="font-pixel text-2xl text-navy sm:text-3xl">
          Checkout
        </h1>

        <CheckoutForm />
      </div>
    </div>
  );
}