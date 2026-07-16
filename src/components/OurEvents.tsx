"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EventCard from "./EventCard";
import RegistrationModal from "./RegistrationModal";
import { supabase } from "@/lib/supabaseClient";
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

type EventStatus = "not_open" | "open" | "closed";

const CLOSING_CEREMONY_TITLE = "Culture Exchange — Closing Ceremony";

const BUTTON_TEXT: Record<EventStatus, string> = {
  not_open: "COMMING SOON",
  open: "REGISTER",
  closed: "CLOSED",
};

export default function OurEvents() {
  const [activeEvent, setActiveEvent] = useState<EventInfo | null>(null);
  const [status, setStatus] = useState<EventStatus>("not_open");
  const [capacity, setCapacity] = useState<number>(0);
  const [registeredCount, setRegisteredCount] = useState<number | null>(null);

  const closingCeremony: EventInfo = {
    title: CLOSING_CEREMONY_TITLE,
    date: "27 July 2026",
    location: "Gedung Dome, Universitas Mataram",
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchEventData() {
      const { data: eventRow } = await supabase
        .from("events")
        .select("status, capacity")
        .eq("title", CLOSING_CEREMONY_TITLE)
        .single();

      if (eventRow && isMounted) {
        setStatus(eventRow.status as EventStatus);
        setCapacity(eventRow.capacity ?? 0);
      }

      const { count } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_title", CLOSING_CEREMONY_TITLE);

      if (isMounted) setRegisteredCount(count ?? 0);
    }

    fetchEventData();
    return () => {
      isMounted = false;
    };
  }, []);

  const registeredText =
    registeredCount === null
      ? "Loading..."
      : `${registeredCount} / ${capacity} Registered`;

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
              buttonText={BUTTON_TEXT[status]}
              buttonStatus={status}
              onRegisterClick={() =>
                status === "open" && setActiveEvent(closingCeremony)
              }
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
