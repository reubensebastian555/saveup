import { createClient } from "@supabase/supabase-js";

// Pastikan env tidak kosong & rapikan spasi
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

if (!url || !anon) {
  // Jangan bikin build gagal — cukup warning saja
  // (di runtime client, kalau env bener, Supabase akan jalan normal)
  console.warn("⚠️ Supabase ENV missing: cek NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase =
  typeof window !== "undefined"
    ? createClient(url, anon, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : createClient(url, anon, {
        auth: { persistSession: false },
      });
