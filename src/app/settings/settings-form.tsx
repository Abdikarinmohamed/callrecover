"use client";

import { useActionState } from "react";

import { darkPrimaryButtonClass, inputClass } from "@/components/brand";

import {
  saveBusinessSettings,
  type SettingsFormState,
} from "./actions";

const initialState: SettingsFormState = {
  errors: {},
  message: "",
  status: "idle",
};

export type SettingsFormValues = {
  businessName: string;
  contactEmail: string;
  phoneNumber: string;
  timezone: string;
  autoReplyMessage: string;
  bookingLink: string;
  autoTextEnabled: boolean;
};

export function SettingsForm({
  initialValues,
}: {
  initialValues: SettingsFormValues;
}) {
  const [state, formAction, isPending] = useActionState(
    saveBusinessSettings,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-slate-950">
          Business profile
        </h2>
      </div>
      <div className="grid gap-5 px-4 py-5 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            error={state.errors?.businessName}
            id="business-name"
            label="Business name"
          >
            <input
              id="business-name"
              name="businessName"
              type="text"
              defaultValue={initialValues.businessName}
              autoComplete="organization"
              aria-invalid={Boolean(state.errors?.businessName)}
              aria-describedby={
                state.errors?.businessName ? "business-name-error" : undefined
              }
              className={inputClass}
            />
          </Field>

          <Field id="contact-email" label="Contact email">
            <input
              id="contact-email"
              name="contactEmail"
              type="email"
              defaultValue={initialValues.contactEmail}
              autoComplete="email"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="business-phone" label="Business phone number">
            <input
              id="business-phone"
              name="phoneNumber"
              type="tel"
              defaultValue={initialValues.phoneNumber}
              autoComplete="tel"
              className={inputClass}
            />
          </Field>

          <Field id="timezone" label="Timezone">
            <select
              id="timezone"
              name="timezone"
              defaultValue={initialValues.timezone}
              className={inputClass}
            >
              <option value="America/Phoenix">America/Phoenix</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="America/Denver">America/Denver</option>
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </Field>
        </div>

        <section className="mt-2 grid gap-5 border-t border-slate-200 pt-5">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Missed-call workflow
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure your business profile and missed-call reply workflow.
            </p>
          </div>

          <Field
            error={state.errors?.autoReplyMessage}
            id="auto-reply"
            label="Auto-reply message"
          >
            <textarea
              id="auto-reply"
              name="autoReplyMessage"
              rows={4}
              defaultValue={initialValues.autoReplyMessage}
              aria-invalid={Boolean(state.errors?.autoReplyMessage)}
              aria-describedby={
                state.errors?.autoReplyMessage
                  ? "auto-reply-error"
                  : undefined
              }
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-cyan-400/15"
            />
          </Field>

          <Field
            error={state.errors?.bookingLink}
            id="booking-link"
            label="Booking link"
          >
            <input
              id="booking-link"
              name="bookingLink"
              type="text"
              defaultValue={initialValues.bookingLink}
              inputMode="url"
              aria-invalid={Boolean(state.errors?.bookingLink)}
              aria-describedby={
                state.errors?.bookingLink ? "booking-link-error" : undefined
              }
              className={inputClass}
            />
          </Field>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-cyan-100 bg-cyan-50/55 px-4 py-3">
            <div>
              <label
                htmlFor="auto-text-enabled"
                className="text-sm font-semibold text-slate-800"
              >
                Auto text enabled
              </label>
              <p className="mt-1 text-sm text-slate-600">
                Send the missed-call reply automatically.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                id="auto-text-enabled"
                name="autoTextEnabled"
                type="checkbox"
                defaultChecked={initialValues.autoTextEnabled}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-teal-700 peer-focus-visible:ring-4 peer-focus-visible:ring-cyan-400/20" />
              <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition peer-checked:translate-x-5" />
            </label>
          </div>
        </section>

        {state.status === "error" && state.message ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            Could not save settings: {state.message}
          </p>
        ) : null}
      </div>
      <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <button
          type="submit"
          className={darkPrimaryButtonClass}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  error,
  id,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
