"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function SetupSuccessBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const dismissBanner = useCallback(() => {
    setIsVisible(false);
    router.replace("/dashboard");
  }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(dismissBanner, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [dismissBanner]);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900 shadow-sm shadow-emerald-950/5"
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-sm font-semibold">
            <span aria-hidden="true">{"\u2705"}</span> Business workspace
            configured successfully.
          </p>
          <p className="text-sm text-emerald-800">
            Your missed-call recovery workspace is ready.
          </p>
        </div>
        <button
          aria-label="Dismiss success message"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          onClick={dismissBanner}
          type="button"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
