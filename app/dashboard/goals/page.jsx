"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GoalForm from "@/components/GoalForm";
import GoalCard from "@/components/GoalCard";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setGoals(data || []);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <GoalForm onCreated={load} />
      <div className="grid gap-4 md:grid-cols-3">
        {goals.map(g => <GoalCard key={g.id} goal={g} />)}
      </div>
    </div>
  );
}
