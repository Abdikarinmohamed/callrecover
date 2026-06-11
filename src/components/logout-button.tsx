"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    // Logout logic: signOut clears the Supabase session cookies, then the user
    // is returned to login with server state refreshed.
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
