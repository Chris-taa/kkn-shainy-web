import { PRODUCTS, getModal, type Product } from "@/data/products";
import type { OrderItem } from "@/types/order";

/**
 * Beberapa order lama nyimpen judul produk dengan typo "SHAini" (1 huruf n)
 * padahal produk aslinya "SHAinni" (2 huruf n). Normalisasi ini nyamain
 * dua-duanya jadi satu bentuk kanonik, supaya title matching gak gagal
 * cuma gara-gara typo lama itu.
 */
function normalizeProductTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/shain+i/gi, "shainni")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cocokkan 1 item pesanan ke produk aslinya di PRODUCTS supaya kita bisa
 * ambil harga modalnya. Ini cuma dipakai untuk hitung modal/profit (KPI
 * Keuangan), BUKAN untuk grouping rekap barang (rekap pakai title langsung
 * dari database, lihat buildItemRecap di bawah).
 * Urutan pencocokan:
 * 1. Lewat judul produk (exact match, typo "SHAini"/"SHAinni" diabaikan)
 * 2. Lewat judul produk (partial match, typo juga diabaikan)
 * 3. Lewat id/label desain (item.design) — fallback kalau judul gak ketemu
 *    sama sekali (jarang kejadian sekarang karena title match udah
 *    typo-tolerant di atas)
 * 4. Lewat categoryLabel yang disebut di title item (jaring pengaman terakhir)
 */
export function findProductForItem(item: OrderItem): Product | undefined {
  const itemTitleNorm = normalizeProductTitle(item.title);

  const byExactTitle = PRODUCTS.find(
    (p) => normalizeProductTitle(p.title) === itemTitleNorm,
  );
  if (byExactTitle) return byExactTitle;

  const byPartialTitle = PRODUCTS.find((p) => {
    const pNorm = normalizeProductTitle(p.title);
    return itemTitleNorm.includes(pNorm) || pNorm.includes(itemTitleNorm);
  });
  if (byPartialTitle) return byPartialTitle;

  if (item.design) {
    const byDesign = PRODUCTS.find((p) =>
      p.designs.some((d) => d.id === item.design || d.label === item.design),
    );
    if (byDesign) return byDesign;
  }

  return PRODUCTS.find((p) =>
    item.title.toLowerCase().includes(p.categoryLabel.toLowerCase()),
  );
}

/**
 * Cari designId dari teks label desain yang tersimpan di item (item.design
 * biasanya nyimpen LABEL, bukan id, misal "ShaiTee 002").
 */
function resolveDesignId(
  product: Product,
  designText?: string,
): string | undefined {
  if (!designText) return undefined;
  return product.designs.find(
    (d) => d.label === designText || d.id === designText,
  )?.id;
}

/**
 * Cari materialId dari teks label bahan yang tersimpan di item.material.
 * Order lama nyimpen label lama tanpa akhiran (misal "Cotton Combed 24s"),
 * sedangkan label produk sekarang punya akhiran ("Cotton Combed 24s —
 * Kaos"). Makanya selain exact match, kita cek juga apakah salah satu
 * label adalah "superset" dari yang lain.
 */
function resolveMaterialId(
  product: Product,
  materialText?: string,
): string | undefined {
  if (!materialText || !product.materials) return undefined;

  const exact = product.materials.find((m) => m.label === materialText);
  if (exact) return exact.id;

  const superset = product.materials.find(
    (m) => m.label.includes(materialText) || materialText.includes(m.label),
  );
  return superset?.id;
}

/**
 * Khusus produk BUNDLE: item.design isinya teks gabungan semua komponen,
 * contoh: "T-Shirt (ShaiTee): ShaiTee 002 (M, Cotton Combed 30s) ·
 * Keychain: EPS 2 · Sticker: EPS TOPIK". Fungsi ini nebak desain & bahan
 * dari komponen UTAMA bundle (komponen pertama di bundleComponents,
 * biasanya kaos) dengan nyari teks label desain/bahannya di dalam string
 * itu, supaya bisa dipetakan ke variantModal yang udah didefinisikan.
 */
