import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  LayoutDashboard,
  MessageSquareText,
  PhoneForwarded,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { ProductPreview, PublicShell } from "@/components/public-shell";
import { secondaryButtonClass } from "@/components/brand";

const features = [
  {
    title: "Missed-call text-back",
    description:
      "Send a clear reply when a homeowner calls and no one answers.",
    icon: PhoneForwarded,
  },
  {
    title: "Two-way SMS inbox",
    description:
      "Keep replies organized in one focused thread your team can scan quickly.",
    icon: MessageSquareText,
  },
  {
    title: "Lead dashboard",
    description:
      "See phone numbers, latest messages, missed-call times, and status.",
    icon: LayoutDashboard,
  },
  {
    title: "After-hours recovery",
    description:
      "Capture nights and weekends before the customer calls the next company.",
    icon: Clock3,
  },
  {
    title: "Status tracking",
    description:
      "Move leads from New to Waiting, Booked, or Closed.",
    icon: Tags,
  },
  {
    title: "Customizable replies",
    description:
      "Tune the text-back message, booking link, and business tone.",
    icon: SlidersHorizontal,
  },
];

const workflowSteps = [
  {
    title: "A homeowner calls your HVAC business and no one answers.",
    text: "Calls can be missed during jobs, after hours, or when lines are busy.",
  },
  {
    title: "CallRecover instantly sends a text reply.",
    text: "The homeowner receives a professional message from your business number within seconds.",
  },
  {
    title: "The customer replies and appears in your dashboard.",
    text: "Your office team can continue the conversation from one organized thread.",
  },
  {
    title: "Update the lead status and book the job.",
    text: "Track leads through New, Waiting, Booked, and Closed.",
  },
];

const featureCardClass =
  "rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

export default function FeaturesPage() {
  return (
    <PublicShell>
      <main>
        <section className="relative overflow-hidden border-b border-cyan-950/10 bg-[linear-gradient(135deg,#082f49_0%,#0f766e_52%,#111827_100%)] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-15" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="text-sm font-semibold uppercase text-cyan-100">
                FEATURES
              </p>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Everything your HVAC team needs to recover missed calls
              </h1>
              <p className="mt-5 text-lg leading-8 text-cyan-50/90">
                Capture missed calls, text homeowners instantly, and manage
                every follow-up from one clean workflow.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                <Link href="/signup" className={secondaryButtonClass}>
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-100/35 bg-white/10 px-7 text-base font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25"
                >
                  View Demo
                </Link>
              </div>
            </div>
            <div className="w-full max-w-3xl justify-self-center lg:justify-self-end">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-cyan-700">
              WHAT IS INCLUDED
            </p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              Everything your team needs to recover missed calls
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Start with the core workflow: missed-call capture, instant
              text-back, two-way SMS, and clear lead status tracking.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className={featureCardClass}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-slate-950">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-[17px] leading-8 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm shadow-zinc-950/5 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-black text-slate-950">
                How it works
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A simple workflow built for HVAC dispatch and after-hours lead
                recovery.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-5">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[3.5rem_1fr]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[17px] leading-8 text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[36px] bg-[linear-gradient(135deg,#021126_0%,#0f766e_62%,#111827_100%)] px-6 py-16 text-center text-white shadow-xl shadow-slate-300/50 sm:px-10">
            <h2 className="mx-auto max-w-3xl text-4xl font-black sm:text-5xl">
              Ready to stop losing missed-call leads?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-cyan-50/85">
              Start recovering missed calls in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={secondaryButtonClass}>
                Get Started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-100/35 bg-white/10 px-7 text-base font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
