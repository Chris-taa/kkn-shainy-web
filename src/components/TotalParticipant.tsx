import Image from "next/image";

export default function TotalParticipant() {
  return (
    <section className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#7FB8E6_0%,#4E8FCB_100%)] px-6 py-16 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_2px,transparent_2px)] [background-size:26px_26px]"
      />

      <div className="relative flex flex-col items-center">
        <div className="neo-pill mb-8 rounded-full bg-white px-8 py-3">
          <h2 className="text-xl text-navy sm:text-2xl font-bold">
            Total Participant
          </h2>
        </div>

        <div className="neo-card relative w-full max-w-3xl rounded-3xl bg-white/95 px-6 py-12 text-center sm:px-16">
          <p className="text-5xl text-sunny [text-shadow:2px_2px_0_#0D2B4E] sm:text-6xl">
            170+
          </p>
          <p className="mt-3 font-body text-xl font-bold text-navy sm:text-2xl">
            participants
          </p>
          <p className="mx-auto mt-4 max-w-md font-body text-sm text-navy/70 sm:text-base">
            Our team is committed to ensuring all participants get all the
            things they need.
          </p>

          {/* Payung Kanan Atas (Tanpa Bulatan) */}
          <div className="pointer-events-none absolute -right-10 -top-10 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
            <Image
              src="/images/gambar_payung_oren.png"
              alt=""
              width={200}
              height={200}
              aria-hidden
              // Menambahkan drop-shadow agar payung tetap punya efek bayangan
              className="h-full w-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Payung Kiri Bawah (Tanpa Bulatan) */}
          <div className="pointer-events-none absolute -bottom-12 -left-12 flex h-28 w-28 items-center justify-center sm:-bottom-16 sm:-left-16 sm:h-36 sm:w-36">
            <Image
              src="/images/gambar_payung_biru.png"
              alt=""
              width={200}
              height={200}
              aria-hidden
              className="h-full w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
