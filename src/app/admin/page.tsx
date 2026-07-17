"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  ExternalLink,
  Loader2,
  PackageOpen,
  X,
  Eye,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiah } from "@/lib/format";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  image?: string;
  design?: string;
  color?: string;
  size?: string;
  material?: string;
};

type Order = {
  id: string;
  order_id: string;
  nama: string;
  no_hp: string;
  payment_method: string;
  items: OrderItem[];
  total_price: number;
  proof_file_url: string | null;
  status: "pending" | "verified" | "rejected";
  created_at: string;
};

const STATUS_STYLE: Record<Order["status"], string> = {
  pending: "bg-sunny text-navy",
  verified: "bg-mint text-navy",
  rejected: "bg-coral text-white",
};

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4"
      onClick={onClose}
    >
      <div
        className="neo-card max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-pixel text-sm text-sunny [text-shadow:1px_1px_0_#0D2B4E]">
              {order.order_id}
            </p>
            <p className="mt-1 font-body text-lg font-bold text-navy">
              {order.nama}
            </p>
            <p className="font-body text-xs text-navy/50">
              {order.no_hp} · {order.payment_method}
            </p>
            <p className="mt-0.5 font-body text-xs text-navy/40">
              {new Date(order.created_at).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-navy bg-white text-navy"
          >
            <X size={16} />
          </button>
        </div>

        <span
          className={`neo-pill mt-3 inline-block rounded-full px-3 py-1 font-pixel text-[10px] ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>

        {/* Daftar item lengkap dengan gambar */}
        <div className="mt-5 flex flex-col gap-3 border-t-[3px] border-dashed border-navy/15 pt-5">
          {order.items.map((item, idx) => {
            const variant = [item.design, item.color, item.size, item.material]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border-[3px] border-navy/10 p-3"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] border-navy/15 bg-[linear-gradient(160deg,#DFF3FB_0%,#BFE0F5_100%)]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ImageIcon size={22} className="text-navy/30" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-body text-sm font-bold text-navy">
                    {item.title}{" "}
                    <span className="text-navy/50">x{item.quantity}</span>
                  </p>
                  {variant && (
                    <p className="font-body text-xs text-navy/60">{variant}</p>
                  )}
                </div>

                <span className="shrink-0 font-body text-sm font-semibold text-navy">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t-[3px] border-dashed border-navy/15 pt-4">
          <span className="font-body text-sm font-bold text-navy">
            Total: {formatRupiah(order.total_price)}
          </span>
          {order.proof_file_url && (
            <a
              href={order.proof_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-body text-xs font-semibold text-navy underline"
            >
              Lihat Bukti Bayar
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("checkouts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
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
      (_event, session) => {
        if (!session) {
          router.replace("/admin/login");
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [router, fetchOrders]);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("checkouts")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)]">
        <Loader2 size={28} className="animate-spin text-navy/50" />
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
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

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const isDateFilterActive = Boolean(startDate || endDate);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF3FB_0%,#F8F1DE_100%)] pb-16 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#9FCBEF_1.5px,transparent_1.5px)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto w-[92%] max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-2xl text-navy">Kelola Pesanan</h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              {pendingCount > 0
                ? `${pendingCount} pesanan menunggu verifikasi`
                : "Semua pesanan sudah diverifikasi"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="neo-shadow-sm flex items-center gap-2 rounded-full border-[3px] border-navy bg-white px-4 py-2 font-body text-sm font-semibold text-navy"
          >
            <LogOut size={16} />
            Keluar
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

          {isDateFilterActive && (
            <button
              type="button"
              onClick={resetDateFilter}
              className="flex items-center gap-1 rounded-full border-[3px] border-navy bg-coral px-3 py-1.5 font-body text-xs font-semibold text-white"
            >
              <X size={14} />
              Reset Tanggal
            </button>
          )}
        </div>

        {/* List order */}
        <div className="mt-6 flex flex-col gap-4">
          {loadingOrders ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-navy/40" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="neo-card flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-16 text-center">
              <PackageOpen size={32} className="text-navy/30" />
              <p className="font-body text-sm font-semibold text-navy/50">
                Belum ada pesanan di kategori ini.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="neo-card rounded-2xl bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-pixel text-sm text-sunny [text-shadow:1px_1px_0_#0D2B4E]">
                      {order.order_id}
                    </p>
                    <p className="mt-1 font-body text-base font-bold text-navy">
                      {order.nama}
                    </p>
                    <p className="font-body text-xs text-navy/50">
                      {order.no_hp} · {order.payment_method}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-navy/40">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <span
                    className={`neo-pill rounded-full px-3 py-1 font-pixel text-[10px] ${STATUS_STYLE[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                {/* Item pesanan */}
                <div className="mt-4 flex flex-col gap-1 border-t-[3px] border-dashed border-navy/15 pt-4">
                  {order.items.map((item, idx) => {
                    const variant = [
                      item.design,
                      item.color,
                      item.size,
                      item.material,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <p key={idx} className="font-body text-sm text-navy/80">
                        {item.title} x{item.quantity}
                        {variant && (
                          <span className="text-navy/50"> ({variant})</span>
                        )}
                        <span className="float-right font-semibold text-navy">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </p>
                    );
                  })}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-dashed border-navy/15 pt-3">
                  <span className="font-body text-sm font-bold text-navy">
                    Total: {formatRupiah(order.total_price)}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDetailOrder(order)}
                      className="flex items-center gap-1 font-body text-xs font-semibold text-navy underline"
                    >
                      <Eye size={12} />
                      Lihat Detail
                    </button>
                    {order.proof_file_url && (
                      <a
                        href={order.proof_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-body text-xs font-semibold text-navy underline"
                      >
                        Lihat Bukti Bayar
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Ganti status */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50">
                    Ubah status:
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as Order["status"],
                      )
                    }
                    className="rounded-full border-[3px] border-navy bg-white px-3 py-1.5 font-body text-xs font-semibold text-navy outline-none disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {updatingId === order.id && (
                    <Loader2 size={14} className="animate-spin text-navy/40" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
        />
      )}
    </div>
  );
}
