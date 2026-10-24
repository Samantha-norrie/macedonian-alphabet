"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./UserBadge.module.css";

export default function UserBadge() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile(userId: string | undefined) {
      if (!userId) {
        if (active) setUsername(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();
      if (active) setUsername(data?.username ?? null);
    }

    supabase.auth.getSession().then(({ data }) => {
      loadProfile(data.session?.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!username) return null;

  return <div className={styles.badge}>@{username}</div>;
}
