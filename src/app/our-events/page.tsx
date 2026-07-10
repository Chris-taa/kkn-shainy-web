import EventCard from "@/components/EventCard";

export default function OurEventsPage() {
  return (
    // Background dibuat senada dengan warna Our Events sebelumnya
    <main className="relative min-h-screen bg-[#96C0E8] pb-24 pt-32 sm:pt-40">
      {/* Dekorasi titik/bintang background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <div className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white"></div>
        <div className="absolute right-[20%] top-[10%] h-1.5 w-1.5 rounded-full bg-white"></div>
        <div className="absolute bottom-[15%] left-[50%] h-2 w-2 rounded-full bg-white"></div>
        <div className="absolute bottom-[30%] right-[10%] h-1 w-1 rounded-full bg-white"></div>
      </div>

      {/* Container Konten */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        
        {/* Tambahan Judul Halaman agar lebih manis */}
        <div className="mb-12 text-center">
          <h1 className="font-pixel text-4xl tracking-wide text-white drop-shadow-md sm:text-5xl">
            OUR EVENTS
          </h1>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Discover and join our upcoming activities!
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-10">
          
          <EventCard
            badgeText="CLOSING CEREMONY"
            imageSrc="/images/gambar_closing_ceremony.jpg"
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
          />
          
        </div>
      </div>
    </main>
  );
}