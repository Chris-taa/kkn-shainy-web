import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  return {
    title: product
      ? `${product.title} | Shainy Store`
      : "Produk | Shainy Store",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />
      <div className="relative">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
