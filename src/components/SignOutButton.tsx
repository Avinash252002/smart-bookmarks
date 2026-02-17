"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function SignOutButton() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      Sign out
    </button>
  );
}
