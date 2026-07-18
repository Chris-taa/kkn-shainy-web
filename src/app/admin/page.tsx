"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getItemModal,
  getOrderModalTotal,
  getOrderProfit,
  buildRecapRows,
} from "@/lib/financeUtils";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Wallet,
  TrendingUp,
  Download,
  PackageOpen,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { exportFinanceExcel } from "@/lib/exportExcel";
import { buildItemRecap } from "@/lib/financeUtils";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiah } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-sunny text-navy",
  verified: "bg-mint text-navy",
  rejected: "bg-coral text-white",
};

export default function AdminFinancePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("verified");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("checkouts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data as Order[]);
    setLoadingOrders(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setChecking(false);
      fetchOrders();
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        if (!session) router.replace("/admin/login");
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [router, fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;

      const orderDate = new Date(o.created_at);
      orderDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (orderDate > end) return false;
      }
      return true;
    });
  }, [orders, filter, startDate, endDate]);

  const totalPenjualan = filteredOrders.reduce((s, o) => s + o.total_price, 0);
  const totalModal = filteredOrders.reduce(
    (s, o) => s + getOrderModalTotal(o.items),
    0,
  );
  const keuntunganBersih = totalPenjualan - totalModal;

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleExport = () => {
    const recap = buildItemRecap(filteredOrders);
    exportFinanceExcel({
      filterLabel: filter === "all" ? "Semua" : STATUS_LABEL[filter],
      startDate,
      endDate,
      orders: filteredOrders,
      recap,
    });
  };

  const requestDelete = (order: Order) => {
    if (order.status !== "rejected") return;
    setOrderToDelete(order);
  };

  const cancelDelete = () => {
    if (deletingId) return; // jangan bisa dibatalkan saat sedang proses
    setOrderToDelete(null);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    setDeletingId(orderToDelete.id);
    const { error } = await supabase
      .from("checkouts")
      .delete()
      .eq("id", orderToDelete.id);

    if (error) {
      alert("Gagal menghapus data: " + error.message);
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
    }
    setDeletingId(null);
    setOrderToDelete(null);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)]">
        <Loader2 size={28} className="animate-spin text-navy/50" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-2xl text-navy">Keuangan</h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              Ringkasan penjualan &amp; keuntungan bersih.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-mint px-4 py-2 font-body text-sm font-semibold text-navy"
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>

        {/* Filter status */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "pending", "verified", "rejected"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border-[3px] border-navy px-4 py-1.5 font-body text-xs font-semibold transition-colors ${
                filter === f ? "bg-navy text-white" : "bg-white text-navy"
              }`}
            >
              {f === "all" ? "Semua" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        {/* Filter tanggal */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-3 py-1.5">
            <label className="font-body text-xs font-semibold text-navy/50">
              Dari
            </label>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent font-body text-xs font-semibold text-navy outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-3 py-1.5">
            <label className="font-body text-xs font-semibold text-navy/50">
              Sampai
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent font-body text-xs font-semibold text-navy outline-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={resetDateFilter}
              className="rounded-full border-[3px] border-navy bg-coral px-3 py-1.5 font-body text-xs font-semibold text-white"
            >
              Reset Tanggal
            </button>
          )}
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="neo-card rounded-3xl bg-white p-6">
            <div className="flex items-center gap-2 text-navy/50">
              <TrendingUp size={18} />
              <span className="font-body text-xs font-semibold uppercase tracking-wide">
                Total Penjualan
              </span>
            </div>
            <p className="mt-2 font-pixel text-2xl text-navy">
              {loadingOrders ? "..." : formatRupiah(totalPenjualan)}
            </p>
            <p className="mt-1 font-body text-xs text-navy/40">
              {filteredOrders.length} pesanan
            </p>
          </div>

          <div className="neo-card rounded-3xl bg-white p-6">
            <div className="flex items-center gap-2 text-navy/50">
              <Wallet size={18} />
              <span className="font-body text-xs font-semibold uppercase tracking-wide">
                Keuntungan Bersih
              </span>
            </div>
            <p className="mt-2 font-pixel text-2xl text-navy">
              {loadingOrders ? "..." : formatRupiah(keuntunganBersih)}
            </p>
            <p className="mt-1 font-body text-xs text-navy/40">
              Modal: {formatRupiah(totalModal)}
            </p>
          </div>
        </div>

        {/* Tabel per order */}
        <div className="mt-6">
          {loadingOrders ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-navy/40" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="neo-card flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-16 text-center">
              <PackageOpen size={32} className="text-navy/30" />
              <p className="font-body text-sm font-semibold text-navy/50">
                Belum ada data di rentang/filter ini.
              </p>
            </div>
          ) : (
            <div className="neo-card overflow-x-auto rounded-3xl bg-white p-5 sm:p-6">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b-[3px] border-dashed border-navy/15">
                    <th className="py-2 pr-3 font-body text-xs font-semibold uppercase text-navy/50">
                      Nama
                    </th>
                    <th className="py-2 pr-3 font-body text-xs font-semibold uppercase text-navy/50">
                      List Order
                    </th>
                    <th className="py-2 pr-3 text-right font-body text-xs font-semibold uppercase text-navy/50">
                      Modal
                    </th>
                    <th className="py-2 pr-3 text-right font-body text-xs font-semibold uppercase text-navy/50">
                      Total Payment
                    </th>
                    <th className="py-2 pr-3 text-right font-body text-xs font-semibold uppercase text-navy/50">
                      Keuntungan
                    </th>
                    <th className="py-2 pl-3 text-right font-body text-xs font-semibold uppercase text-navy/50">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const modal = getOrderModalTotal(order.items);
                    const keuntungan = order.total_price - modal;

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-navy/5 align-top"
                      >
                        <td className="py-3 pr-3">
                          <p className="font-body text-sm font-bold text-navy">
                            {order.nama}
                          </p>
                          <p className="font-body text-xs text-navy/40">
                            {order.order_id}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 font-pixel text-[9px] ${STATUS_STYLE[order.status]}`}
                          >
                            {STATUS_LABEL[order.status]}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <ul className="flex flex-col gap-0.5">
                            {order.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="font-body text-xs text-navy/70"
                              >
                                {item.title} x{item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 pr-3 text-right font-body text-sm text-navy/70">
                          {formatRupiah(modal)}
                        </td>
                        <td className="py-3 pr-3 text-right font-body text-sm font-semibold text-navy">
                          {formatRupiah(order.total_price)}
                        </td>
                        <td className="py-3 pr-3 text-right font-body text-sm font-bold text-navy">
                          {formatRupiah(keuntungan)}
                        </td>
                        <td className="py-3 pl-3 text-right">
                          {order.status === "rejected" && (
                            <button
                              type="button"
                              onClick={() => requestDelete(order)}
                              disabled={deletingId === order.id}
                              className="inline-flex items-center gap-1 rounded-full border-[3px] border-navy bg-coral px-2.5 py-1 font-body text-xs font-semibold text-white disabled:opacity-50"
                            >
                              {deletingId === order.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal konfirmasi hapus (custom, matching tema) */}
      {orderToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={cancelDelete}
        >
          <div
            className="neo-card w-full max-w-sm rounded-3xl border-[3px] border-navy bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-coral text-white">
                <AlertTriangle size={18} />
              </div>
              <h2 className="font-pixel text-base text-navy">Hapus Pesanan?</h2>
            </div>

            <p className="mt-4 font-body text-sm text-navy/70">
              Pesanan{" "}
              <span className="font-bold text-navy">
                &quot;{orderToDelete.nama}&quot;
              </span>{" "}
              ({orderToDelete.order_id}) akan dihapus permanen. Aksi ini tidak
              bisa dibatalkan.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={!!deletingId}
                className="rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-xs font-semibold text-navy disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="flex items-center gap-2 rounded-full border-[3px] border-navy bg-coral px-4 py-2 font-body text-xs font-semibold text-white disabled:opacity-50"
              >
                {deletingId ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
