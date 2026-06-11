import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import {
  ProductPreview,
  PublicShell,
  SectionHeading,
} from "@/components/public-shell";
import {
  darkPrimaryButtonClass,
  secondaryButtonClass,
} from "@/components/brand";

const stats = [
  {
    title: "Text back in seconds",
    text: "Trigger an immediate reply while the customer is still ready to book.",
    icon: MessageSquareText,
  },
  {
    title: "Recover after-hours leads",
    text: "Keep urgent repair requests warm even when the office is closed.",
    icon: Clock3,
  },
  {
    title: "Keep every conversation organized",
    text: "Track phone, status, last message, and next step in one queue.",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: "Missed call detected",
    text: "A missed inbound call becomes a visible lead with phone number and time.",
  },
  {
    title: "Auto text sent",
    text: "Your prebuilt reply asks what the customer needs and keeps the moment alive.",
  },
  {
    title: "Lead captured in dashboard",
    text: "Your team sees the thread, updates the status, and books the job.",
  },
];

const heroProofs = [
  "Replies in under 60 seconds",
  "Built for HVAC service teams",
  "Two-way SMS follow-up",
  "Recover after-hours leads automatically",
];

const ctaChecklist = [
  "Missed-call text-back",
  "Two-way SMS thread",
  "Lead status tracking",
];

const marketingCardClass =
  "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

const marketingCardTextClass = "mt-2 text-[17px] leading-8 text-slate-600";

export default function Home() {
  return (
    <PublicShell>
      <main>
        <section className="relative min-h-[720px] bg-[linear-gradient(135deg,#082f49_0%,#0f766e_48%,#111827_100%)] px-4 pb-24 pt-24 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[48px_48px] opacity-15" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr]">
            <div className="max-w-[720px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 text-sm font-medium text-cyan-50">
                <PhoneCall className="size-4" aria-hidden="true" />
                Built for HVAC service teams
              </div>
              <h1 className="mt-6 text-5xl font-black leading-[1.08] md:text-6xl xl:text-7xl">
                Never lose HVAC leads from missed calls again.
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-200">
                After-hours calls are your highest-intent leads. CallRecover
                texts missed callers back in seconds, keeps the conversation
                alive, and helps your dispatcher book the job before homeowners
                move on to a competitor.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-8 text-base font-bold text-slate-950 shadow-sm shadow-cyan-950/20 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25"
                >
                  Watch Demo
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-100/35 bg-white/10 px-8 text-base font-bold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                {heroProofs.map((proof) => (
                  <div
                    key={proof}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      className="size-4 shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />
                    <span>{proof}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full max-w-160 justify-self-center">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.title}
                  className={marketingCardClass}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold">{stat.title}</h2>
                  <p className={marketingCardTextClass}>{stat.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A faster path from missed call to booked job"
          >
            <p>
              Keep the workflow simple enough for a busy dispatcher, technician,
              or owner to use every day.
            </p>
          </SectionHeading>
          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={marketingCardClass}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-700 text-lg font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>
                <p className={marketingCardTextClass}>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[36px] border border-cyan-100 bg-gradient-to-br from-slate-50 to-cyan-50 p-8 shadow-xl shadow-slate-200/60 md:grid-cols-[1.1fr_0.9fr] md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Ready when the phone is not
              </p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Give every missed caller a clear next step.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                Start with a clean text-back workflow, then connect the backend
                when you are ready to automate real calls and SMS.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className={darkPrimaryButtonClass}>
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link href="/features" className={secondaryButtonClass}>
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {ctaChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 border-l-4 border-l-cyan-500 bg-white/90 px-6 py-5 shadow-sm transition hover:bg-white hover:shadow-md"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-cyan-700" />
                  <span className="text-base font-medium text-slate-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
