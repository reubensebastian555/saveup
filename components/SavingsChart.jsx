"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function SavingsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center text-sm text-slate-500">
        Belum ada data tabungan harian untuk ditampilkan.
      </div>
    );
  }

  // Format data: tanggal -> nominal
  const chartData = data.map((s) => ({
    date: new Date(s.created_at).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }),
    amount: s.amount,
  }));

  return (
    <div className="card h-72">
      <h3 className="mb-3 text-sm font-medium text-slate-600">
        Grafik Tabungan Harian
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#64748b" />
          <YAxis
            stroke="#64748b"
            tickFormatter={(val) => `Rp${val.toLocaleString("id-ID")}`}
          />
          <Tooltip
            formatter={(val) => `Rp${val.toLocaleString("id-ID")}`}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              fontSize: "0.8rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#f97316"
            fillOpacity={1}
            fill="url(#colorAmt)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
