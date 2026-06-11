import Link from "next/link";
import { MailCheck } from "lucide-react";

import {
  darkPrimaryButtonClass,
  secondaryButtonClass,
} from "@/components/brand";
import { PublicShell } from "@/components/public-shell";

export default function CheckEmailPage() {
  return (
    <PublicShell>
      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-2xl shadow-cyan-950/10 sm:p-10 lg:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-50 text-teal-700 ring-1 ring-cyan-100">
            <MailCheck className="size-8" aria-hidden="true" />
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
            Account confirmation
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Check your email
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            We sent a confirmation link to your email. Confirm your account,
            then log in to access your CallRecover workspace.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className={darkPrimaryButtonClass}>
              Go to Login
            </Link>
            <Link href="/" className={secondaryButtonClass}>
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
