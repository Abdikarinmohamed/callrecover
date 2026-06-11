"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRight, MessageSquareText, PhoneCall } from "lucide-react";
import {
  darkPrimaryButtonClass,
  LogoMark,
  PRODUCT_NAME,
} from "@/components/brand";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const previewLeads = [
  {
    id: "preview-1",
    phone: "(602) 555-0184",
    status: "Needs reply",
    lastMessage: "Hi, our AC stopped cooling this afternoon.",
  },
  {
    id: "preview-2",
    phone: "(480) 555-0138",
    status: "Booked",
    lastMessage: "Thanks, Tuesday at 9 works for us.",
  },
  {
    id: "preview-3",
    phone: "(623) 555-0199",
    status: "Waiting",
    lastMessage: "Can you send the earliest appointment slot?",
  },
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f9fb] text-zinc-950">
      <PublicNavbar />
      {children}
      <Footer />
    </div>
  );
}

export function PublicNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] max-w-[1500px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark
            size="size-12"
            className="text-base shadow-md shadow-cyan-900/20"
          />
          <span className="text-2xl font-bold text-slate-950 xl:text-3xl">
            {PRODUCT_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-2 text-[18px] font-semibold transition ${
                  isActive
                    ? "text-slate-950 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-cyan-600"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[18px] font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Login
          </Link>

          <Link href="/signup" className={darkPrimaryButtonClass}>
            Get Started
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative border-b border-cyan-950/10 bg-[linear-gradient(135deg,#082f49_0%,#0f766e_52%,#111827_100%)] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <div className="mx-auto mt-5 max-w-2xl text-base leading-7 text-cyan-50/90">
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <div className="mt-4 text-base leading-7 text-zinc-600">{children}</div>
      ) : null}
    </div>
  );
}

export function ProductPreview() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white p-3 shadow-2xl shadow-cyan-950/40">
      <div className="rounded-xl border border-slate-800 bg-[#061826]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-rose-300" />
            <span className="size-2 rounded-full bg-amber-300" />
            <span className="size-2 rounded-full bg-emerald-300" />
          </div>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
            Auto-text active
          </span>
        </div>
        <div className="grid gap-3 p-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Lead queue</p>
              <p className="text-xs text-cyan-100">Today</p>
            </div>
            <div className="space-y-2">
              {previewLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-[1fr_6.75rem] gap-3 rounded-lg border border-white/10 bg-white/10 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <PhoneCall
                        className="size-4 shrink-0 text-cyan-200"
                        aria-hidden="true"
                      />
                      <p className="truncate text-sm font-medium text-white">
                        {lead.phone}
                      </p>
                    </div>
                    <p className="mt-1 truncate text-xs text-zinc-300">
                      {lead.lastMessage}
                    </p>
                  </div>
                  <span className="self-start rounded-full border border-white/10 bg-white/10 px-2 py-1 text-center text-xs text-zinc-100">
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquareText
                className="size-4 text-cyan-200"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-white">SMS thread</p>
            </div>
            <div className="space-y-3 text-sm">
              <p className="max-w-[86%] rounded-lg bg-white/15 p-3 text-zinc-100">
                Sorry we missed your call. What HVAC issue can we help with?
              </p>
              <p className="ml-auto max-w-[86%] rounded-lg bg-cyan-300 p-3 font-medium text-cyan-950">
                AC repair. House is still warm.
              </p>
              <p className="max-w-[86%] rounded-lg bg-white/15 p-3 text-zinc-100">
                We can help. Would today or tomorrow morning work better?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#021126] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size="size-12" />
              <span className="text-3xl font-bold">{PRODUCT_NAME}</span>
            </div>
            <p className="mt-4 max-w-sm text-base leading-7 text-slate-300">
              Missed-call text-back software for HVAC teams that want fewer lost
              leads and cleaner follow-up.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Company
            </p>
            <div className="mt-5 flex flex-col gap-3 text-lg text-slate-200">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Access
            </p>
            <div className="mt-5 flex flex-col gap-3 text-lg text-slate-200">
              <Link href="/login" className="transition hover:text-cyan-400">
                Login
              </Link>
              <Link href="/signup" className="transition hover:text-cyan-400">
                Get Started
              </Link>
              <Link href="/dashboard" className="transition hover:text-cyan-400">
                View Demo
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-400">
            &copy; 2026 {PRODUCT_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
