import ProductCard from "./ProductCard";
import {
  MAIN_CATEGORIES,
  BUNDLE_PRODUCTS,
  CATEGORY_COVER,
} from "@/data/products";
import { formatRupiah } from "@/lib/format";
import {
  Starfish,
  Hibiscus,
  Shell,
  SunBurst,
  BubbleField,
} from "@/components/icons/SummerIcons";

export default function Store() {
  return (
    <section
      id="store"
      className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#AFD8F2_0%,#6FA9DE_100%)] px-6 py-16 sm:px-10"
    >
      {/* Dekorasi titik halus, senada section lain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_2px,transparent_2px)] [background-size:26px_26px]"
      />
      {/* Motif kotak pixel kecil, nyambung sama nuansa font judul */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 top-16 z-0 h-16 w-16 rotate-12 opacity-20 [background-image:repeating-linear-gradient(45deg,white_0,white_4px,transparent_4px,transparent_8px)]"
      />

      <BubbleField />

      <SunBurst className="pointer-events-none absolute right-10 top-8 z-10 hidden w-10 rotate-12 sm:block" />
      <Starfish className="pointer-events-none absolute left-8 bottom-10 z-10 hidden w-11 -rotate-12 md:block" />
      <Shell className="pointer-events-none absolute right-10 bottom-14 z-10 hidden w-10 rotate-6 lg:block" />
      <Hibiscus className="pointer-events-none absolute -left-3 top-1/3 z-10 hidden w-14 rotate-6 lg:block" />

      <div className="relative z-20 flex flex-col items-center text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-navy/60">
          SHAini Merch
        </p>
        <h2 className="mt-2 font-pixel text-3xl leading-tight text-white [text-shadow:2px_2px_0_#0D2B4E] sm:text-4xl md:text-5xl">
          Shop Our
          <br />
          Official Merchandise!
        </h2>

        {/* 7 kategori utama */}
        <div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {MAIN_CATEGORIES.map((product) => (
            <ProductCard
              key={product.slug}
              category={product.category}
              categoryLabel={product.categoryLabel}
              imageSrc={
                CATEGORY_COVER[product.category] ?? product.designs[0].image
              }
              imageAlt={product.title}
              title={product.title}
              price={formatRupiah(product.price)}
              startingFrom={!!product.materials}
              description={product.description}
              href={`/store/${product.slug}`}
            />
          ))}
        </div>

        {/* Paket bundling + paper bag */}
        <div className="mt-16 w-full">
          <h3 className="font-pixel text-xl text-white [text-shadow:2px_2px_0_#0D2B4E] sm:text-2xl">
            Paket Bundling Hemat
          </h3>
          <div className="mt-8 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BUNDLE_PRODUCTS.map((product) => (
              <ProductCard
                key={product.slug}
                category={product.category}
                categoryLabel={product.categoryLabel}
                imageSrc={product.designs[0].image}
                imageAlt={product.title}
                title={product.title}
                price={formatRupiah(product.price)}
                description={product.description}
                href={`/store/${product.slug}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
