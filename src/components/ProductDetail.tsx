"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  ImageIcon,
  PackageCheck,
} from "lucide-react";
import { PRODUCTS, getBundlePrice, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";

type BundleSelection = {
  designId: string;
  size?: string;
  materialId?: string;
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [designId, setDesignId] = useState(product.designs[0].id);
  const [color, setColor] = useState(product.colors?.[0] ?? "");
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [materialId, setMaterialId] = useState(
    product.materials?.[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const isBundle = product.category === "bundle";

  // Ambil produk asli tiap komponen bundle (buat referensi daftar desain/size/material)
  const bundleComponentProducts = (product.bundleComponents ?? []).map(
    (comp) => ({
      ...comp,
      refProduct: PRODUCTS.find((p) => p.slug === comp.productSlug),
    }),
  );

  // State pilihan desain per komponen bundle, key = productSlug
  const [bundleSelections, setBundleSelections] = useState<
    Record<string, BundleSelection>
  >(() => {
    const initial: Record<string, BundleSelection> = {};
    bundleComponentProducts.forEach(({ productSlug, refProduct }) => {
      if (!refProduct) return;
      initial[productSlug] = {
        designId: refProduct.designs[0]?.id ?? "",
        size: refProduct.sizes?.[0],
        materialId: refProduct.materials?.[0]?.id,
      };
    });
    return initial;
  });

  const updateBundleSelection = (
    productSlug: string,
    patch: Partial<BundleSelection>,
  ) => {
    setBundleSelections((prev) => ({
      ...prev,
      [productSlug]: { ...prev[productSlug], ...patch },
    }));
  };

  const activeDesign =
    product.designs.find((d) => d.id === designId) ?? product.designs[0];
  const activeMaterial = product.materials?.find((m) => m.id === materialId);
  const activePrice = activeMaterial ? activeMaterial.price : product.price;

  /**
   * Untuk bundle, harga jual bisa berubah tergantung bahan item utama
   * (misalnya kaos long sleeve di Bundling A bikin harga naik ke 135rb).
   * `variantPrice` di data produk pakai key = materialId komponen utama
   * (komponen pertama di bundleComponents, biasanya shirt).
   */
  const primaryBundleComponent = bundleComponentProducts[0];
  const primaryBundleSelection = primaryBundleComponent
    ? bundleSelections[primaryBundleComponent.productSlug]
    : undefined;
  const bundlePrice = isBundle
    ? getBundlePrice(product, primaryBundleSelection?.materialId)
    : product.price;

  const handleAddToCart = () => {
    if (isBundle) {
      // Gabungin semua pilihan desain per item jadi 1 teks catatan,
      // biar tetap cocok sama struktur OrderItem yang cuma punya 1 field `design`.
      const designSummary = bundleComponentProducts
        .map(({ label, productSlug, refProduct }) => {
          if (!refProduct) return null;
          const sel = bundleSelections[productSlug];
          const chosenDesign =
            refProduct.designs.find((d) => d.id === sel?.designId)?.label ??
            refProduct.designs[0]?.label;

          const extra = [
            sel?.size,
            refProduct.materials?.find((m) => m.id === sel?.materialId)?.label,
          ]
            .filter(Boolean)
            .join(", ");

          return `${label}: ${chosenDesign}${extra ? ` (${extra})` : ""}`;
        })
        .filter(Boolean)
        .join(" · ");

      addItem(
        {
          id: `${product.slug}-${Object.values(bundleSelections)
            .map((s) => s.designId)
            .join("-")}`,
          slug: product.slug,
          title: product.title,
          image: product.designs[0].image,
          price: bundlePrice,
          design: designSummary,
        },
        quantity,
      );

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
      return;
    }

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
        price: activePrice,
        design: product.designs.length > 1 ? activeDesign.label : undefined,
        color: color || undefined,
        size: size || undefined,
        material: activeMaterial?.label,
      },
      quantity,
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
        <div className="relative flex h-72 items-center justify-center border-b-[3px] border-navy bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)] p-4 sm:h-96 lg:h-auto lg:border-b-0 lg:border-r-[3px]">
          {imgFailed ? (
            <div className="flex flex-col items-center gap-2 text-navy/40">
              <ImageIcon size={40} strokeWidth={1.75} />
              <span className="font-body text-xs font-semibold">
                Foto menyusul
              </span>
            </div>
          ) : (
            <Image
              key={activeDesign.image}
              src={activeDesign.image}
              alt={`${product.title} - ${activeDesign.label}`}
              width={360}
              height={360}
              className="max-h-full w-auto object-contain"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>

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
            {formatRupiah(isBundle ? bundlePrice : activePrice)}
          </p>
          <p className="mt-3 font-body text-sm text-navy/70">
            {product.description}
          </p>

          {isBundle && product.bundleItems && (
            <div className="mt-4 flex flex-col gap-1.5 rounded-2xl border-[3px] border-dashed border-navy/30 bg-sand/20 p-4">
              {product.bundleItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <PackageCheck size={16} className="shrink-0 text-navy/60" />
                  <span className="font-body text-sm text-navy">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* ===== Pemilih desain untuk produk NON-bundle ===== */}
          {!isBundle && product.designs.length > 1 && (
            <div className="mt-6">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                Design
              </p>
              <div className="mt-2 flex max-h-40 flex-wrap gap-3 overflow-y-auto pr-1">
                {product.designs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDesignId(d.id);
                      setImgFailed(false);
                    }}
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
                      width={56}
                      height={56}
                      className="h-14 w-14 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0.15";
                      }}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1.5 font-body text-xs text-navy/50">
                {activeDesign.label}
              </p>
            </div>
          )}

          {!isBundle && product.colors && (
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

          {!isBundle && product.sizes && (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                  Ukuran
                </p>
                <a
                  href={`${product.designs[0]?.image.split("/").slice(0, -1).join("/")}/sizechart.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs font-semibold text-sky underline"
                >
                  Lihat size chart
                </a>
              </div>
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

          {!isBundle && product.materials && (
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
                    {m.label} · {formatRupiah(m.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== Pemilih desain PER ITEM khusus BUNDLE ===== */}
          {isBundle &&
            bundleComponentProducts.map(
              ({ productSlug, label, refProduct }) => {
                if (!refProduct) return null;
                const sel = bundleSelections[productSlug];
                const selectedDesign = refProduct.designs.find(
                  (d) => d.id === sel?.designId,
                );

                return (
                  <div
                    key={productSlug}
                    className="mt-6 rounded-2xl border-[3px] border-navy/15 p-4"
                  >
                    <p className="font-body text-sm font-bold text-navy">
                      {label}
                    </p>

                    {/* Pilihan desain item ini */}
                    <p className="mt-3 font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                      Design
                    </p>
                    <div className="mt-2 flex max-h-36 flex-wrap gap-2.5 overflow-y-auto pr-1">
                      {refProduct.designs.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() =>
                            updateBundleSelection(productSlug, {
                              designId: d.id,
                            })
                          }
                          aria-label={d.label}
                          className={`overflow-hidden rounded-xl border-[3px] transition-transform ${
                            d.id === sel?.designId
                              ? "neo-shadow-sm -translate-y-0.5 border-navy"
                              : "border-navy/30"
                          }`}
                        >
                          <Image
                            src={d.image}
                            alt={d.label}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.opacity = "0.15";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 font-body text-xs text-navy/50">
                      {selectedDesign?.label}
                    </p>

                    {/* Pilihan ukuran, kalau item ini punya (misal shirt) */}
                    {refProduct.sizes && (
                      <div className="mt-4">
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                          Ukuran
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {refProduct.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() =>
                                updateBundleSelection(productSlug, { size: s })
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-navy font-body text-xs font-bold transition-colors ${
                                sel?.size === s
                                  ? "bg-sunny text-navy"
                                  : "bg-white text-navy"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pilihan bahan, kalau item ini punya (misal shirt) */}
                    {refProduct.materials && (
                      <div className="mt-4">
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy/60">
                          Bahan
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {refProduct.materials.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() =>
                                updateBundleSelection(productSlug, {
                                  materialId: m.id,
                                })
                              }
                              className={`rounded-full border-[3px] border-navy px-3 py-1.5 font-body text-xs font-semibold transition-colors ${
                                sel?.materialId === m.id
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
                  </div>
                );
              },
            )}

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
