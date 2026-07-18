export type ProductDesign = {
  id: string;
  label: string;
  image: string;
};

export type MaterialOption = {
  id: string;
  label: string;
  price: number; // harga jual untuk varian bahan ini
  /**
   * Modal (HPP) per desain untuk bahan ini, kalau modalnya beda-beda
   * tergantung desain yang dipilih. Key = ProductDesign.id.
   * Kalau desain yang dipilih nggak ada di sini, fallback ke `product.modal`.
   */
  modalByDesign?: Record<string, number>;
  /**
   * Foto khusus per desain untuk bahan ini, kalau fotonya beda dari foto
   * default di `ProductDesign.image` (misal kaos biasa vs long sleeve,
   * modelnya beda jadi butuh foto beda). Key = ProductDesign.id.
   * Kalau desain yang dipilih nggak ada di sini, fallback ke
   * `ProductDesign.image` punya desain itu.
   */
  imageByDesign?: Record<string, string>;
};

/** Referensi ke produk asli yang jadi isi bundle, biar bisa ambil daftar desainnya */
export type BundleComponent = {
  productSlug: string;
  label: string; // ditampilkan sebagai judul section pemilih desain
  quantity: number;
};

export type Product = {
  slug: string;
  category:
    | "shirt"
    | "totebag"
    | "mug"
    | "tumbler"
    | "keychain"
    | "pin"
    | "sticker"
    | "paperbag"
    | "bundle";
  categoryLabel: string;
  title: string;
  price: number;
  modal: number; // harga modal/HPP default (dipakai kalau nggak ada override di bawah)
  description: string;
  designs: ProductDesign[];
  colors?: string[];
  sizes?: string[];
  materials?: MaterialOption[];
  bundleItems?: string[];
  bundleComponents?: BundleComponent[];
  /**
   * Khusus produk bundle: modal yang beda-beda tergantung kombinasi
   * bahan + desain dari item utama bundle (biasanya kaos).
   * Key format: `${materialId}_${designId}`, contoh: "24s_shaitee-001".
   */
  variantModal?: Record<string, number>;
  /**
   * Khusus produk bundle: harga jual yang beda-beda tergantung bahan
   * (bukan desain) dari item utama bundle. Contoh: kaos long sleeve
   * bikin harga bundle naik dari 120rb jadi 135rb.
   * Key = materialId, contoh: "24s-ls".
   */
  variantPrice?: Record<string, number>;
};

const MERCH = "/images/Merch";

