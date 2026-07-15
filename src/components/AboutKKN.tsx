export default function AboutKKN() {
  return (
    <section
      id="s-cube-center"
      className="relative mx-auto mt-10 w-[92%] max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#AFD8F2_0%,#7FB8E6_100%)] px-6 py-14 sm:px-12"
    >
      {/* Dekorasi titik-titik & kotak kecil ala summer sky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(white_2px,transparent_2px)] [background-size:28px_28px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-10 top-8 h-16 w-16 rotate-12 bg-[repeating-linear-gradient(45deg,white_0,white_4px,transparent_4px,transparent_8px)] opacity-30"
      />

      <div className="relative flex flex-col items-center">
        {/* Badge judul, neobrutalism: border tebal + hard shadow */}
        <div className="neo-pill mb-8 rounded-full bg-white px-8 py-3">
          <h2 className="font-pixel text-xl text-navy sm:text-2xl font-bold">
            What is KKN International?
          </h2>
        </div>

        {/* Kartu isi */}
        <div className="neo-card w-full max-w-4xl rounded-3xl bg-white/90 px-6 py-10 text-center backdrop-blur-sm sm:px-12">
          <p className="font-body text-sm leading-relaxed text-navy/90 sm:text-base">
            This international-based community service program is organized by
            university students as part of a unique way to achieve academic
            initiative and human resource development. Designed as a platform
            for cultural assimilation between Korean and Indonesian culture, the
            program promotes mutual understanding through meaningful
            cross-cultural engagement. In collaboration with 2 other
            universities, Seoul National University and National University
            students, the team contributes knowledge, skills, and perspectives
            to address community needs while strengthening global academic
            partnerships. This cooperation not only enriches participants
            intellectually but also enhances the program&apos;s impact by
            fostering globally competent human resources with an international
            outlook.
          </p>
        </div>
      </div>
    </section>
  );
}
