"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  Upload,
  Loader2,
  PartyPopper,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";
import { PAYMENT_METHODS } from "@/data/payments";

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();

  const [paymentId, setPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  const activePayment =
    PAYMENT_METHODS.find((p) => p.id === paymentId) ?? PAYMENT_METHODS[0];

  const handleCopy = async (id: string, number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard gak tersedia — abaikan aja, user bisa select manual
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Bukti pembayaran harus berupa gambar (JPG/PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran gambar maksimal 5MB.");
      return;
    }

    setErrorMsg("");
    setProofFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !noHp.trim() || !proofFile || items.length === 0) {
      setErrorMsg("Lengkapi nama, no HP, dan upload bukti pembayaran dulu ya.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("nama", nama.trim());
      formData.append("noHp", noHp.trim());
      formData.append("paymentMethod", activePayment.label);
      formData.append("items", JSON.stringify(items));
      formData.append("totalPrice", String(totalPrice));
      formData.append("proof", proofFile);

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses checkout.");
      }

      setOrderId(data.orderId);
      setStatus("success");
      clearCart();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memproses checkout.",
      );
    }
  };

  if (items.length === 0 && status !== "success") {
    return (
      <div className="neo-card mx-auto mt-6 flex max-w-lg flex-col items-center gap-3 rounded-3xl bg-white px-6 py-16 text-center">
        <p className="font-body text-sm font-semibold text-navy/60">
          Keranjang kamu masih kosong, gak ada yang bisa di-checkout.
        </p>
        <Link
          href="/store"
          className="neo-shadow-sm mt-2 rounded-full border-[3px] border-navy bg-sunny px-6 py-2.5 font-body text-sm font-bold text-navy"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="neo-card mx-auto mt-6 flex max-w-lg flex-col items-center gap-3 rounded-3xl bg-white px-6 py-12 text-center">
        <div className="neo-shadow-sm flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-navy bg-mint">
          <PartyPopper size={28} className="text-navy" />
        </div>
        <h2 className="mt-2 font-pixel text-xl text-navy">Pesanan Diterima!</h2>
        <p className="font-body text-sm text-navy/70">
          Order ID kamu:{" "}
          <span className="font-pixel text-sunny [text-shadow:1px_1px_0_#0D2B4E]">
            {orderId}
          </span>
        </p>
        <p className="mt-1 font-body text-xs text-navy/50">
          Bukti pembayaran udah kami terima. Admin bakal verifikasi, Terimakasih
          yaa &amp;
        </p>
        <Link
          href="/store"
          className="neo-shadow-sm mt-4 rounded-full border-[3px] border-navy bg-navy px-6 py-2.5 font-body text-sm font-bold text-white"
        >
          Kembali Belanja
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-8">
      {/* Ringkasan pesanan */}
      <div className="neo-card rounded-3xl bg-white p-6 sm:p-8">
        <h2 className="font-pixel text-base text-navy">Ringkasan Pesanan</h2>
        <div className="mt-4 flex flex-col gap-3">
          {items.map((item) => {
            const variant = [item.design, item.color, item.size, item.material]
              .filter(Boolean)
              .join(" · ");
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-navy">
                    {item.title}{" "}
                    <span className="text-navy/50">x{item.quantity}</span>
                  </p>
                  {variant && (
                    <p className="font-body text-xs text-navy/50">{variant}</p>
                  )}
                </div>
                <p className="font-body text-sm font-semibold text-navy">
                  {formatRupiah(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t-[3px] border-dashed border-navy/20 pt-4">
          <span className="font-body text-sm font-bold text-navy">Total</span>
          <span className="font-pixel text-xl text-navy">
            {formatRupiah(totalPrice)}
          </span>
        </div>
      </div>

      {/* Pilih metode pembayaran */}
      <div className="neo-card rounded-3xl bg-white p-6 sm:p-8">
        <h2 className="font-pixel text-base text-navy">
          Pilih Metode Pembayaran
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentId(method.id)}
              className={`rounded-2xl border-[3px] border-navy px-4 py-3 text-left transition-transform ${
                paymentId === method.id
                  ? "neo-shadow-sm -translate-y-0.5 bg-sunny"
                  : "bg-white"
              }`}
            >
              <span className="font-pixel text-xs text-navy">
                {method.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border-[3px] border-dashed border-navy/30 bg-sand/20 px-4 py-3">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50">
              {activePayment.label} a.n {activePayment.holderName}
            </p>
            <p className="font-pixel text-base text-navy sm:text-lg">
              {activePayment.number}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(activePayment.id, activePayment.number)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border-[3px] border-navy bg-white px-3 py-2 font-body text-xs font-semibold text-navy"
          >
            {copiedId === activePayment.id ? (
              <>
                <Check size={14} /> Disalin
              </>
            ) : (
              <>
                <Copy size={14} /> Salin
              </>
            )}
          </button>
        </div>
        <p className="mt-3 font-body text-xs text-navy/50">
          Transfer sesuai total di atas ke nomor {activePayment.label} ini, lalu
          upload screenshot bukti transfernya di bawah.
        </p>
      </div>

      {/* Data diri + upload bukti */}
      <div className="neo-card rounded-3xl bg-white p-6 sm:p-8">
        <h2 className="font-pixel text-base text-navy">Data Diri</h2>

        <div className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Nama Lengkap
            </span>
            <input
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama kamu"
              className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Nomor HP / WhatsApp
            </span>
            <input
              required
              type="tel"
              inputMode="numeric"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="rounded-xl border-[3px] border-navy px-4 py-2.5 font-body text-sm text-navy outline-none focus:bg-sand/30"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/70">
              Bukti Pembayaran
            </span>

            <label className="neo-shadow-sm flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)] px-4 py-6 text-center">
              {previewUrl ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-xl border-[3px] border-navy bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview bukti pembayaran"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-navy/60" />
                  <span className="font-body text-xs font-semibold text-navy/60">
                    Klik buat upload screenshot bukti transfer
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl && (
                <span className="font-body text-xs font-semibold text-navy underline">
                  Ganti gambar
                </span>
              )}
            </label>
          </div>
        </div>

        {errorMsg && (
          <p className="mt-4 font-body text-xs font-semibold text-coral">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="neo-shadow-sm mt-6 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-navy bg-navy px-6 py-3.5 font-body text-sm font-bold tracking-widest text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Memproses...
            </>
          ) : (
            "Kirim Bukti Pembayaran"
          )}
        </button>
      </div>
    </form>
  );
}
