export type ProductDesign = {
  id: string;
  label: string;
  image: string;
};

export type Product = {
  slug: string;
  category: "shirt" | "totebag" | "mug" | "tumbler";
  categoryLabel: string;
  title: string;
  price: number;
  description: string;
  designs: ProductDesign[];
  colors?: string[];
  sizes?: string[];
  materials?: { id: string; label: string }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "shirt",
    category: "shirt",
    categoryLabel: "SHIRT",
    title: "Shainy Official T-Shirt",
    price: 90000,
    description:
      "Kaos edisi resmi Shainy, tersedia 2 pilihan desain. Bisa pilih warna, ukuran, dan bahan sesuai selera.",
    designs: [
      {
        id: "design1",
        label: "Design 1",
        image: "/images/design1-mockup.png",
      },
      {
        id: "design2",
        label: "Design 2",
        image: "/images/design2-mockup.png",
      },
    ],
    colors: ["White", "Buttercream"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    materials: [
      { id: "30s", label: "Cotton Combed 30s" },
      { id: "24s", label: "Cotton Combed 24s" },
    ],
  },
  {
    slug: "totebag",
    category: "totebag",
    categoryLabel: "TOTEBAG",
    title: "Totebag - Shainy",
    price: 65000,
    description: "Totebag harian dengan desain official Shainy, tersedia 3 pilihan desain.",
    designs: [
      {
        id: "feel-the-sunshine",
        label: "Feel The Sunshine",
        image: "/images/gambar_totebag_feel_the_sunshine.png",
      },
      {
        id: "daily-dose",
        label: "Your Daily Dose",
        image: "/images/gambar_totebag_daily_dose.png",
      },
      {
        id: "step-into-sunshine",
        label: "Step Into The Sunshine",
        image: "/images/gambar_totebag_step_into_sunshine.png",
      },
    ],
  },
  {
    slug: "mug",
    category: "mug",
    categoryLabel: "MUG",
    title: "Mug - Shainy",
    price: 30000,
    description: "Mug keramik dengan artwork Shainy, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "shainy-logo",
        label: "Shainy Logo",
        image: "/images/mug1.png",
      },
      {
        id: "good-vibes",
        label: "Good Vibes",
        image: "/images/gambar_mug_good_vibes.png",
      },
    ],
  },
  {
    slug: "tumbler",
    category: "tumbler",
    categoryLabel: "TUMBLER",
    title: "Tumbler - Shainy",
    price: 55000,
    description: "Botol minum stainless, tersedia 2 pilihan desain.",
    designs: [
      {
        id: "good-vibes",
        label: "Good Vibes",
        image: "/images/tumbler1.png",
      },
      {
        id: "shainy-logo",
        label: "Shainy Logo",
        image: "/images/tumbler2.png",
      },
    ],
  },
];