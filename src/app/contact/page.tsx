import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  PageIntro,
  PublicShell,
  SectionHeading,
} from "@/components/public-shell";
import {
  darkPrimaryButtonClass,
  inputClass,
  secondaryButtonClass,
} from "@/components/brand";

const contactTopics = [
  "Missed-call recovery setup",
  "Twilio onboarding assistance",
  "Workflow mapping for your team",
  "Demo walkthroughs",
  "Help configuring your business number",
];

const nextSteps = [
  "We review your current workflow.",
  "We help connect or configure your Twilio number.",
  "We customize your missed-call text-back flow.",
  "Your team starts capturing more opportunities.",
];

const setupItems = [
  "Keep your business number",
  "Connect your Twilio account",
  "Start recovering missed calls",
];

export default function ContactPage() {
  return (
    <PublicShell>
      <main>
        <PageIntro
          eyebrow="CONTACT"
          title="Start recovering missed HVAC leads faster."
        >
          <p>
            Tell us how your team handles missed calls today and we&apos;ll help
            you build the right recovery workflow.
          </p>
        </PageIntro>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-3xl border border-cyan-900/10 bg-[linear-gradient(135deg,#083344_0%,#0f766e_100%)] p-6 text-white shadow-xl shadow-cyan-950/20 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
                CONTACT
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Talk to someone who understands HVAC follow-up.
              </h2>
              <p className="mt-4 text-base leading-7 text-cyan-50/90">
                We help HVAC teams reduce lost jobs from missed calls,
                after-hours requests, and slow follow-up workflows.
              </p>
              <div className="mt-8 grid gap-4">
                {contactTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-cyan-100"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold leading-6 text-cyan-50">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </aside>

            <form className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-950">
                  Tell us about your workflow
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Share a few details about your HVAC business and what happens
                  when calls are missed.
                </p>
              </div>
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    What do you need help with?
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    defaultValue="demo"
                    className={inputClass}
                  >
                    <option value="demo">Book a demo</option>
                    <option value="twilio">Twilio setup help</option>
                    <option value="workflow">
                      Missed-call workflow review
                    </option>
                    <option value="pricing">Pricing questions</option>
                    <option value="general">General inquiry</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how your team currently handles missed calls, after-hours requests, or lead follow-up."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-cyan-400/15"
                  />
                </div>
                <button type="button" className={darkPrimaryButtonClass}>
                  Book a demo
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="NEXT STEPS"
            title="What happens after you contact us?"
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-4">
            {nextSteps.map((step, index) => (
              <article
                key={step}
                className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-zinc-950/5 sm:grid-cols-[3rem_1fr] sm:items-center sm:p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-base font-black text-white">
                  {index + 1}
                </div>
                <p className="text-lg font-bold leading-7 text-slate-800">
                  {step}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="SIMPLE SETUP"
            title="No need to replace your current phone system."
          >
            <p>CallRecover works alongside your existing HVAC workflow.</p>
          </SectionHeading>
          <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
            {setupItems.map((item) => (
              <article
                key={item}
                className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-slate-950">
                  {item}
                </h2>
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
              Recover missed-call revenue before it goes somewhere else.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-cyan-50/85">
              Most HVAC teams can get started quickly with a simple Twilio
              connection and recovery workflow setup.
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
