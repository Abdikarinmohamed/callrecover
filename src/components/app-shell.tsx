"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  PlugZap,
  Settings,
} from "lucide-react";
import { BrandLockup, PRODUCT_NAME } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

export function AppShell({
  businessName,
  twilioConnected = false,
  userEmail,
  children,
}: {
  businessName?: string | null;
  twilioConnected?: boolean | null;
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const workspaceLabel = businessName || "Workspace not configured";
  const twilioLabel = twilioConnected ? "Manage Twilio" : "Connect Twilio";
  const appNavLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: (currentPathname: string) =>
        currentPathname === "/dashboard" || currentPathname.startsWith("/leads"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      isActive: (currentPathname: string) => currentPathname === "/settings",
    },
    {
      href: "/settings/twilio",
      label: twilioLabel,
      icon: PlugZap,
      isActive: (currentPathname: string) =>
        currentPathname === "/settings/twilio",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f9fb] text-slate-950">
      <aside className="hidden w-64 border-r border-slate-200 bg-white/95 px-4 py-6 shadow-sm lg:block">
        <Link href="/dashboard" className="mb-8 block px-2">
          <BrandLockup subtext={workspaceLabel} />
        </Link>
        <nav className="space-y-1">
          {appNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.isActive(pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-50 text-teal-800 ring-1 ring-cyan-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden border-b border-white/70 bg-white/90 px-6 py-3 shadow-sm backdrop-blur-xl lg:block">
          <div className="flex items-center justify-end">
            <AccountDisplay
              businessName={businessName}
              twilioLabel={twilioLabel}
              userEmail={userEmail}
            />
          </div>
        </header>
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6 lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/dashboard" className="text-sm font-semibold">
              {PRODUCT_NAME}
              <span className="mt-0.5 block text-xs font-medium text-slate-500">
                {businessName || userEmail || "Workspace not configured"}
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              {appNavLinks.map((link) => {
                const isActive = link.isActive(pathname);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-cyan-50 text-teal-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <LogoutButton />
            </nav>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function AccountDisplay({
  businessName,
  twilioLabel,
  userEmail,
}: {
  businessName?: string | null;
  twilioLabel: string;
  userEmail?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const workspaceLabel = businessName || "Workspace not configured";
  const emailLabel = userEmail || "No email available";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex max-w-xs items-center gap-3 rounded-lg px-3 py-2 text-right transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/20"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-950">
            {workspaceLabel}
          </span>
          <span className="mt-0.5 block truncate text-xs text-slate-500">
            {emailLabel}
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 text-left shadow-xl shadow-slate-950/10"
        >
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Workspace
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-slate-950">
              {workspaceLabel}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {emailLabel}
            </p>
          </div>
          <div className="grid gap-1 px-2 py-2">
            <Link
              href="/settings"
              role="menuitem"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="size-4 text-slate-500" aria-hidden="true" />
              Manage settings
            </Link>
            <Link
              href="/settings/twilio"
              role="menuitem"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
              onClick={() => setIsOpen(false)}
            >
              <PlugZap className="size-4 text-slate-500" aria-hidden="true" />
              {twilioLabel}
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex cursor-not-allowed items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-400"
              disabled
            >
              <span className="inline-flex items-center gap-3">
                <CreditCard className="size-4" aria-hidden="true" />
                Billing
              </span>
              <span className="text-xs font-medium">Coming soon</span>
            </button>
            <LogoutButton className="w-full justify-start border-transparent bg-transparent px-3 py-2 text-left text-red-700 hover:bg-red-50 hover:text-red-800" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
