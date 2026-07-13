"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [designId, setDesignId] = useState(product.designs[0].id);
  const [color, setColor] = useState(product.colors?.[0] ?? "");
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [materialId, setMaterialId] = useState(product.materials?.[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const activeDesign =
    product.designs.find((d) => d.id === designId) ?? product.designs[0];
  const activeMaterial = product.materials?.find((m) => m.id === materialId);

  const handleAddToCart = () => {
    const variantId = [product.slug, designId, color, size, materialId]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/\s+/g, "_");

    addItem(
      {
        id: variantId,
        slug: product.slug,
        title: product.title,
        image: activeDesign.image,
        price: product.price,
        design: activeDesign.label,
        color: color || undefined,
        size: size || undefined,
        material: activeMaterial?.label,
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="relative mx-auto w-[92%] max-w-5xl">
      <Link
        href="/store"
        className="neo-shadow-sm mb-6 inline-flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
      >
        <ArrowLeft size={16} />
        Kembali ke Store
      </Link>

      <div className="neo-card grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white lg:grid-cols-2">
        {/* Gambar desain aktif */}
        <div className="relative flex h-72 items-center justify-center border-b-[3px] border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)] p-8 sm:h-96 lg:h-auto lg:border-b-0 lg:border-r-[3px]">
          <Image
            src={activeDesign.image}
            alt={`${product.title} - ${activeDesign.label}`}
            width={360}
            height={360}
            className="max-h-full w-auto object-contain"
          />
        </div>

        {/* Info & pemilih varian */}
        <div className="flex flex-col p-6 sm:p-8">
          <span className="neo-pill w-fit rounded-full bg-sunny px-4 py-1.5">
            <span className="font-pixel text-[10px] text-navy">
              {product.categoryLabel}
            </span>
          </span>
          <h1 className="mt-4 font-pixel text-2xl text-navy sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-2 font-pixel text-2xl text-sunny [text-shadow:2px_2px_0_#0D2B4E]">
            {formatRupiah(product.price)}
          </p>
          <p className="mt-3 font-body text-sm text-navy/70">
            {product.description}
          </p>

          {/* Pilihan desain */}
          <div className="mt-6">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
              Design
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {product.designs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesignId(d.id)}
                  aria-label={d.label}
                  className={`overflow-hidden rounded-xl border-[3px] transition-transform ${
                    d.id === designId
                      ? "neo-shadow-sm -translate-y-0.5 border-navy"
                      : "border-navy/30"
                  }`}
                >
                  <Image
                    src={d.image}
                    alt={d.label}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="mt-1.5 font-body text-xs text-navy/50">
              {activeDesign.label}
            </p>
          </div>

          {/* Pilihan warna — cuma muncul kalau produk punya varian warna */}
          {product.colors && (
            <div className="mt-5">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                Color
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-full border-[3px] border-navy px-4 py-1.5 font-body text-xs font-semibold transition-colors ${
                      color === c ? "bg-navy text-white" : "bg-white text-navy"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pilihan ukuran */}
          {product.sizes && (
            <div className="mt-5">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                Ukuran
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-navy font-body text-xs font-bold transition-colors ${
                      size === s ? "bg-sunny text-navy" : "bg-white text-navy"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pilihan bahan */}
          {product.materials && (
            <div className="mt-5">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                Bahan
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaterialId(m.id)}
                    className={`rounded-full border-[3px] border-navy px-4 py-1.5 font-body text-xs font-semibold transition-colors ${
                      materialId === m.id
                        ? "bg-mint text-navy"
                        : "bg-white text-navy"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jumlah */}
          <div className="mt-5">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
              Jumlah
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
                className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-navy bg-white text-navy"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-pixel text-base text-navy">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah"
                className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-navy bg-white text-navy"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`neo-shadow-sm mt-8 flex items-center justify-center gap-2 rounded-full border-[3px] border-navy px-6 py-3 font-body text-sm font-bold tracking-widest transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
              justAdded ? "bg-mint text-navy" : "bg-navy text-white"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={16} />
                Ditambahkan!
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Tambah ke Keranjang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}