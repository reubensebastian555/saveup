"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/session";
import BrandLogo from "@/components/BrandLogo";

const NavItem = ({ href, label }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
        border-l-4 ${active
          ? "border-orange-600 bg-orange-50 text-orange-600"
          : "border-transparent text-gray-700 hover:bg-gray-100"
        }`}
    >
      {label}
    </Link>
  );
};

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
  </svg>
);

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-100 bg-white p-6 md:block">
      <div className="flex h-full flex-col">
        {/* ===== Header: SATU logo saja ===== */}
        <div className="mb-8 flex items-center justify-center">
          {/* Jika BrandLogo-mu sudah ada tulisan "SaveUP" di dalamnya, biarkan saja. */}
          {/* Jangan tambahkan teks apa pun di sini supaya tidak dobel. */}
          <BrandLogo size={64} />
        </div>

        {/* ===== Menu ===== */}
        <nav className="space-y-2">
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/dashboard/goals" label="Target Tabungan" />
          <NavItem href="/dashboard/savings" label="Tabungan Harian" />
        </nav>

        {/* ===== Footer: separator statis + tombol keluar ===== */}
        <div className="mt-auto">
          <div className="my-6 border-t border-gray-200" />
          <button
            onClick={async () => await signOut().then(() => (window.location = "/login"))}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <LogoutIcon />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
