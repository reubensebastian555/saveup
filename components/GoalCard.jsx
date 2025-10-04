"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatRupiahInput, parseRupiahToNumber } from "@/lib/format";

const IconEdit = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2.414zM19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h6"/>
  </svg>
);
const IconTrash = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"/>
  </svg>
);

export default function GoalCard({ goal, onReload }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [target, setTarget] = useState(Number(goal.target_amount || 0).toLocaleString("id-ID"));
  const [deadline, setDeadline] = useState(goal.deadline || "");

  const targetNum = Number(goal.target_amount || 0);
  const currentNum = Number(goal.current_amount || 0);
  const progress = Math.min(100, Math.round((currentNum / (targetNum || 1)) * 100));
  const shortfall = Math.max(targetNum - currentNum, 0);
  const isAchieved = shortfall === 0 && targetNum > 0;

  const resetForm = () => {
    setTitle(goal.title);
    setTarget(Number(goal.target_amount || 0).toLocaleString("id-ID"));
    setDeadline(goal.deadline || "");
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus target "${goal.title}"?`)) return;
    const { error } = await supabase.from("goals").delete().eq("id", goal.id);
    if (error) return alert(error.message);
    onReload?.();
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    const payload = {
      title: title.trim(),
      target_amount: parseRupiahToNumber(target),
      deadline: deadline || null,
    };
    if (!payload.title) return alert("Nama target wajib diisi.");
    if (!payload.target_amount) return alert("Nominal target wajib > 0.");

    const { error } = await supabase.from("goals").update(payload).eq("id", goal.id);
    if (error) return alert(error.message);

    setEditing(false);
    onReload?.();
  };

  return (
    <div className="card space-y-3">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        {!editing ? (
          <h3 className="font-semibold leading-6 break-words">{goal.title}</h3>
        ) : (
          <input
            className="input h-10 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama Target"
          />
        )}

        <div className="flex items-center gap-1">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-lg text-orange-500 hover:bg-orange-100 transition"
                title="Edit Target"
              >
                <IconEdit />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
                title="Hapus Target"
              >
                <IconTrash />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:bg-orange-600 transition"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  resetForm();
                }}
                className="px-3 py-2 rounded-lg border text-xs font-medium hover:bg-slate-50 transition"
              >
                Batal
              </button>
            </>
          )}
        </div>
      </div>

      {/* META */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {!editing ? (
          <>
            {/* Target */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 border font-medium ${
                isAchieved
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-orange-50 text-orange-700 border-orange-100"
              }`}
            >
              Target: Rp{targetNum.toLocaleString("id-ID")}
            </span>

            {/* Deadline (jika ada) */}
            {goal.deadline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-slate-700 border border-slate-200">
                Deadline: {new Date(goal.deadline).toLocaleDateString("id-ID")}
              </span>
            )}

            {/* Kekurangan Dana */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 border font-medium ${
                isAchieved
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
              title={isAchieved ? "Target terpenuhi" : "Dana yang masih harus dikumpulkan"}
            >
              Kekurangan Dana: Rp{shortfall.toLocaleString("id-ID")}
            </span>
          </>
        ) : (
          <div className="grid w-full gap-2 md:grid-cols-2">
            <input
              type="text"
              inputMode="numeric"
              className="input"
              value={target}
              onChange={(e) => setTarget(formatRupiahInput(e.target.value))}
              placeholder="650.000.000"
            />
            <input
              type="date"
              className="input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full transition-[width] duration-300 ${
            isAchieved ? "bg-green-500" : "bg-brand"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700">
        <span>
          Terkumpul: <strong>Rp{currentNum.toLocaleString("id-ID")}</strong>
        </span>
        <span
          className={`rounded-lg px-2 py-1 font-medium border ${
            isAchieved
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