export const PRODUCTS: Product[] = [
  // ============ SHIRT ============
  {
    slug: "shirt",
    category: "shirt",
    categoryLabel: "SHIRT",
    title: "ShaiTee — Kaos Official SHAinni",
    price: 95000, // harga terendah (bahan 30s), dipakai buat "Mulai dari" di listing
    modal: 89000, // default: bahan 24s kaos, desain 1
    description:
      "Kaos official SHAinni, tersedia 2 desain. Pilih bahan (24s/30s) dan model (kaos/long sleeve) sesuai selera — cek size chart sebelum pilih ukuran. Long sleeve hanya tersedia di bahan Cotton Combed 24s.",
    designs: [
      {
        id: "shaitee-001",
        label: "ShaiTee 001", // "Biru" di tabel modal
        image: `${MERCH}/SHIRT/T-SHIRT 1.png`,
      },
      {
        id: "shaitee-002",
        label: "ShaiTee 002", // "Color / Warna" di tabel modal
        image: `${MERCH}/SHIRT/T-SHIRT 2.png`,
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: [
      {
        id: "24s",
        label: "Cotton Combed 24s — Kaos",
        price: 99000,
        modalByDesign: {
          "shaitee-001": 89000,
          "shaitee-002": 74000,
        },
      },
      {
        id: "24s-ls",
        label: "Cotton Combed 24s — Long Sleeve",
        price: 115000,
        modalByDesign: {
          "shaitee-001": 103000,
          "shaitee-002": 88000,
        },
        imageByDesign: {
          "shaitee-001": `${MERCH}/SHIRT/long-design1.png`,
          "shaitee-002": `${MERCH}/SHIRT/long-design2.png`,
        },
      },
      {
        id: "30s",
        label: "Cotton Combed 30s — Kaos",
        price: 95000,
        modalByDesign: {
          "shaitee-001": 84000,
          "shaitee-002": 69000,
        },
      },
    ],
  },

  // ============ TOTEBAG ============
  {
    slug: "totebag",
    category: "totebag",
    categoryLabel: "TOTEBAG",
    title: "ShaiBag — Totebag Official SHAinni",
    price: 60000,
    modal: 45000,
    description:
      "Totebag harian dengan desain official SHAinni, tersedia 3 pilihan desain.",
    designs: [
      {
        id: "shaibag-001",
        label: "ShaiBag 001",
        image: `${MERCH}/TOTEBAG/TOTEBAG 1.png`,
      },
      {
        id: "shaibag-002",
        label: "ShaiBag 002",
        image: `${MERCH}/TOTEBAG/TOTEBAG 2.png`,
      },
      {
        id: "shaibag-003",
        label: "ShaiBag 003",
        image: `${MERCH}/TOTEBAG/TOTEBAG 3.png`,
      },
    ],
  },

  // ============ MUG ============
  {
    slug: "mug",
    category: "mug",
    categoryLabel: "MUG",
    title: "ShaiMug — Mug Official SHAinni",
    price: 35000,
    modal: 25000,
    description:
      "Mug keramik dengan artwork SHAinni, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "shaimug-001",
        label: "ShaiMug 001",
        image: `${MERCH}/MUG/MUG 1.png`,
      },
      {
        id: "shaimug-002",
        label: "ShaiMug 002",
        image: `${MERCH}/MUG/MUG 2S.png`,
      },
    ],
  },

  // ============ TUMBLER ============
  {
    slug: "tumbler",
    category: "tumbler",
    categoryLabel: "TUMBLER",
    title: "SHAinni — Tumbler Official",
    price: 120000,
    modal: 105000,
    description: "Botol minum stainless, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "SHAinni-001",
        label: "SHAinni 001",
        image: `${MERCH}/TUMBLER/TUMBLER 1.png`,
      },
      {
        id: "SHAinni-002",
        label: "SHAinni 002",
        image: `${MERCH}/TUMBLER/TUMBLER 2S.png`,
      },
    ],
  },

  // ============ KEYCHAIN ============
  {
    slug: "keychain",
    category: "keychain",
    categoryLabel: "KEYCHAIN",
    title: "Keychain Official SHAinni",
    price: 17000,
    modal: 13000,
    description: "Gantungan kunci akrilik, tersedia 26 pilihan desain.",
    designs: [
      { id: "banana", label: "Banana", image: `${MERCH}/KEYCHAIN/banana.png` },
      {
        id: "basic-korean",
        label: "Basic Korean",
        image: `${MERCH}/KEYCHAIN/Basic KoreanS.png`,
      },
      { id: "basic", label: "Basic", image: `${MERCH}/KEYCHAIN/basic.png` },
      { id: "db-2", label: "DB 2", image: `${MERCH}/KEYCHAIN/DBS 2.png` },
      { id: "debe", label: "Debe", image: `${MERCH}/KEYCHAIN/debe.png` },
      { id: "eps-2", label: "EPS 2", image: `${MERCH}/KEYCHAIN/EPSS 2.png` },
      { id: "eps", label: "EPS", image: `${MERCH}/KEYCHAIN/eps.png` },
      { id: "jeruk", label: "Jeruk", image: `${MERCH}/KEYCHAIN/jeruk.png` },
      { id: "jeruk2", label: "Jeruk 2", image: `${MERCH}/KEYCHAIN/jeruk2.png` },
      { id: "kfb-2", label: "KFB 2", image: `${MERCH}/KEYCHAIN/KFBS 2.png` },
      { id: "kfb", label: "KFB", image: `${MERCH}/KEYCHAIN/kfb.png` },
      { id: "kft-2", label: "KFT 2", image: `${MERCH}/KEYCHAIN/KFTS 2.png` },
      { id: "kft", label: "KFT", image: `${MERCH}/KEYCHAIN/kft.png` },
      { id: "kiwi", label: "Kiwi", image: `${MERCH}/KEYCHAIN/kiwi.png` },
      {
        id: "lemon-01",
        label: "Lemon 01",
        image: `${MERCH}/KEYCHAIN/LEMON 01.png`,
      },
      { id: "lemon", label: "Lemon", image: `${MERCH}/KEYCHAIN/lemon.png` },
      { id: "lemon2", label: "Lemon 2", image: `${MERCH}/KEYCHAIN/lemon2.png` },
      {
        id: "watermelon-fruit",
        label: "Watermelon (Fruit)",
        image: `${MERCH}/KEYCHAIN/materwelon.png`,
      },
      { id: "peach", label: "Peach", image: `${MERCH}/KEYCHAIN/peach.png` },
      {
        id: "scaredberry",
        label: "Scaredberry",
        image: `${MERCH}/KEYCHAIN/scaredberry.png`,
      },
      {
        id: "SHAinni-00",
        label: "SHAinni 00",
        image: `${MERCH}/KEYCHAIN/SHAINY 00.png`,
      },
      {
        id: "SHAinni-01",
        label: "SHAinni 01",
        image: `${MERCH}/KEYCHAIN/SHAINY 01.png`,
      },
      {
        id: "SHAinni-02",
        label: "SHAinni 02",
        image: `${MERCH}/KEYCHAIN/SHAINNI.png`,
      },
      {
        id: "sliced-kiwi",
        label: "Sliced Kiwi",
        image: `${MERCH}/KEYCHAIN/sliced kiwi.png`,
      },
      {
        id: "stroberi",
        label: "Stroberi",
        image: `${MERCH}/KEYCHAIN/stroberi.png`,
      },
      {
        id: "watermelon",
        label: "Watermelon",
        image: `${MERCH}/KEYCHAIN/WATERMELON.png`,
      },
    ],
  },

  // ============ PIN ============
  {
    slug: "pin",
    category: "pin",
    categoryLabel: "PIN",
    title: "Pin Official SHAinni",
    price: 15000,
    modal: 10000,
    description: "Pin akrilik/emblem, tersedia 26 pilihan warna & desain.",
    designs: [
      { id: "blue1", label: "Blue 1", image: `${MERCH}/PIN/blue1.png` },
      { id: "blue2", label: "Blue 2", image: `${MERCH}/PIN/blue2.png` },
      { id: "blue3", label: "Blue 3", image: `${MERCH}/PIN/blueS.png` },
      { id: "green1", label: "Green 1", image: `${MERCH}/PIN/green1.png` },
      { id: "pink1", label: "Pink 1", image: `${MERCH}/PIN/pink1.png` },
      { id: "pink1-1", label: "Pink 1B", image: `${MERCH}/PIN/pink1-1.png` },
      { id: "pink2", label: "Pink 2", image: `${MERCH}/PIN/pink2.png` },
      { id: "pink2-1", label: "Pink 2B", image: `${MERCH}/PIN/pinkS.png` },
      { id: "pink3", label: "Pink 3", image: `${MERCH}/PIN/pink3.png` },
      { id: "pink4", label: "Pink 4", image: `${MERCH}/PIN/pink4.png` },
      { id: "red1", label: "Red 1", image: `${MERCH}/PIN/red1.png` },
      { id: "red1-1", label: "Red 1B", image: `${MERCH}/PIN/redS.png` },
      { id: "red2", label: "Red 2", image: `${MERCH}/PIN/red2.png` },
      { id: "red3", label: "Red 3", image: `${MERCH}/PIN/red3.png` },
      { id: "red4", label: "Red 4", image: `${MERCH}/PIN/red4.png` },
      { id: "white1", label: "White 1", image: `${MERCH}/PIN/white1.png` },
      { id: "white1-1", label: "White 1B", image: `${MERCH}/PIN/white1-1.png` },
      { id: "white2", label: "White 2", image: `${MERCH}/PIN/white2.png` },
      { id: "white2-1", label: "White 2B", image: `${MERCH}/PIN/white2-1.png` },
      { id: "white3", label: "White 3", image: `${MERCH}/PIN/white3.png` },
      { id: "white3-1", label: "White 3B", image: `${MERCH}/PIN/white3-1.png` },
      { id: "white4", label: "White 4", image: `${MERCH}/PIN/white4.png` },
      { id: "white4-1", label: "White 4B", image: `${MERCH}/PIN/white4-1.png` },
      { id: "yellow1", label: "Yellow 1", image: `${MERCH}/PIN/yellow1.png` },
      { id: "yellow2", label: "Yellow 2", image: `${MERCH}/PIN/yellow2.png` },
      { id: "yellow4", label: "Yellow 4", image: `${MERCH}/PIN/yellowS.png` },
    ],
  },

  // ============ STICKER ============
  {
    slug: "sticker",
    category: "sticker",
    categoryLabel: "STICKER",
    title: "Sticker Official SHAinni",
    price: 10000,
    modal: 3750,
    description: "Sticker vinyl program SHAinni, tersedia 6 pilihan desain.",
    designs: [
      {
        id: "basic",
        label: "Basic Korean",
        image: `${MERCH}/STICKER/SBASIC.png`,
      },
      {
        id: "db",
        label: "Digital Business",
        image: `${MERCH}/STICKER/SDB.png`,
      },
      { id: "eps", label: "EPS TOPIK", image: `${MERCH}/STICKER/SEPS.png` },
      {
        id: "kfb",
        label: "Korean for Business",
        image: `${MERCH}/STICKER/SKFB.png`,
      },
      {
        id: "kft",
        label: "Korean for Tourism",
        image: `${MERCH}/STICKER/SKFT.png`,
      },
      {
        id: "SHAinni-000",
        label: "SHAinni 000",
        image: `${MERCH}/STICKER/SShainy 000.png`,
      },
    ],
  },

  // ============ PAPER BAG (add-on) ============
  {
    slug: "paper-bag",
    category: "paperbag",
    categoryLabel: "PAPER BAG",
    title: "Paper Bag SHAinni",
    price: 3500,
    modal: 3000, // TODO: belum ada di tabel modal kamu, ganti kalau ada angkanya
    description: "Tas kertas buat bungkus belanjaan kamu, opsional.",
    designs: [{ id: "default", label: "Default", image: `${MERCH}/paper.png` }],
  },

  // ============ BUNDLING ============
  {
    slug: "bundling-a",
    category: "bundle",
    categoryLabel: "BUNDLING A",
    title: "Bundling A — T-Shirt + Keychain + Sticker",
    price: 120000,
    modal: 106000, // default: kaos 24s desain 1 (biru)
    description:
      "Paket hemat: 1 T-Shirt (pilih desain, bahan & ukuran — kaos atau long sleeve), 1 Keychain (pilih desain), 1 Sticker (pilih desain).",
    designs: [
      {
        id: "default",
        label: "Bundling A",
        image: `${MERCH}/BUNDLE 1S.png`,
      },
    ],
    bundleItems: ["1x T-Shirt (ShaiTee)", "1x Keychain", "1x Sticker"],
    bundleComponents: [
      { productSlug: "shirt", label: "T-Shirt (ShaiTee)", quantity: 1 },
      { productSlug: "keychain", label: "Keychain", quantity: 1 },
      { productSlug: "sticker", label: "Sticker", quantity: 1 },
    ],
    // Key = `${materialId}_${designId}` dari kaos yang dipilih dalam bundle
    variantModal: {
      "24s_shaitee-001": 106000, // Bundle A Biru (24s)
      "30s_shaitee-001": 101000, // Bundle A Biru (30s)
      "24s_shaitee-002": 91000, // Bundle A Color (24s)
      "30s_shaitee-002": 86000, // Bundle A Color (30s)
      "24s-ls_shaitee-001": 119750, // Bundle A Long Sleeve (biru)
      "24s-ls_shaitee-002": 104750, // Bundle A Long Sleeve (warna)
    },
    // Key = materialId kaos yang dipilih (harga nggak beda per desain, cuma per bahan)
    variantPrice: {
      "24s": 120000,
      "30s": 120000,
      "24s-ls": 135000, // long sleeve bikin harga bundle naik jadi 135rb
    },
  },
  {
    slug: "bundling-b",
    category: "bundle",
    categoryLabel: "BUNDLING B",
    title: "Bundling B — Tumbler + Sticker + Pin",
    price: 135000,
    modal: 123750,
    description:
      "Paket hemat: 1 Tumbler (pilih desain), 1 Sticker (pilih desain), 1 Pin (pilih desain).",
    designs: [
      {
        id: "default",
        label: "Bundling B",
        image: `${MERCH}/BUNDLE 2S.png`,
      },
    ],
    bundleItems: ["1x Tumbler (SHAinni)", "1x Sticker", "1x Pin"],
    bundleComponents: [
      { productSlug: "tumbler", label: "Tumbler (SHAinni)", quantity: 1 },
      { productSlug: "sticker", label: "Sticker", quantity: 1 },
      { productSlug: "pin", label: "Pin", quantity: 1 },
    ],
  },
  {
    slug: "bundling-c",
    category: "bundle",
    categoryLabel: "BUNDLING C",
    title: "Bundling C — Totebag + Pin + Keychain",
    price: 80000,
    modal: 68000,
    description:
      "Paket hemat: 1 Totebag (pilih desain), 1 Pin (pilih desain), 1 Keychain (pilih desain).",
    designs: [
      {
        id: "default",
        label: "Bundling C",
        image: `${MERCH}/BUNDLE 3S.png`,
      },
    ],
    bundleItems: ["1x Totebag (ShaiBag)", "1x Pin", "1x Keychain"],
    bundleComponents: [
      { productSlug: "totebag", label: "Totebag (ShaiBag)", quantity: 1 },
      { productSlug: "pin", label: "Pin", quantity: 1 },
      { productSlug: "keychain", label: "Keychain", quantity: 1 },
    ],
  },
];

