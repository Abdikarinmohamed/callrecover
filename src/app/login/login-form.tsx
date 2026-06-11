"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { CheckCircle2, Lock, Mail, MessageSquareText } from "lucide-react";

import { darkPrimaryButtonClass, inputClass } from "@/components/brand";
import { PublicShell } from "@/components/public-shell";
import { createClient } from "@/lib/supabase/client";

const workspaceBenefits = [
  "Centralized missed-call queue",
  "Two-way customer conversations",
  "Lead status and follow-up tracking",
  "Built for HVAC dispatch workflows",
];

const accessNotes = [
  "Secure business access",
  "Your Twilio account stays yours",
];

export function LoginForm() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorMessage("");
    setIsLoading(true);

    // Login flow: Supabase verifies the email/password pair and writes the
    // browser cookies that keep the session available across refreshes.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const isInvalidCredentials = error.message
        .toLowerCase()
        .includes("invalid login credentials");

      setErrorMessage(
        isInvalidCredentials ? "Invalid email or password." : error.message,
      );
      setIsLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <PublicShell>
      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-cyan-950/10 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col bg-[linear-gradient(135deg,#082f49_0%,#0f766e_100%)] p-8 text-white lg:p-12">
            <div className="my-auto">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-300 text-cyan-950 shadow-lg shadow-cyan-950/20">
                <MessageSquareText className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
                WORKSPACE ACCESS
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">
                Welcome back to your recovery workspace.
              </h1>
              <p className="mt-5 text-base leading-8 text-cyan-50/90">
                Review missed calls, respond to leads, and keep your HVAC
                pipeline moving from one centralized dashboard.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-cyan-50">
                {workspaceBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-cyan-200"
                      aria-hidden="true"
                    />
                    <span className="font-semibold leading-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-12 rounded-3xl border border-white/10 bg-white/10 p-5 text-sm font-semibold leading-6 text-cyan-50">
              Used by HVAC teams to recover opportunities before customers call
              competitors.
            </p>
          </aside>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                LOGIN
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Access your workspace
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Secure access to your missed-call recovery dashboard.
              </p>
            </div>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 size-4 text-zinc-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3.5 size-4 text-zinc-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="remember"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-400/25"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-cyan-700 transition hover:text-teal-800"
                >
                  Forgot password?
                </Link>
              </div>
              {errorMessage ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                >
                  {errorMessage}
                </p>
              ) : null}
              <button
                type="submit"
                className={`${darkPrimaryButtonClass} w-full`}
                disabled={isLoading}
              >
                {isLoading ? "Accessing Workspace..." : "Access Workspace"}
              </button>
            </form>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {accessNotes.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-cyan-700"
                    aria-hidden="true"
                  />
                  <span className="leading-5">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-zinc-600">
              New to CallRecover?{" "}
              <Link href="/signup" className="font-medium text-cyan-700">
                Create your account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
