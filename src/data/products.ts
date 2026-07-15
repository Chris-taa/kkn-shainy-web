export type ProductDesign = {
  id: string;
  label: string;
  image: string;
};

/** Varian bahan yang harganya beda-beda (khusus Shirt: 24s vs 30s) */
export type MaterialOption = {
  id: string;
  label: string;
  price: number;
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
  /** Harga dasar/ditampilkan di kartu. Kalau ada `materials`, ini dianggap harga termurah. */
  price: number;
  description: string;
  designs: ProductDesign[];
  colors?: string[];
  sizes?: string[];
  materials?: MaterialOption[];
  /** Khusus produk bundling: daftar isi paketnya */
  bundleItems?: string[];
};

const MERCH = "/images/Merch";

export const PRODUCTS: Product[] = [
  // ============ SHIRT ============
  {
    slug: "shirt",
    category: "shirt",
    categoryLabel: "SHIRT",
    title: "ShaiTee — Kaos Official Shainy",
    price: 95000, // termurah (30s), dipakai buat tampilan "mulai dari" di kartu
    description:
      "Kaos official Shainy, tersedia 2 desain. Pilih bahan (24s/30s) dan warna sesuai selera — cek size chart sebelum pilih ukuran.",
    designs: [
      {
        id: "shaitee-001",
        label: "ShaiTee 001",
        image: `${MERCH}/SHIRT/T-shirt 1.png`,
      },
      {
        id: "shaitee-002",
        label: "ShaiTee 002",
        image: `${MERCH}/SHIRT/T-shirt 2.png`,
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    materials: [
      { id: "24s", label: "Cotton Combed 24s", price: 99000 },
      { id: "30s", label: "Cotton Combed 30s", price: 95000 },
    ],
  },

  // ============ TOTEBAG ============
  {
    slug: "totebag",
    category: "totebag",
    categoryLabel: "TOTEBAG",
    title: "ShaiBag — Totebag Official Shainy",
    price: 60000,
    description:
      "Totebag harian dengan desain official Shainy, tersedia 3 pilihan desain.",
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
    title: "ShaiMug — Mug Official Shainy",
    price: 35000,
    description:
      "Mug keramik dengan artwork Shainy, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "shaimug-001",
        label: "ShaiMug 001",
        image: `${MERCH}/MUG/MUG 1.png`,
      },
      {
        id: "shaimug-002",
        label: "ShaiMug 002",
        image: `${MERCH}/MUG/MUG 2.png`,
      },
    ],
  },

  // ============ TUMBLER ============
  {
    slug: "tumbler",
    category: "tumbler",
    categoryLabel: "TUMBLER",
    title: "Shainy — Tumbler Official",
    price: 120000,
    description: "Botol minum stainless, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "shainy-001",
        label: "Shainy 001",
        image: `${MERCH}/TUMBLER/TUMBLER 1.png`,
      },
      {
        id: "shainy-002",
        label: "Shainy 002",
        image: `${MERCH}/TUMBLER/TUMBLER 2.png`,
      },
    ],
  },

  // ============ KEYCHAIN ============
  // CATATAN: nama file asli 25 desain keychain belum dikirim — dipakai pola
  // penamaan "Keychain 1.png" s/d "Keychain 25.png" sesuai konvensi folder
  // lain. TOLONG CEK ULANG nama file asli di public/images/Merch/KEYCHAIN,
  // dan kasih tau kalau beda biar aku perbaiki array ini.
  {
    slug: "keychain",
    category: "keychain",
    categoryLabel: "KEYCHAIN",
    title: "Keychain Official Shainy",
    price: 25000,
    description: "Gantungan kunci akrilik, tersedia 25 pilihan desain.",
    designs: Array.from({ length: 25 }, (_, i) => ({
      id: `keychain-${String(i + 1).padStart(2, "0")}`,
      label: `Keychain ${i + 1}`,
      image: `${MERCH}/KEYCHAIN/Keychain ${i + 1}.png`,
    })),
  },

  // ============ PIN ============
  {
    slug: "pin",
    category: "pin",
    categoryLabel: "PIN",
    title: "Pin Official Shainy",
    price: 10000,
    description: "Pin akrilik/emblem, tersedia 26 pilihan warna & desain.",
    designs: [
      { id: "blue1", label: "Blue 1", image: `${MERCH}/PIN/blue1.png` },
      { id: "blue2", label: "Blue 2", image: `${MERCH}/PIN/blue2.png` },
      { id: "blue3", label: "Blue 3", image: `${MERCH}/PIN/blue3.png` },
      { id: "green1", label: "Green 1", image: `${MERCH}/PIN/green1.png` },
      { id: "pink1", label: "Pink 1", image: `${MERCH}/PIN/pink1.png` },
      { id: "pink1-1", label: "Pink 1B", image: `${MERCH}/PIN/pink1-1.png` },
      { id: "pink2", label: "Pink 2", image: `${MERCH}/PIN/pink2.png` },
      { id: "pink2-1", label: "Pink 2B", image: `${MERCH}/PIN/pink2-1.png` },
      { id: "pink3", label: "Pink 3", image: `${MERCH}/PIN/pink3.png` },
      { id: "pink4", label: "Pink 4", image: `${MERCH}/PIN/pink4.png` },
      { id: "red1", label: "Red 1", image: `${MERCH}/PIN/red1.png` },
      { id: "red1-1", label: "Red 1B", image: `${MERCH}/PIN/red1-1.png` },
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
      { id: "yellow4", label: "Yellow 4", image: `${MERCH}/PIN/yellow4.png` },
    ],
  },

  // ============ STICKER ============
  {
    slug: "sticker",
    category: "sticker",
    categoryLabel: "STICKER",
    title: "Sticker Official Shainy",
    price: 12000,
    description: "Sticker vinyl program Shainy, tersedia 6 pilihan desain.",
    designs: [
      {
        id: "basic",
        label: "Basic Korean",
        image: `${MERCH}/STICKER/BASIC.png`,
      },
      { id: "db", label: "Digital Business", image: `${MERCH}/STICKER/DB.png` },
      { id: "eps", label: "EPS TOPIK", image: `${MERCH}/STICKER/EPS.png` },
      {
        id: "kfb",
        label: "Korean for Business",
        image: `${MERCH}/STICKER/KFB.png`,
      },
      {
        id: "kft",
        label: "Korean for Tourism",
        image: `${MERCH}/STICKER/KFT.png`,
      },
      {
        id: "shainy-000",
        label: "Shainy 000",
        image: `${MERCH}/STICKER/Shainy 000.png`,
      },
    ],
  },

  // ============ PAPER BAG (add-on) ============
  {
    slug: "paper-bag",
    category: "paperbag",
    categoryLabel: "PAPER BAG",
    title: "Paper Bag Shainy",
    price: 3500,
    description: "Tas kertas buat bungkus belanjaan kamu, opsional.",
    designs: [
      { id: "default", label: "Default", image: `${MERCH}/paperbag.png` },
    ],
  },

  // ============ BUNDLING ============
  {
    slug: "bundling-a",
    category: "bundle",
    categoryLabel: "BUNDLING A",
    title: "Bundling A — T-Shirt + Keychain + Sticker",
    price: 129000,
    description:
      "Paket hemat: 1 T-Shirt (pilih desain & bahan saat checkout via catatan), 1 Keychain, 1 Sticker.",
    designs: [
      { id: "default", label: "Bundling A", image: `${MERCH}/bundling 1.jpeg` },
    ],
    bundleItems: ["1x T-Shirt (ShaiTee)", "1x Keychain", "1x Sticker"],
  },
  {
    slug: "bundling-b",
    category: "bundle",
    categoryLabel: "BUNDLING B",
    title: "Bundling B — Tumbler + Sticker + Pin",
    price: 137000,
    description: "Paket hemat: 1 Tumbler, 1 Sticker, 1 Pin.",
    designs: [
      { id: "default", label: "Bundling B", image: `${MERCH}/bundling 2.jpeg` },
    ],
    bundleItems: ["1x Tumbler (Shainy)", "1x Sticker", "1x Pin"],
  },
  {
    slug: "bundling-c",
    category: "bundle",
    categoryLabel: "BUNDLING C",
    title: "Bundling C — Totebag + Pin + Keychain",
    price: 82000,
    description: "Paket hemat: 1 Totebag, 1 Pin, 1 Keychain.",
    designs: [
      { id: "default", label: "Bundling C", image: `${MERCH}/bundling 3.jpeg` },
    ],
    bundleItems: ["1x Totebag (ShaiBag)", "1x Pin", "1x Keychain"],
  },
];

/** 7 kategori utama yang tampil di grid depan Store (punya cover image sendiri) */
export const MAIN_CATEGORIES = PRODUCTS.filter(
  (p) => p.category !== "bundle" && p.category !== "paperbag",
);

/** Produk bundling (belum termasuk Paper Bag — itu jadi add-on di Cart) */
export const BUNDLE_PRODUCTS = PRODUCTS.filter((p) => p.category === "bundle");

/** Data Paper Bag, dipakai sebagai add-on checkbox di halaman /cart */
export const PAPER_BAG = PRODUCTS.find((p) => p.slug === "paper-bag")!;

/** Cover image tiap kategori utama, dipakai di kartu grid Store (bukan gambar desain pertama) */
export const CATEGORY_COVER: Record<string, string> = {
  shirt: `${MERCH}/SHIRT.png`,
  totebag: `${MERCH}/TOTEBAG.png`,
  mug: `${MERCH}/MUG.png`,
  tumbler: `${MERCH}/TUMBLER.png`,
  keychain: `${MERCH}/KEYCHAIN.png`,
  pin: `${MERCH}/PIN.png`,
  sticker: `${MERCH}/STICKER.png`,
};
