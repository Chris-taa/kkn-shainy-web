"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";

// Ganti nomor ini dengan WhatsApp admin Shainy (format: 62xxxxxxxxxxx, tanpa "+" atau "0" di depan)
const ADMIN_WHATSAPP = "6281234567890";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  const checkoutMessage = () => {
    const lines = items.map((item) => {
      const variant = [item.design, item.color, item.size, item.material]
        .filter(Boolean)
        .join(", ");
      return `- ${item.title}${variant ? ` (${variant})` : ""} x${item.quantity} — ${formatRupiah(
        item.price * item.quantity
      )}`;
    });
    return encodeURIComponent(
      `Halo Shainy! Saya mau pesan:\n\n${lines.join("\n")}\n\nTotal: ${formatRupiah(
        totalPrice
      )}`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-3xl">
        <Link
          href="/store"
          className="neo-shadow-sm mb-6 inline-flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
        >
          <ArrowLeft size={16} />
          Lanjut Belanja
        </Link>

        <h1 className="font-pixel text-2xl text-navy sm:text-3xl">
          Keranjang Kamu
        </h1>

        {items.length === 0 ? (
          <div className="neo-card mt-6 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-16 text-center">
            <ShoppingBag size={40} className="text-navy/30" />
            <p className="font-body text-sm font-semibold text-navy/60">
              Keranjang kamu masih kosong.
            </p>
            <Link
              href="/store"
              className="neo-shadow-sm mt-2 rounded-full border-[3px] border-navy bg-sunny px-6 py-2.5 font-body text-sm font-bold text-navy"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4">
              {items.map((item) => {
                const variant = [item.design, item.color, item.size, item.material]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <div
                    key={item.id}
                    className="neo-card flex gap-4 rounded-2xl bg-white p-4 sm:p-5"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-[3px] border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)] sm:h-24 sm:w-24">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-body text-sm font-bold text-navy sm:text-base">
                          {item.title}
                        </p>
                        {variant && (
                          <p className="mt-0.5 font-body text-xs text-navy/50">
                            {variant}
                          </p>
                        )}
                        <p className="mt-1 font-pixel text-sm text-sunny [text-shadow:1px_1px_0_#0D2B4E]">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Kurangi jumlah"
                            className="flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-navy bg-white text-navy"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-pixel text-sm text-navy">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Tambah jumlah"
                            className="flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-navy bg-white text-navy"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Hapus item"
                          className="flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-navy/30 text-navy/50 transition-colors hover:border-coral hover:text-coral"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 font-body text-xs font-semibold text-navy/40 underline decoration-dotted hover:text-coral"
            >
              Kosongkan keranjang
            </button>

            {/* Ringkasan & checkout */}
            <div className="neo-card mt-8 rounded-3xl bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-semibold text-navy/70">
                  Total
                </span>
                <span className="font-pixel text-2xl text-navy">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <a
                href={`https://wa.me/${ADMIN_WHATSAPP}?text=${checkoutMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-shadow-sm mt-6 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-mint px-6 py-3.5 font-body text-sm font-bold tracking-widest text-navy transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={18} />
                Checkout via WhatsApp
              </a>
              <p className="mt-3 text-center font-body text-xs text-navy/40">
                Kamu akan diarahkan ke WhatsApp admin Shainy dengan detail
                pesanan yang sudah terisi otomatis.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}