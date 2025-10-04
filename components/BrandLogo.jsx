"use client";

export default function BrandLogo({ compact = false }) {
  // compact=true -> hanya badge bulat (untuk header overlap)
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_6px_20px_rgba(244,114,23,0.25)]"
      >
        <span className="text-2xl font-extrabold leading-none text-white select-none">$</span>
      </div>

      {!compact && (
        <span className="text-2xl font-extrabold text-slate-800 leading-none">
          Save<span className="text-orange-600">UP</span>
        </span>
      )}
    </div>
  );
}