export const MAIN_CATEGORIES = PRODUCTS.filter(
  (p) => p.category !== "bundle" && p.category !== "paperbag",
);

export const BUNDLE_PRODUCTS = PRODUCTS.filter((p) => p.category === "bundle");

export const PAPER_BAG = PRODUCTS.find((p) => p.slug === "paper-bag")!;

export const CATEGORY_COVER: Record<string, string> = {
  shirt: `${MERCH}/SHIRTS.png`,
  totebag: `${MERCH}/TOTEBAGSS.png`,
  mug: `${MERCH}/MUGSS.png`,
  tumbler: `${MERCH}/TUMBLERSS.png`,
  keychain: `${MERCH}/KEYCHAINSS.png`,
  pin: `${MERCH}/PINSS.png`,
  sticker: `${MERCH}/STICKERSS.png`,
};

/**
 * Ambil modal (HPP) efektif untuk sebuah produk, dengan mempertimbangkan
 * desain & bahan yang dipilih (kalau ada override-nya).
 * Fallback ke `product.modal` kalau kombinasi desain+bahan nggak punya override.
 */
export function getModal(
  product: Product,
  opts: { designId?: string; materialId?: string } = {},
): number {
  const material =
    product.materials?.find((m) => m.id === opts.materialId) ??
    product.materials?.[0];

  if (
    material?.modalByDesign &&
    opts.designId &&
    material.modalByDesign[opts.designId] != null
  ) {
    return material.modalByDesign[opts.designId];
  }

  return product.modal;
}

