import ExcelJS from "exceljs";
import type { Order, OrderStatus } from "@/types/order";
import { getItemModal, getOrderModalTotal, type RecapGroup } from "@/lib/financeUtils";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const COLOR = {
  headerBg: "FF0D2B4E", // navy
  headerFont: "FFFFFFFF",
  subtotalBg: "FFFCE38A", // kuning (sunny)
  totalBg: "FF0D2B4E",
  totalFont: "FFFFFFFF",
  border: "FFD9E2EC",
  zebra: "FFF1F8FC",
};

const RP_FORMAT = '"Rp" #,##0';

function border(): Partial<ExcelJS.Borders> {
  const side: ExcelJS.Border = { style: "thin", color: { argb: COLOR.border } };
  return { top: side, left: side, bottom: side, right: side };
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.height = 20;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: COLOR.headerFont } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.headerBg } };
    cell.alignment = { vertical: "middle" };
    cell.border = border();
  });
}

async function downloadWorkbook(wb: ExcelJS.Workbook, fileName: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ============ SHEET: RINGKASAN ============

function buildRingkasanSheet(
  wb: ExcelJS.Workbook,
  info: {
    status: string;
    startDate: string;
    endDate: string;
    jumlahPesanan: number;
    totalPenjualan: number;
    totalModal: number;
    keuntunganBersih: number;
  },
) {
  const sheet = wb.addWorksheet("Ringkasan");

  sheet.mergeCells("A1:B1");
  const title = sheet.getCell("A1");
  title.value = "LAPORAN KEUANGAN";
  title.font = { bold: true, size: 14, color: { argb: COLOR.headerFont } };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.headerBg } };
  title.alignment = { vertical: "middle" };
  sheet.getRow(1).height = 26;

  const headerRow = sheet.addRow(["Keterangan", "Nilai"]);
  styleHeaderRow(headerRow);

  const rows: [string, string | number, boolean][] = [
    ["Status", info.status, false],
    ["Dari Tanggal", info.startDate || "-", false],
    ["Sampai Tanggal", info.endDate || "-", false],
    ["Jumlah Pesanan", info.jumlahPesanan, false],
    ["Total Penjualan", info.totalPenjualan, true],
    ["Total Modal", info.totalModal, true],
    ["Keuntungan Bersih", info.keuntunganBersih, true],
  ];

  rows.forEach(([label, value, isCurrency]) => {
    const row = sheet.addRow([label, value]);
    const [labelCell, valueCell] = [row.getCell(1), row.getCell(2)];
    labelCell.font = { bold: true };
    labelCell.border = border();
    valueCell.border = border();
    valueCell.alignment = { horizontal: "right" };
    if (isCurrency) valueCell.numFmt = RP_FORMAT;

    if (label === "Keuntungan Bersih") {
      [labelCell, valueCell].forEach((c) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.subtotalBg } };
        c.font = { bold: true };
      });
    }
  });

  sheet.getColumn(1).width = 24;
  sheet.getColumn(2).width = 24;
}

// ============ SHEET: PER ORDER ============

function buildPerOrderSheet(wb: ExcelJS.Workbook, orders: Order[]) {
  const sheet = wb.addWorksheet("Per Order");
  const headerRow = sheet.addRow([
    "Order ID", "Tanggal", "Nama", "Status", "List Order", "Modal", "Total Payment", "Keuntungan",
  ]);
  styleHeaderRow(headerRow);
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  orders.forEach((o, idx) => {
    const modal = getOrderModalTotal(o.items);
    const row = sheet.addRow([
      o.order_id,
      new Date(o.created_at).toLocaleString("id-ID"),
      o.nama,
      STATUS_LABEL[o.status],
      o.items.map((i) => `${i.title} x${i.quantity}`).join(", "),
      modal,
      o.total_price,
      o.total_price - modal,
    ]);

    row.eachCell((cell, colNumber) => {
      cell.border = border();
      if (colNumber >= 6) {
        cell.numFmt = RP_FORMAT;
        cell.alignment = { horizontal: "right" };
      }
      if (colNumber === 5) cell.alignment = { wrapText: true, vertical: "top" };
      if (idx % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.zebra } };
      }
    });
  });

  sheet.columns = [
    { width: 14 }, { width: 18 }, { width: 20 }, { width: 12 },
    { width: 45 }, { width: 14 }, { width: 16 }, { width: 16 },
  ];
}

