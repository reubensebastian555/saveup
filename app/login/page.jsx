"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    const registered = searchParams.get("registered");
    const verify = searchParams.get("verify");
    if (verify) setBanner("Akun berhasil dibuat. Cek email verifikasi sebelum login.");
    else if (registered) setBanner("Akun berhasil dibuat. Silakan login.");
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message || "Gagal login. Coba lagi.");
        return;
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f0] px-4">
      <div className="w-full max-w-lg">
        <div className="relative">
          <div className="absolute left-1/2 -top-16 -translate-x-1/2">
            <div className="rounded-full bg-white p-2 shadow-[0_8px_24px_rgba(2,6,23,0.08)] ring-1 ring-slate-200">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_8px_25px_rgba(244,114,23,0.35)]">
                <span className="text-3xl font-extrabold text-white">$</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 pt-24 shadow-lg">
            <div className="mb-6 flex flex-col items-center">
              <h1 className="text-2xl font-extrabold text-slate-800">
                Save<span className="text-orange-600">UP</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600 text-center">
                Awali Harimu Dengan Menabung !
              </p>
            </div>

            {banner && (
              <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-center text-xs text-orange-700">
                {banner}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-60 transition"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link href="/signup" className="font-medium text-orange-600 hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