/**
 * Khusus produk bundle: ambil modal berdasarkan bahan+desain dari item
 * utama bundle (misalnya kaos di Bundling A). Fallback ke `product.modal`
 * kalau bundle-nya nggak punya variantModal atau kombinasinya nggak ketemu.
 */
export function getBundleVariantModal(
  product: Product,
  materialId?: string,
  designId?: string,
): number {
  if (product.variantModal && materialId && designId) {
    const key = `${materialId}_${designId}`;
    if (product.variantModal[key] != null) {
      return product.variantModal[key];
    }
  }
  return product.modal;
}

/**
 * Khusus produk bundle: ambil harga jual berdasarkan bahan yang dipilih
 * dari item utama bundle (misalnya kaos di Bundling A). Fallback ke
 * `product.price` kalau bundle-nya nggak punya variantPrice atau
 * bahannya nggak ketemu di daftar override.
 */
export function getBundlePrice(product: Product, materialId?: string): number {
  if (
    product.variantPrice &&
    materialId &&
    product.variantPrice[materialId] != null
  ) {
    return product.variantPrice[materialId];
  }
  return product.price;
}

/**
 * Ambil foto yang tepat untuk sebuah desain, dengan mempertimbangkan
 * bahan yang dipilih. Kalau bahan itu punya foto override buat desain
 * ini (misal Long Sleeve punya foto beda dari kaos biasa), pakai itu.
 * Fallback ke foto default desainnya kalau nggak ada override.
 */
export function getDesignImage(
  product: Product,
  designId: string,
  materialId?: string,
): string {
  const design = product.designs.find((d) => d.id === designId);
  const material = product.materials?.find((m) => m.id === materialId);

  if (material?.imageByDesign?.[designId]) {
    return material.imageByDesign[designId];
  }

  return design?.image ?? product.designs[0]?.image ?? "";
}
