import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  PageIntro,
  PublicShell,
  SectionHeading,
} from "@/components/public-shell";
import { secondaryButtonClass } from "@/components/brand";

const problemValues = [
  {
    title: "Built for HVAC",
    text: "Designed around urgent repair calls, not generic CRM workflows.",
  },
  {
    title: "Works instantly",
    text: "The first text-back is triggered when a missed call is captured.",
  },
  {
    title: "Follow-up stays organized",
    text: "Every lead keeps the phone number, message thread, status, and next step in one place.",
  },
  {
    title: "Revenue-focused",
    text: "The goal is simple: recover missed-call opportunities before they go somewhere else.",
  },
];

const hvacReasons = [
  "Emergency repair demand is high intent.",
  "After-hours calls still need a response.",
  "Fast follow-up helps teams win the job before competitors.",
];

const audienceCards = [
  {
    title: "Owner-operators",
    text: "Solo HVAC techs and small crews who are on the road and cannot answer every call.",
  },
  {
    title: "Growing HVAC businesses",
    text: "Teams with office staff or dispatchers who still miss calls during rush periods, weekends, and after hours.",
  },
  {
    title: "Multi-tech operations",
    text: "Larger HVAC teams that need a cleaner way to capture, track, and close missed-call leads.",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <main>
        <PageIntro
          eyebrow="ABOUT"
          title="Recover HVAC jobs before homeowners call the next company."
        >
          <p>
            CallRecover helps HVAC teams instantly text back missed callers,
            organize follow-up, and recover revenue lost to unanswered calls.
          </p>
        </PageIntro>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                THE PROBLEM
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Missed calls should not become missed revenue.
              </h2>
              <div className="mt-5 space-y-4 text-[17px] leading-8 text-slate-600">
                <p>
                  Many HVAC companies miss calls during busy hours, peak
                  seasons, and after hours. When a homeowner&apos;s AC stops
                  working, they usually keep calling until someone responds.
                </p>
                <p>
                  CallRecover helps you respond in that critical moment with an
                  instant text-back workflow, a clean lead queue, and a simple
                  way to move every opportunity toward a booked job.
                </p>
              </div>
            </div>
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-cyan-950/10 sm:p-8">
              <div className="grid gap-5">
                {problemValues.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <CheckCircle2 className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="WHY HVAC?" title="Urgency makes follow-up matter">
            <p>
              HVAC calls are time-sensitive, seasonal, and easy to lose when the
              customer keeps searching for help.
            </p>
          </SectionHeading>
          <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3">
            {hvacReasons.map((item) => (
              <div
                key={item}
                className="flex min-h-32 items-start gap-4 rounded-3xl border border-slate-200 bg-[#fbfdfe] p-6 shadow-sm shadow-zinc-950/5"
              >
                <CheckCircle2
                  className="mt-1 size-5 shrink-0 text-cyan-700"
                  aria-hidden="true"
                />
                <p className="text-base font-semibold leading-7 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="WHO IT'S FOR"
            title="Built for HVAC teams that cannot afford missed opportunities."
          />
          <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
            {audienceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h2 className="text-2xl font-bold text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-3 text-[17px] leading-8 text-slate-600">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[36px] bg-[linear-gradient(135deg,#021126_0%,#0f766e_62%,#111827_100%)] px-6 py-16 text-center text-white shadow-xl shadow-slate-300/50 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
              GET STARTED
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black sm:text-5xl">
              Start recovering missed-call revenue this week.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-cyan-50/85">
              Use CallRecover to text missed callers, organize replies, and keep
              urgent HVAC leads from slipping away.
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
