"use client";
import { supabase } from "@/lib/supabaseClient";

const IconTrash = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
    />
  </svg>
);

export default function SavingList({ savings, onReload }) {
  const handleDelete = async (id) => {
    if (!confirm("Hapus tabungan ini?")) return;
    const { error } = await supabase.from("savings").delete().eq("id", id);
    if (error) return alert(error.message);
    onReload?.();
  };

  // Tentukan isi Keterangan
  const renderKeterangan = (row) => {
    if (!row.goal_id) return "Tanpa target (tabungan umum)";
    return row.goals?.title || "Sesuai target tujuan";
  };

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left">No</th>
            <th className="px-3 py-2 text-left">Tanggal</th>
            <th className="px-3 py-2 text-left">Nominal</th>
            <th className="px-3 py-2 text-left">Keterangan</th>
            <th className="px-3 py-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {savings.map((s, i) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              {/* Nomor urut */}
              <td className="px-3 py-2">{i + 1}</td>

              {/* Tanggal */}
              <td className="px-3 py-2">
                {new Date(s.created_at || s.date).toLocaleDateString("id-ID")}
              </td>

              {/* Nominal */}
              <td className="px-3 py-2 font-medium">
                Rp{Number(s.amount || 0).toLocaleString("id-ID")}
              </td>

              {/* Keterangan */}
              <td className="px-3 py-2">{renderKeterangan(s)}</td>

              {/* Tombol hapus */}
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
                  title="Hapus"
                >
                  <IconTrash />
                </button>
              </td>
            </tr>
          ))}

          {savings.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                Belum ada tabungan harian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
