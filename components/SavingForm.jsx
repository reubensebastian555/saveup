"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiahInput, parseRupiahToNumber } from "@/lib/format";

export default function SavingForm({ onAdded }) {
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState("");   // "" = tanpa target (tabungan umum)
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("goals")
        .select("id,title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setGoals(data || []);
    };
    loadGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nominal = parseRupiahToNumber(amount);
    if (!nominal || nominal <= 0) return alert("Nominal wajib lebih dari 0.");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    try {
      // Tidak kirim 'note' — keterangan di tabel otomatis
      const payload = {
        user_id: user.id,
        amount: nominal,
        goal_id: goalId || null, // null = tabungan umum
      };

      const { error } = await supabase.from("savings").insert(payload);
      if (error) throw error;

      // reset & refresh
      setGoalId("");
      setAmount("");
      onAdded?.();
    } catch (err) {
      alert(err.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {/* Pilih Target */}
      <div>
        <label className="block mb-1 text-sm font-medium text-slate-700">
          Pilih Target Tabungan 
        </label>
        <select
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
        >
          <option value="">Tanpa target (tabungan umum)</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      {/* Nominal */}
      <div>
        <label className="block mb-1 text-sm font-medium text-slate-700">
          Nominal Disimpan (Rp)
        </label>
        <input
          type="text"
          inputMode="numeric"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="Contoh: 500.000"
          value={amount}
          onChange={(e) => setAmount(formatRupiahInput(e.target.value))}
        />
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 disabled:opacity-60 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Tabungan"}
        </button>
      </div>
    </form>
  );
}
