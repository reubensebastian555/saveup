"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#f97316", "#e5e7eb"]; // oranye & abu

export default function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [savings, setSavings] = useState([]);

  // Ambil data dari Supabase
  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: g } = await supabase.from("goals").select("*").eq("user_id", user.id);
    setGoals(g || []);

    const { data: s } = await supabase.from("savings").select("*").eq("user_id", user.id);
    setSavings(s || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // =================== Hitung progress ===================
  // 1) Rata-rata progress tiap target
  const validGoals = goals.filter((g) => (g.target_amount || 0) > 0);
  const progress =
    validGoals.length > 0
      ? Math.round(
          validGoals
            .map((g) => {
              const t = Number(g.target_amount || 0);
              const c = Number(g.current_amount || 0);
              return Math.min(100, (c / t) * 100);
            })
            .reduce((a, b) => a + b, 0) / validGoals.length
        )
      : 0;

  // 2) Data donut
  const chartData = [
    { name: "Tercapai", value: progress },
    { name: "Sisa", value: Math.max(0, 100 - progress) },
  ];

  // 3) Info lain
  const totalTabungan = savings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const achievedGoals = goals.filter(
    (g) => (g.current_amount || 0) >= (g.target_amount || 0) && (g.target_amount || 0) > 0
  ).length;

  // =================== Render ===================
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Persentase Total</h2>

      {/* Chart Donut */}
      {goals.length > 0 ? (
        <div className="relative card flex items-center justify-center h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={3}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fff",
                  fontSize: "0.8rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Teks tengah donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800">{progress}%</span>
            <span className="mt-1 text-xs font-medium text-slate-500">
              Rata-rata Progress Target
            </span>
          </div>
        </div>
      ) : (
        <div className="card text-center text-sm text-slate-500">
          Belum ada target tabungan.
        </div>
      )}

      {/* Total Tabungan */}
      <div className="card flex flex-col items-center justify-center py-6">
        <div className="text-sm text-slate-500">Total Tabungan</div>
        <div className="mt-2 text-3xl font-bold text-slate-800 text-center break-words">
          Rp{totalTabungan.toLocaleString("id-ID")}
        </div>
      </div>

      {/* Statistik Lain */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex flex-col items-center justify-center py-4">
          <div className="text-sm text-slate-500">Jumlah Transaksi Harian</div>
          <div className="mt-1 text-xl font-bold text-slate-800">{savings.length}</div>
        </div>

        <div className="card flex flex-col items-center justify-center py-4">
          <div className="text-sm text-slate-500">Jumlah Target</div>
          <div className="mt-1 text-xl font-bold text-slate-800">{goals.length}</div>
        </div>

        <div className="card flex flex-col items-center justify-center py-4">
          <div className="text-sm text-slate-500">Target Terpenuhi</div>
          <div className="mt-1 text-xl font-bold text-green-600">{achievedGoals}</div>
        </div>
      </div>
    </div>
  );
}