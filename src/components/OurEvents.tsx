"use client";

import { useState } from "react";
import Image from "next/image";
import EventCard from "./EventCard";
import RegistrationModal from "./RegistrationModal";
import { Starfish, Hibiscus, Shell, BubbleField } from "@/components/icons/SummerIcons";

type EventInfo = {
  title: string;
  date: string;
  location: string;
};

export default function OurEvents() {
  const [activeEvent, setActiveEvent] = useState<EventInfo | null>(null);

  const closingCeremony: EventInfo = {
    title: "Culture Exchange — Closing Ceremony",
    date: "27 July 2026",
    location: "Gedung Dome, Universitas Mataram",
  };

  const volunteerRecruitment: EventInfo = {
    title: "International Community Service Summer 2026",
    date: "25 Feb - 5 March",
    location: "Pendaftaran online",
  };

  return (
    <section
      id="our-events"
      className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#9FCBEF_0%,#6FA9DE_100%)] px-6 py-12 sm:px-10"
    >
      {/* Dekorasi titik halus, senada dengan section lain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_2px,transparent_2px)] [background-size:26px_26px]"
      />

      {/* Gelembung ambient khas summer */}
      <BubbleField />

      {/* Daun palem pojok kiri atas — ditaruh agak turun & kecil biar gak nabrak navbar mengambang */}
      <Image
        src="/images/gambar_daun_palem.png"
        alt=""
        width={140}
        height={140}
        aria-hidden
        className="pointer-events-none absolute -left-4 top-2 z-0 w-16 opacity-90 sm:w-20"
      />

      {/* Ikon pantai — semuanya ditaruh di area tengah-bawah section, jauh dari navbar */}
      <Starfish className="pointer-events-none absolute left-4 bottom-6 z-10 hidden w-11 -rotate-12 sm:block" />
      <Shell className="pointer-events-none absolute right-6 bottom-10 z-10 hidden w-11 rotate-6 sm:block" />
      <Hibiscus className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden w-14 -translate-y-1/2 rotate-6 lg:block" />

      <div className="relative z-20 flex flex-col items-center">
        <div className="neo-pill mb-10 rounded-full bg-white px-8 py-3">
          <h2 className="font-pixel text-xl text-navy sm:text-2xl">
            Our Events
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 1: Closing Ceremony — sekarang open, ada form pendaftaran */}
          <EventCard
            badgeText="CLOSING CEREMONY"
            imageSrc="/images/closing.png"
            imageAlt="Closing Ceremony Batch 2025"
            title="Culture Exchange"
            subtitle="Closing Ceremony Event"
            eventDate="27 July 2026"
            locationText={"Gedung Dome\nUniversitas Mataram"}
            registeredCount="337 / 350 Registered"
            buttonText="REGISTER"
            buttonStatus="open"
            onRegisterClick={() => setActiveEvent(closingCeremony)}
          />

          {/* Card 2: Volunteer Registration */}
          <EventCard
            badgeText="REGISTRATION"
            imageSrc="/images/gambar_volunteer_registration.jpg"
            imageAlt="Summer 2026 Volunteer Registration"
            title="International Community Service Summer 2026"
            subtitle="Open Recruitment"
            eventDate="25 Feb - 5 March"
            locationText="Register Now!"
            buttonText="REGISTER"
            buttonStatus="open"
            onRegisterClick={() => setActiveEvent(volunteerRecruitment)}
          />
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