function parsePrimaryBundleSelection(
  product: Product,
  designStr?: string,
): { designId?: string; materialId?: string } {
  if (!designStr || !product.bundleComponents?.length) return {};

  const primarySlug = product.bundleComponents[0].productSlug;
  const primaryProduct = PRODUCTS.find((p) => p.slug === primarySlug);
  if (!primaryProduct) return {};

  const designId = primaryProduct.designs.find((d) =>
    designStr.includes(d.label),
  )?.id;

  let materialId: string | undefined;
  if (primaryProduct.materials) {
    if (/long sleeve/i.test(designStr)) {
      materialId = primaryProduct.materials.find((m) =>
        /long sleeve/i.test(m.label),
      )?.id;
    } else if (/30s/.test(designStr)) {
      materialId = primaryProduct.materials.find((m) =>
        /30s/.test(m.label),
      )?.id;
    } else if (/24s/.test(designStr)) {
      materialId = primaryProduct.materials.find(
        (m) => /24s/.test(m.label) && !/long sleeve/i.test(m.label),
      )?.id;
    }
  }

  return { designId, materialId };
}

function getBundleModal(product: Product, designStr?: string): number {
  const { designId, materialId } = parsePrimaryBundleSelection(
    product,
    designStr,
  );
  if (product.variantModal && designId && materialId) {
    const key = `${materialId}_${designId}`;
    if (product.variantModal[key] != null) return product.variantModal[key];
  }
  return product.modal;
}

export function getItemModal(item: OrderItem): number {
  const product = findProductForItem(item);
  if (!product) return 0;

  if (product.category === "bundle") {
    return getBundleModal(product, item.design);
  }

  const designId = resolveDesignId(product, item.design);
  const materialId = resolveMaterialId(product, item.material);
  return getModal(product, { designId, materialId });
}

export function getItemProfit(item: OrderItem): number {
  return (item.price - getItemModal(item)) * item.quantity;
}

export function getOrderModalTotal(items: OrderItem[]): number {
  return items.reduce(
    (sum, item) => sum + getItemModal(item) * item.quantity,
    0,
  );
}

export function getOrderProfit(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + getItemProfit(item), 0);
}

// ============ REKAP BARANG ============

export type RecapVariant = {
  key: string;
  label: string;
  qty: number;
};

export type RecapGroup = {
  title: string;
  variants: RecapVariant[];
  totalQty: number;
};

/**
 * Kelompokkan item dari sekumpulan order jadi rekap per produk -> per varian.
 * Grouping PAKAI item.title LANGSUNG dari database (di-trim doang biar
 * spasi nyasar di depan/belakang gak bikin kepisah). Kalau ada nama produk
 * yang beda-beda dikit (misal "SHAini" vs "SHAinni"), itu harus disamakan
 * di database — bukan ditebak di sini.
 */
export function buildItemRecap(orders: { items: OrderItem[] }[]): RecapGroup[] {
  const map = new Map<string, Map<string, RecapVariant>>();

  for (const order of orders) {
    for (const item of order.items) {
      const title = item.title.trim();

      const parts = [item.design, item.color, item.size, item.material].filter(
        (v): v is string => Boolean(v && v !== "-"),
      );
      const label = parts.length > 0 ? parts.join(" · ") : "Default";

      if (!map.has(title)) map.set(title, new Map());
      const variantMap = map.get(title)!;

      const existing = variantMap.get(label);
      if (existing) {
        existing.qty += item.quantity;
      } else {
        variantMap.set(label, { key: label, label, qty: item.quantity });
      }
    }
  }

  return Array.from(map.entries())
    .map(([title, variantMap]) => {
      const variants = Array.from(variantMap.values()).sort(
        (a, b) => b.qty - a.qty,
      );
      return {
        title,
        variants,
        totalQty: variants.reduce((s, v) => s + v.qty, 0),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export type RecapExportRow = {
  Produk: string;
  Varian: string;
  "Qty Terjual": number | string;
};

/**
 * Bentuk tabel rata kolom buat Excel (Produk | Varian | Qty Terjual),
 * plus baris subtotal per produk dan grand total di paling bawah.
 */
export function buildRecapRows(recap: RecapGroup[]): RecapExportRow[] {
  const rows: RecapExportRow[] = [];

  for (const group of recap) {
    for (const v of group.variants) {
      rows.push({ Produk: group.title, Varian: v.label, "Qty Terjual": v.qty });
    }
    rows.push({
      Produk: `Subtotal — ${group.title}`,
      Varian: "",
      "Qty Terjual": group.totalQty,
    });
    rows.push({ Produk: "", Varian: "", "Qty Terjual": "" });
  }

  const grandTotal = recap.reduce((s, g) => s + g.totalQty, 0);
  rows.push({ Produk: "GRAND TOTAL", Varian: "", "Qty Terjual": grandTotal });

  return rows;
}
