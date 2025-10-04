"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiahInput, parseRupiahToNumber } from "@/lib/format";

export default function GoalForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(""); // simpan versi TERFORMAT (string)
  const [deadline, setDeadline] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Harap login kembali.");

    const targetNumber = parseRupiahToNumber(target); // konversi ke number murni

    if (!title.trim()) return alert("Nama target wajib diisi.");
    if (!targetNumber) return alert("Nominal target tidak valid.");

    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      title: title.trim(),
      target_amount: targetNumber,
      deadline: deadline || null
    });
    if (error) return alert(error.message);

    setTitle(""); setTarget(""); setDeadline("");
    onCreated?.();
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div>
        <label className="text-sm text-gray-600">Nama Target</label>
        <input
          className="input mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Laptop baru"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm text-gray-600">Nominal Target (Rp)</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className="input mt-1"
            value={target}
            onChange={(e) => setTarget(formatRupiahInput(e.target.value))}
            placeholder="10.000.000"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Deadline (opsional)</label>
          <input
            type="date"
            className="input mt-1"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary w-full">Tambah Target</button>
    </form>
  );
}
