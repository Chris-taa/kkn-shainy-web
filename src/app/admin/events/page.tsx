"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, CalendarClock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type EventStatus = "not_open" | "open" | "closed";

type EventRow = {
  id: string;
  title: string;
  status: EventStatus;
  event_date: string | null;
  location: string | null;
  capacity: number;
};

const STATUS_LABEL: Record<EventStatus, string> = {
  not_open: "Belum Open",
  open: "Register",
  closed: "Closed",
};

const STATUS_STYLE: Record<EventStatus, string> = {
  not_open: "bg-sunny text-navy",
  open: "bg-mint text-navy",
  closed: "bg-coral text-white",
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setEvents(data as EventRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setChecking(false);
      fetchEvents();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router, fetchEvents]);

  const handleStatusChange = async (id: string, status: EventStatus) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
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

      <div className="relative mx-auto w-[92%] max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-2xl text-navy">Kelola Event</h1>
            <p className="mt-1 font-body text-sm text-navy/60">
              Atur status event yang tampil di website
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

        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-navy/40" />
            </div>
          ) : events.length === 0 ? (
            <div className="neo-card flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-16 text-center">
              <CalendarClock size={32} className="text-navy/30" />
              <p className="font-body text-sm font-semibold text-navy/50">
                Belum ada event terdaftar.
              </p>
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="neo-card rounded-2xl bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-base font-bold text-navy">
                      {ev.title}
                    </p>
                    <p className="font-body text-xs text-navy/50">
                      {ev.event_date} · {ev.location}
                    </p>
                    <p className="font-body text-xs text-navy/40">
                      Kapasitas: {ev.capacity}
                    </p>
                  </div>

                  <span
                    className={`neo-pill rounded-full px-3 py-1 font-pixel text-[10px] ${STATUS_STYLE[ev.status]}`}
                  >
                    {STATUS_LABEL[ev.status]}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t-[3px] border-dashed border-navy/15 pt-4">
                  <span className="font-body text-xs font-semibold uppercase tracking-wide text-navy/50">
                    Ubah status:
                  </span>
                  <select
                    value={ev.status}
                    disabled={updatingId === ev.id}
                    onChange={(e) =>
                      handleStatusChange(ev.id, e.target.value as EventStatus)
                    }
                    className="rounded-full border-[3px] border-navy bg-white px-3 py-1.5 font-body text-xs font-semibold text-navy outline-none disabled:opacity-50"
                  >
                    <option value="not_open">Belum Open</option>
                    <option value="open">Register</option>
                    <option value="closed">Closed</option>
                  </select>
                  {updatingId === ev.id && (
                    <Loader2 size={14} className="animate-spin text-navy/40" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}