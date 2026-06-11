"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Building2, CheckCircle2, Lock, Mail, PhoneCall } from "lucide-react";

import { darkPrimaryButtonClass, inputClass } from "@/components/brand";
import { PublicShell } from "@/components/public-shell";
import { createClient } from "@/lib/supabase/client";

const trustItems = [
  "No long-term contracts",
  "Cancel anytime",
  "Your Twilio account stays yours",
];

const onboardingBenefits = [
  "Keep your existing business number",
  "Twilio onboarding assistance",
  "Fast missed-call text-back setup",
  "Designed specifically for HVAC workflows",
];

const nextSteps = [
  "Connect your Twilio account",
  "Customize your recovery message",
  "Start capturing missed-call opportunities",
];

export function SignupForm() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const businessName = String(formData.get("businessName") ?? "").trim();
    const phoneNumber = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorMessage("");
    setIsLoading(true);

    // Signup flow: Supabase creates the email/password auth user, stores the
    // onboarding fields as user metadata, then sends successful users onward.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
          phone_number: phoneNumber,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.session) {
      router.replace("/check-email");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <PublicShell>
      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-cyan-950/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                GET STARTED
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Set up your missed-call recovery workflow.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Create your account to start capturing missed-call leads,
                organizing customer replies, and recovering lost revenue.
              </p>
            </div>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="business-name" className="text-sm font-medium">
                  Business name
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-3.5 size-4 text-zinc-400" />
                  <input
                    id="business-name"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Work email
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
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone number
                </label>
                <div className="relative">
                  <PhoneCall className="pointer-events-none absolute left-3 top-3.5 size-4 text-zinc-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`${inputClass} pl-10`}
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
                    autoComplete="new-password"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
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
                {isLoading ? "Creating Workspace..." : "Create Workspace"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm font-medium text-slate-600">
              Most HVAC teams finish setup in under 15 minutes.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              {trustItems.map((item) => (
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
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-cyan-700">
                Login
              </Link>
            </p>
          </div>

          <aside className="flex flex-col justify-between bg-[linear-gradient(135deg,#083344_0%,#155e75_50%,#111827_100%)] p-8 text-white lg:p-12">
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-300 text-cyan-950 shadow-lg shadow-cyan-950/20">
                <PhoneCall className="size-6" aria-hidden="true" />
              </div>
              <h2 className="mt-8 text-4xl font-black tracking-tight">
                Simple onboarding for HVAC teams
              </h2>
              <p className="mt-5 text-base leading-8 text-cyan-50/90">
                Connect your business number, customize your text-back
                workflow, and start recovering missed calls without replacing
                your current phone system.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-cyan-50">
                {onboardingBenefits.map((item) => (
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

            <div className="mt-12 rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                WHAT HAPPENS NEXT
              </p>
              <div className="mt-5 grid gap-4">
                {nextSteps.map((step, index) => (
                  <div key={step} className="grid grid-cols-[2rem_1fr] gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-cyan-950">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm font-semibold leading-6 text-cyan-50">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </PublicShell>
  );
}
