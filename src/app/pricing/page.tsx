import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { darkPrimaryButtonClass, secondaryButtonClass } from "@/components/brand";

const pricingBullets = [
  "Unlimited missed-call text-back",
  "Two-way SMS inbox",
  "Lead dashboard and tracking",
  "Bring your own Twilio number",
];

const includedItems = [
  "Unlimited missed-call auto-texts",
  "Two-way SMS conversations per lead",
  "Full lead management dashboard",
  "Call outcome tracking",
  "Custom open-hours and after-hours message templates",
  "Business hours controls with timezone support",
  "Bring your own Twilio number",
  "CSV export of all leads",
  "Staff replies from dashboard",
  "STOP reply support",
];

const faqs = [
  {
    question: "What does CallRecover cost?",
    answer:
      "CallRecover is $149/month after the 7-day free trial. Twilio usage is billed separately through your own Twilio account.",
  },
  {
    question: "Do I need a Twilio account?",
    answer:
      "Yes. CallRecover connects to your existing Twilio account so missed-call texts and replies are sent from your business number.",
  },
  {
    question: "Can I cancel after the trial?",
    answer: "Yes. CallRecover is month-to-month and can be canceled anytime.",
  },
  {
    question: "Can I use this with more than one location?",
    answer:
      "Each business location should have its own Twilio number and workspace.",
  },
  {
    question: "What is A2P 10DLC?",
    answer:
      "A2P 10DLC is a US carrier registration requirement for business SMS. We can guide users through this during setup later.",
  },
];

export default function PricingPage() {
  return (
    <PublicShell>
      <main>
        <section className="relative overflow-hidden border-b border-cyan-950/10 bg-[linear-gradient(135deg,#082f49_0%,#0f766e_52%,#111827_100%)] px-4 py-24 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-15" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-cyan-100">
              PRICING
            </p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Simple flat-rate pricing
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50/90">
              Everything your HVAC team needs to recover missed calls.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-cyan-50/75">
              Twilio SMS costs are billed separately through your own Twilio
              account.
            </p>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-xl rounded-3xl border border-cyan-100 bg-white p-8 text-center shadow-xl shadow-zinc-950/5">
            <p className="mx-auto inline-flex rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold uppercase text-cyan-700">
              7-DAY FREE TRIAL
            </p>
            <div className="mt-8 flex items-end justify-center gap-2">
              <span className="text-5xl font-black text-slate-950">$149</span>
              <span className="pb-2 text-lg font-semibold text-slate-600">
                /month
              </span>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              Everything included. No feature gates or upsells.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Cancel anytime after trial.
            </p>
            <Link
              href="/signup"
              className={`${darkPrimaryButtonClass} mt-8 w-full`}
            >
              Get Started
            </Link>
            <div className="mt-8 grid gap-3 text-left">
              {pricingBullets.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-base font-semibold text-slate-700"
                >
                  <CheckCircle2
                    className="size-5 shrink-0 text-cyan-700"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-black text-slate-950">
              Everything is included
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              No feature gates, no seat limits, no upsells.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
            {includedItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-cyan-700"
                  aria-hidden="true"
                />
                <span className="text-base font-semibold text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-zinc-950/5 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950">
                You own your number, your data, and your customer relationships
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-slate-600">
                CallRecover connects to your own Twilio account, so your phone
                number, SMS history, and customer relationships stay under your
                control.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-black text-slate-950">
              Pricing FAQ
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[36px] bg-[linear-gradient(135deg,#021126_0%,#0f766e_62%,#111827_100%)] px-6 py-16 text-center text-white shadow-xl shadow-slate-300/50 sm:px-10">
            <h2 className="mx-auto max-w-3xl text-4xl font-black sm:text-5xl">
              Ready to recover more missed calls?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-cyan-50/85">
              Get your workflow running in under an hour.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/signup" className={secondaryButtonClass}>
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
