import { PRODUCTS, type Product } from "@/data/products";
import type { OrderItem } from "@/types/order";

/**
 * Cocokkan 1 item pesanan ke produk aslinya di PRODUCTS supaya kita bisa
 * ambil harga modalnya. Ini cuma dipakai untuk hitung modal/profit (KPI
 * Keuangan), BUKAN untuk grouping rekap barang (rekap pakai title langsung
 * dari database, lihat buildItemRecap di bawah).
 * Urutan pencocokan:
 * 1. Lewat id/label desain (item.design)
 * 2. Lewat judul produk (exact atau partial match)
 * 3. Lewat categoryLabel yang disebut di title item
 */
export function findProductForItem(item: OrderItem): Product | undefined {
  if (item.design) {
    const byDesign = PRODUCTS.find((p) =>
      p.designs.some((d) => d.id === item.design || d.label === item.design),
    );
    if (byDesign) return byDesign;
  }

  const byTitle = PRODUCTS.find(
    (p) => p.title === item.title || item.title.includes(p.title),
  );
  if (byTitle) return byTitle;

  return PRODUCTS.find((p) =>
    item.title.toLowerCase().includes(p.categoryLabel.toLowerCase()),
  );
}

export function getItemModal(item: OrderItem): number {
  return findProductForItem(item)?.modal ?? 0;
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
