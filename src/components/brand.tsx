import type { ReactNode } from "react";

export const PRODUCT_NAME = "CallRecover";

export const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-cyan-400/15";

export const darkPrimaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 text-base font-semibold text-white shadow-sm shadow-slate-950/15 transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25 disabled:cursor-not-allowed disabled:bg-slate-300";

export const secondaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/85 px-7 text-base font-semibold text-slate-700 transition hover:border-teal-600 hover:bg-cyan-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/20";

export function LogoMark({
  size = "size-10",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <span
      className={`flex ${size} items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f766e_0%,#06b6d4_100%)] text-sm font-semibold text-white shadow-sm shadow-cyan-950/25 ${className}`}
    >
      CR
    </span>
  );
}

export function BrandLockup({ subtext }: { subtext?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {PRODUCT_NAME}
        </p>
        {subtext ? <p className="text-xs text-slate-500">{subtext}</p> : null}
      </div>
    </div>
  );
}
