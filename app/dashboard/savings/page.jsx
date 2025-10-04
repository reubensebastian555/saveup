"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import SavingForm from "@/components/SavingForm";
import SavingList from "@/components/SavingList";

export default function SavingsPage() {
  const [savings, setSavings] = useState([]);

  const loadSavings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 🔑 Join ke goals + urut ASC biar nomor urut 1,2,3 sesuai input
    const { data, error } = await supabase
      .from("savings")
      .select("*, goals(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }); // <-- ASCENDING

    if (!error) setSavings(data || []);
  };

  useEffect(() => {
    loadSavings();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-700">Tabungan Harian</h2>

      {/* Form Tambah Tabungan */}
      <SavingForm onAdded={loadSavings} />

      {/* List Tabungan */}
      <SavingList savings={savings} onReload={loadSavings} />
    </div>
  );
}