// ============ SHEET: DETAIL ITEM ============

function buildDetailItemSheet(wb: ExcelJS.Workbook, orders: Order[]) {
  const sheet = wb.addWorksheet("Detail Item");
  const headerRow = sheet.addRow([
    "Order ID", "Tanggal", "Nama", "Status", "Produk", "Desain", "Warna",
    "Ukuran", "Bahan", "Qty", "Harga Satuan", "Modal Satuan", "Subtotal", "Profit",
  ]);
  styleHeaderRow(headerRow);
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  let rowIndex = 0;
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const modal = getItemModal(item);
      const row = sheet.addRow([
        o.order_id,
        new Date(o.created_at).toLocaleString("id-ID"),
        o.nama,
        STATUS_LABEL[o.status],
        item.title,
        item.design ?? "-",
        item.color ?? "-",
        item.size ?? "-",
        item.material ?? "-",
        item.quantity,
        item.price,
        modal,
        item.price * item.quantity,
        (item.price - modal) * item.quantity,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = border();
        if (colNumber >= 11) {
          cell.numFmt = RP_FORMAT;
          cell.alignment = { horizontal: "right" };
        }
        if (rowIndex % 2 === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.zebra } };
        }
      });
      rowIndex++;
    });
  });

  sheet.columns = [
    { width: 14 }, { width: 18 }, { width: 20 }, { width: 12 }, { width: 30 },
    { width: 16 }, { width: 12 }, { width: 10 }, { width: 12 }, { width: 6 },
    { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 },
  ];
}

// ============ SHEET: REKAP BARANG ============

function buildRecapSheet(wb: ExcelJS.Workbook, recap: RecapGroup[]) {
  const sheet = wb.addWorksheet("Rekap Barang");
  const headerRow = sheet.addRow(["Produk", "Varian", "Qty Terjual"]);
  styleHeaderRow(headerRow);
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  let grandTotal = 0;

  recap.forEach((group) => {
    group.variants.forEach((v) => {
      const row = sheet.addRow([group.title, v.label, v.qty]);
      row.eachCell((cell) => (cell.border = border()));
      row.getCell(3).alignment = { horizontal: "right" };
    });

    const subtotal = sheet.addRow([`Subtotal — ${group.title}`, "", group.totalQty]);
    subtotal.eachCell((cell) => {
      cell.border = border();
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.subtotalBg } };
    });
    subtotal.getCell(3).alignment = { horizontal: "right" };

    grandTotal += group.totalQty;
  });

  const total = sheet.addRow(["GRAND TOTAL", "", grandTotal]);
  total.eachCell((cell) => {
    cell.border = border();
    cell.font = { bold: true, color: { argb: COLOR.totalFont } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.totalBg } };
  });
  total.getCell(3).alignment = { horizontal: "right" };

  sheet.columns = [{ width: 42 }, { width: 30 }, { width: 14 }];
}

// ============ ENTRY POINTS ============

export async function exportFinanceExcel(params: {
  filterLabel: string;
  startDate: string;
  endDate: string;
  orders: Order[];
  recap: RecapGroup[];
}) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SHAinni Admin";
  wb.created = new Date();

  const totalPenjualan = params.orders.reduce((s, o) => s + o.total_price, 0);
  const totalModal = params.orders.reduce((s, o) => s + getOrderModalTotal(o.items), 0);

  buildRingkasanSheet(wb, {
    status: params.filterLabel,
    startDate: params.startDate,
    endDate: params.endDate,
    jumlahPesanan: params.orders.length,
    totalPenjualan,
    totalModal,
    keuntunganBersih: totalPenjualan - totalModal,
  });
  buildPerOrderSheet(wb, params.orders);
  buildDetailItemSheet(wb, params.orders);
  buildRecapSheet(wb, params.recap);

  await downloadWorkbook(wb, `keuangan_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function exportRecapExcel(recap: RecapGroup[]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SHAinni Admin";
  wb.created = new Date();

  buildRecapSheet(wb, recap);

  await downloadWorkbook(wb, `rekap_barang_${new Date().toISOString().slice(0, 10)}.xlsx`);
}