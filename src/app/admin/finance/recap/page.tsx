"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ClipboardList, Download, PackageOpen } from "lucide-react";
import { exportRecapExcel } from "@/lib/exportExcel";
import { supabase } from "@/lib/supabaseClient";
import type { Order, OrderStatus } from "@/types/order";
import { buildItemRecap, buildRecapRows } from "@/lib/financeUtils";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

export default function AdminRecapPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("verified");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const recap = useMemo(() => buildItemRecap(filteredOrders), [filteredOrders]);
  const grandTotal = recap.reduce((s, g) => s + g.totalQty, 0);

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };
  const handleExport = () => {
    exportRecapExcel(recap);
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
            <h1 className="font-pixel text-2xl text-navy">Rekap Barang</h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              Buat siapin PO — total tiap desain/varian yang laku.
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

        {loadingOrders ? (
          <div className="mt-10 flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-navy/40" />
          </div>
        ) : recap.length === 0 ? (
          <div className="neo-card mt-6 flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-16 text-center">
            <PackageOpen size={32} className="text-navy/30" />
            <p className="font-body text-sm font-semibold text-navy/50">
              Belum ada barang terjual di filter ini.
            </p>
          </div>
        ) : (
          <>
            {/* Ringkasan total per produk */}
            <div className="neo-card mt-6 overflow-x-auto rounded-3xl bg-white p-5 sm:p-6">
              <h2 className="font-body text-sm font-bold uppercase tracking-wide text-navy/60">
                Ringkasan Total per Produk
              </h2>
              <table className="mt-3 w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-[3px] border-dashed border-navy/15">
                    <th className="py-2 font-body text-xs font-semibold uppercase text-navy/50">
                      Produk
                    </th>
                    <th className="py-2 text-right font-body text-xs font-semibold uppercase text-navy/50">
                      Total Qty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recap.map((group) => (
                    <tr key={group.title} className="border-b border-navy/5">
                      <td className="py-2 font-body text-sm text-navy">
                        {group.title}
                      </td>
                      <td className="py-2 text-right font-body text-sm font-bold text-navy">
                        {group.totalQty}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-3 font-pixel text-xs text-navy">TOTAL</td>
                    <td className="pt-3 text-right font-pixel text-xs text-navy">
                      {grandTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Detail per produk -> per varian */}
            <div className="mt-5 flex flex-col gap-5">
              {recap.map((group) => (
                <div
                  key={group.title}
                  className="neo-card rounded-2xl bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={16} className="text-navy/50" />
                      <h2 className="font-body text-base font-bold text-navy">
                        {group.title}
                      </h2>
                    </div>
                    <span className="neo-pill rounded-full bg-sunny px-3 py-1 font-pixel text-[10px] text-navy">
                      Total: {group.totalQty}
                    </span>
                  </div>

                  <table className="mt-4 w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b-[3px] border-dashed border-navy/15">
                        <th className="py-2 font-body text-xs font-semibold uppercase text-navy/50">
                          Varian
                        </th>
                        <th className="py-2 text-right font-body text-xs font-semibold uppercase text-navy/50">
                          Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.variants.map((v) => (
                        <tr key={v.key} className="border-b border-navy/5">
                          <td className="py-2 font-body text-sm text-navy">
                            {v.label}
                          </td>
                          <td className="py-2 text-right font-body text-sm font-bold text-navy">
                            {v.qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
