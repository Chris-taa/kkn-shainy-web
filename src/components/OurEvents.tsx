"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EventCard from "./EventCard";
import RegistrationModal from "./RegistrationModal";
import { supabase } from "@/lib/supabaseClient"; // sesuaikan path client supabase-mu
import {
  Starfish,
  Hibiscus,
  Shell,
  BubbleField,
} from "@/components/icons/SummerIcons";

type EventInfo = {
  title: string;
  date: string;
  location: string;
};

const CLOSING_CEREMONY_TITLE = "Culture Exchange — Closing Ceremony";
const CLOSING_CEREMONY_CAPACITY = 350;

export default function OurEvents() {
  const [activeEvent, setActiveEvent] = useState<EventInfo | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number | null>(null);

  const closingCeremony: EventInfo = {
    title: CLOSING_CEREMONY_TITLE,
    date: "27 July 2026",
    location: "Gedung Dome, Universitas Mataram",
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchCount() {
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_title", CLOSING_CEREMONY_TITLE);

      if (!error && isMounted) {
        setRegisteredCount(count ?? 0);
      }
    }

    fetchCount();

    // Opsional: realtime update tiap ada registrasi baru
    const channel = supabase
      .channel("registrations-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
          filter: `event_title=eq.${CLOSING_CEREMONY_TITLE}`,
        },
        () => {
          fetchCount();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const registeredText =
    registeredCount === null
      ? "Loading..."
      : `${registeredCount} / ${CLOSING_CEREMONY_CAPACITY} Registered`;

  return (
    <section
      id="our-events"
      className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#9FCBEF_0%,#6FA9DE_100%)] px-6 py-12 sm:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_2px,transparent_2px)] [background-size:26px_26px]"
      />

      <BubbleField />

      <Image
        src="/images/gambar_daun_palem.png"
        alt=""
        width={140}
        height={140}
        aria-hidden
        className="pointer-events-none absolute -left-4 top-2 z-0 w-16 opacity-90 sm:w-20"
      />

      <Starfish className="pointer-events-none absolute left-4 bottom-6 z-10 hidden w-11 -rotate-12 sm:block" />
      <Shell className="pointer-events-none absolute right-6 bottom-10 z-10 hidden w-11 rotate-6 sm:block" />
      <Hibiscus className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden w-14 -translate-y-1/2 rotate-6 lg:block" />

      <div className="relative z-20 flex flex-col items-center">
        <div className="neo-pill mb-10 rounded-full bg-white px-8 py-3">
          <h2 className="font-bold text-xl text-navy sm:text-2xl">
            Our Events
          </h2>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:flex-wrap">
          <div className="w-full max-w-lg">
            <EventCard
              badgeText="CLOSING CEREMONY"
              imageSrc="/images/closing.png"
              imageAlt="Closing Ceremony Batch 2025"
              title="Culture Exchange"
              subtitle="Closing Ceremony Event"
              eventDate="27 July 2026"
              locationText={"Gedung Dome\nUniversitas Mataram"}
              registeredCount={registeredText}
              buttonText="REGISTER"
              buttonStatus="open"
              onRegisterClick={() => setActiveEvent(closingCeremony)}
            />
          </div>
        </div>
      </div>

      {activeEvent && (
        <RegistrationModal
          eventTitle={activeEvent.title}
          eventDate={activeEvent.date}
          eventLocation={activeEvent.location}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </section>
  );
}
