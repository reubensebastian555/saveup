# SaveUP — Deploy ke Vercel

Dokumen ini menuntun kamu *step-by-step* agar project berjalan lancar di Vercel + Supabase.

## Prasyarat
- Node.js 18+ (Vercel pakai 18/20)
- Akun Vercel
- Project Supabase (punya **URL** dan **Anon Key**)

## Struktur & Catatan
- Framework: **Next.js 14 (App Router)**
- Auth & DB: **Supabase** via `@supabase/supabase-js`
- Semua akses database dilakukan di **client** menggunakan env `NEXT_PUBLIC_*`.
- File sensitif **tidak** ikut commit. Lihat `.gitignore` dan `.env.example`.

## Variabel Environment
Buat variabel berikut di Vercel (Project Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=<dari Supabase Project Settings>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dari Supabase Project Settings>
```

> **Jangan** commit `.env.local`. Gunakan `.env.example` sebagai template.

## Jalur Deploy
1. **Fork/Push** repo ke GitHub.
2. **Import** repo di Vercel → pilih **Framework: Next.js** (otomatis terdeteksi).
3. Isi Environment Variables seperti di atas.
4. Tekan **Deploy**.

Build Command: `next build` (default)  
Install Command: otomatis (`npm install`)  
Output: `.next` (default oleh Next.js)

## Troubleshooting Umum
- **Blank screen/redirect loop** → cek `NEXT_PUBLIC_*` sudah benar.
- **CORS Supabase** → di Supabase Dashboard → Authentication → URL → tambahkan domain vercel kamu.
- **Build gagal karena lint** → jalankan `npm run lint` lokal atau hapus rule yang memblokir build.
- **Import alias @/** → sudah dikonfigurasi via `jsconfig.json`.

## Lokal Development
```bash
cp .env.example .env.local  # isi dengan nilai asli
npm install
npm run dev
```
