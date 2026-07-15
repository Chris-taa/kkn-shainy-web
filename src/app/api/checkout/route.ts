import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { createClient } from "@supabase/supabase-js";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID as string;

function getDriveClient() {
  // Pakai OAuth2 dengan refresh token akun Google pribadi (BUKAN Service
  // Account). Ini wajib kalau folder tujuannya folder biasa di My Drive
  // (bukan Shared Drive Workspace) — Service Account gak punya storage
  // quota buat nulis ke folder personal.
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  });

  return google.drive({ version: "v3", auth: oauth2Client });
}

// Pakai service role key di sini (BUKAN anon key) karena ini jalan di server
// dan perlu izin insert tanpa terhalang RLS. Jangan pernah expose service
// role key ke client.
// Dibuat lazy (bukan langsung di top-level module) supaya kalau env var
// belum ke-set, itu cuma bikin request checkout gagal — bukan bikin
// seluruh proses build Vercel gagal total.
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Env var Supabase belum lengkap: pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diisi (di .env.local untuk lokal, dan di Vercel Project Settings > Environment Variables untuk production)."
    );
  }

  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama = (formData.get("nama") as string)?.trim();
    const noHp = (formData.get("noHp") as string)?.trim();
    const paymentMethod = formData.get("paymentMethod") as string;
    const itemsJson = formData.get("items") as string;
    const totalPrice = Number(formData.get("totalPrice"));
    const proofFile = formData.get("proof") as File | null;

    if (!nama || !noHp || !paymentMethod || !proofFile || !itemsJson) {
      return NextResponse.json(
        { error: "Data belum lengkap. Cek lagi form-nya ya." },
        { status: 400 }
      );
    }

    if (!proofFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Bukti pembayaran harus berupa gambar (JPG/PNG)." },
        { status: 400 }
      );
    }

    if (proofFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 5MB." },
        { status: 400 }
      );
    }

    const orderId = `SHAINY${Date.now().toString(36).toUpperCase()}`;
    const safeName = nama.replace(/[^a-zA-Z0-9]+/g, "_");
    const extension = proofFile.name.split(".").pop() || "jpg";
    const fileName = `${orderId}_${safeName}.${extension}`;

    // Upload bukti bayar ke Google Drive
    const buffer = Buffer.from(await proofFile.arrayBuffer());
    const drive = getDriveClient();

    const driveRes = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: proofFile.type,
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
    });

    const proofFileId = driveRes.data.id ?? null;
    const proofFileUrl = driveRes.data.webViewLink ?? null;

    // Simpan order ke Supabase
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("checkouts").insert({
      order_id: orderId,
      nama,
      no_hp: noHp,
      payment_method: paymentMethod,
      items: JSON.parse(itemsJson),
      total_price: totalPrice,
      proof_file_id: proofFileId,
      proof_file_url: proofFileUrl,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Bukti bayar ke-upload, tapi gagal nyimpen data order. Hubungi admin." },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Gagal memproses checkout. Coba lagi sebentar lagi." },
      { status: 500 }
    );
  }
}