"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    getSession().then((s) => {
      if (s) router.replace("/dashboard");
      else router.replace("/login");
    });
  }, [router]);
  return null;
}
