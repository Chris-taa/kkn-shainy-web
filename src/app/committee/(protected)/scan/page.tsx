"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, XCircle, Loader2, CameraOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const CONTAINER_ID = "qr-reader";
const RESULT_DISPLAY_MS = 2600;
const SAME_CODE_COOLDOWN_MS = 4000;

type ScanResult =
  | {
      status: "checked_in_now";
      ticketId: string;
      nama: string;
      instansi: string;
    }
  | {
      status: "already_checked_in";
      ticketId: string;
      nama: string;
      instansi: string;
    }
  | { status: "not_found"; ticketId: string };

export default function ScanPage() {
  const [cameraError, setCameraError] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [totalScanned, setTotalScanned] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null);
  const processingRef = useRef(false);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showResult = (r: ScanResult) => {
    setResult(r);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    resultTimeoutRef.current = setTimeout(
      () => setResult(null),
      RESULT_DISPLAY_MS,
    );
  };

  const processCode = async (rawCode: string) => {
    const ticketId = rawCode.trim();
    const now = Date.now();

    if (
      lastCodeRef.current &&
      lastCodeRef.current.code === ticketId &&
      now - lastCodeRef.current.at < SAME_CODE_COOLDOWN_MS
    ) {
      return;
    }
    if (processingRef.current) return;

    processingRef.current = true;
    lastCodeRef.current = { code: ticketId, at: now };

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("ticket_id", ticketId)
      .maybeSingle();

    if (error || !data) {
      showResult({ status: "not_found", ticketId });
      processingRef.current = false;
      return;
    }

    if (data.checked_in) {
      showResult({
        status: "already_checked_in",
        ticketId,
        nama: data.nama,
        instansi: data.instansi,
      });
      processingRef.current = false;
      return;
    }

    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ checked_in: true, checked_in_at: nowIso })
      .eq("id", data.id);

    if (updateError) {
      showResult({
        status: "already_checked_in",
        ticketId,
        nama: data.nama,
        instansi: data.instansi,
      });
    } else {
      setTotalScanned((n) => n + 1);
      showResult({
        status: "checked_in_now",
        ticketId,
        nama: data.nama,
        instansi: data.instansi,
      });
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(80);
      }
    }

    processingRef.current = false;
  };

  useEffect(() => {
    let isMounted = true;
    let isScanning = false; // Tambahkan variabel untuk tracking status scanner

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (!isMounted) return;
      const scanner = new Html5Qrcode(CONTAINER_ID);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => processCode(decodedText),
          () => {},
        )
        .then(() => {
          isScanning = true; // Tandai kalau scanner sukses menyala

          if (!isMounted) {
            // Kasus khusus: Kalau komponen keburu di-unmount saat kamera lagi loading (misal user cepat-cepat pencet 'back')
            // Kita harus stop kameranya setelah dia berhasil nyala supaya nggak bocor
            scanner.stop().catch(() => {});
          } else {
            setCameraStarted(true);
          }
        })
        .catch(() => {
          if (isMounted) setCameraError(true);
        });
    });

    return () => {
      isMounted = false;
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);

      // PENTING: Hanya panggil stop() kalau scanner memang sudah dalam posisi scanning
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto flex w-[92%] max-w-md flex-col items-center">
      <div className="flex w-full items-center justify-between gap-3">
        <h1 className="font-pixel text-xl text-navy">Scan QR Tiket</h1>
        <span className="neo-pill rounded-full bg-mint px-3 py-1.5 font-body text-xs font-bold text-navy">
          {totalScanned} discan
        </span>
      </div>
      <p className="mt-1 text-center font-body text-xs text-navy/50">
        Kamera nyala terus — arahkan ke QR, hasil muncul otomatis, terus
        langsung siap buat scan berikutnya.
      </p>

      <div className="relative mt-4 w-full overflow-hidden rounded-3xl border-[3px] border-navy bg-black">
        <div id={CONTAINER_ID} className="w-full" />

        {!cameraStarted && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Loader2 size={28} className="animate-spin text-white" />
          </div>
        )}

        {result && (
          <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3">
            <ResultBanner result={result} />
          </div>
        )}
      </div>

      {cameraError && (
        <div className="neo-card mt-4 flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center">
          <CameraOff size={24} className="text-coral" />
          <p className="font-body text-xs text-navy/70">
            Gagal buka kamera. Pastikan izin kamera diaktifkan di browser, atau
            pakai halaman "Input Kode" di sidebar.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultBanner({ result }: { result: ScanResult }) {
  if (result.status === "not_found") {
    return (
      <div className="neo-shadow-sm flex items-center gap-3 rounded-2xl border-[3px] border-navy bg-coral px-4 py-3">
        <XCircle size={22} className="shrink-0 text-white" />
        <div className="text-left">
          <p className="font-body text-sm font-bold text-white">
            Kode gak ketemu
          </p>
          <p className="font-mono text-xs text-white/80">{result.ticketId}</p>
        </div>
      </div>
    );
  }

  if (result.status === "already_checked_in") {
    return (
      <div className="neo-shadow-sm flex items-center gap-3 rounded-2xl border-[3px] border-navy bg-sunny px-4 py-3">
        <Clock size={22} className="shrink-0 text-navy" />
        <div className="text-left">
          <p className="font-body text-sm font-bold text-navy">{result.nama}</p>
          <p className="font-body text-xs text-navy/70">
            {result.instansi} · sudah check-in sebelumnya
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-shadow-sm flex items-center gap-3 rounded-2xl border-[3px] border-navy bg-mint px-4 py-3">
      <CheckCircle2 size={22} className="shrink-0 text-navy" />
      <div className="text-left">
        <p className="font-body text-sm font-bold text-navy">{result.nama}</p>
        <p className="font-body text-xs text-navy/70">
          {result.instansi} · berhasil check-in
        </p>
      </div>
    </div>
  );
}
