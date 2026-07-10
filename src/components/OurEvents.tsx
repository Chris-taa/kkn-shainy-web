import EventCard from "./EventCard";

export default function OurEvents() {
  return (
    <section
      id="our-events"
      className="relative w-full overflow-hidden bg-[#96C0E8] px-6 py-24 sm:px-10 lg:py-32"
    >
      {/* Dekorasi titik/bintang (Opsional, agar mirip di gambar) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <div className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white"></div>
        <div className="absolute right-[20%] top-[10%] h-1.5 w-1.5 rounded-full bg-white"></div>
        <div className="absolute bottom-[15%] left-[50%] h-2 w-2 rounded-full bg-white"></div>
        <div className="absolute bottom-[30%] right-[10%] h-1 w-1 rounded-full bg-white"></div>
      </div>

      {/* Container Cards */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-10">
          
          {/* Card 1: Closing Ceremony */}
          <EventCard
            badgeText="CLOSING CEREMONY"
            imageSrc="/images/gambar_closing_ceremony.jpg" // Sesuaikan dengan path gambar Anda
            imageAlt="Closing Ceremony Batch 2025"
            title="Culture Exchange"
            subtitle="Closing Ceremony Event"
            note="*For participants who passed the dispatch, there is no need to register."
            eventDate="January 28th"
            locationText={"Gedung Dome \n Universitas Mataram"}
            registeredCount="337 / 350 Registered"
            buttonText="CLOSED"
            buttonStatus="closed"
          />

          {/* Card 2: Volunteer Registration */}
          <EventCard
            badgeText="REGISTRATION"
            imageSrc="/images/gambar_volunteer_registration.jpg" // Sesuaikan dengan path gambar Anda
            imageAlt="Summer 2026 Volunteer Registration"
            title="International Community Service Summer 2026"
            subtitle="Open Recruitment"
            eventDate="25 Feb - 5 March"
            locationText="Register Now!"
            buttonText="REGISTER"
            buttonStatus="open"
          />
          
        </div>
      </div>
    </section>
  );
}