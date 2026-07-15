"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import EventImage from "./EventImage";

type EventCardProps = {
  badgeText: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  note?: string;
  eventDate: string;
  locationText: string;
  registeredCount?: string;
  buttonText: string;
  buttonStatus: "not_open" | "open" | "closed";
  onRegisterClick?: () => void;
};

export default function EventCard({
  badgeText,
  imageSrc,
  imageAlt,
  title,
  subtitle,
  note,
  eventDate,
  locationText,
  registeredCount,
  buttonText,
  buttonStatus,
  onRegisterClick,
}: EventCardProps) {
  const isOpen = buttonStatus === "open";

  return (
    <div className="neo-card relative flex flex-col overflow-hidden rounded-3xl bg-white">
      {/* Badge status mengambang di atas gambar */}
      <div
        className={`neo-pill absolute left-6 top-6 z-10 rounded-full px-4 py-1.5 ${
          isOpen ? "bg-mint" : "bg-white"
        }`}
      >
        <span className="font-pixel text-[10px] text-navy sm:text-xs">
          {badgeText}
        </span>
      </div>

      {/* Gambar event — tinggi tetap, gak ngikut lebar kartu, dengan fallback summer kalau file belum ada */}
      <EventImage src={imageSrc} alt={imageAlt} dimmed={!isOpen} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-navy/50">
          {subtitle}
        </p>
        <h3 className="mt-1 font-pixel text-lg leading-snug text-navy sm:text-xl">
          {title}
        </h3>

        {note && (
          <p className="mt-3 font-body text-xs italic text-navy/50">{note}</p>
        )}

        <div className="mt-4 flex flex-col gap-2 font-body text-sm text-navy/80">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="shrink-0 text-navy" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-navy" />
            <span className="whitespace-pre-line">{locationText}</span>
          </div>
        </div>

        {registeredCount && (
          <div className="mt-4 flex items-center gap-2 font-body text-xs font-semibold text-navy/70">
            <Users size={14} className="shrink-0" />
            {registeredCount}
          </div>
        )}

        <button
          type="button"
          disabled={!isOpen}
          onClick={isOpen ? onRegisterClick : undefined}
          className={`mt-5 w-full rounded-full border-[3px] border-navy px-6 py-3 text-sm font-bold tracking-widest transition-transform ${
            isOpen
              ? "neo-shadow-sm bg-sunny text-navy hover:-translate-y-0.5 active:translate-y-0"
              : "cursor-not-allowed border-navy/30 bg-navy/10 text-navy/40"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}