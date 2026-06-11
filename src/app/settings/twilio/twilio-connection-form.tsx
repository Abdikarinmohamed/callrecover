"use client";

import { useActionState } from "react";
import { CheckCircle2, Save, Trash2 } from "lucide-react";

import {
  darkPrimaryButtonClass,
  inputClass,
  secondaryButtonClass,
} from "@/components/brand";

import {
  disconnectTwilioConnection,
  saveTwilioConnection,
  type TwilioConnectionFormState,
} from "../actions";

const initialTwilioState: TwilioConnectionFormState = {
  errors: {},
  message: "",
  status: "idle",
};

export type TwilioConnectionValues = {
  accountSid: string;
  phoneNumber: string;
  isConnected: boolean;
};

export function TwilioConnectionForm({
  initialValues,
}: {
  initialValues: TwilioConnectionValues;
}) {
  const [state, formAction, isPending] = useActionState(
    saveTwilioConnection,
    initialTwilioState,
  );
  const submitLabel = initialValues.isConnected
    ? "Update connection"
    : "Save Twilio connection";

  return (
    <>
      <form
        action={formAction}
        autoComplete="off"
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5"
      >
        <div className="grid gap-5 px-4 py-5 sm:px-6">
          {initialValues.isConnected ? (
            <TwilioConnectedStatus initialValues={initialValues} />
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              error={state.errors?.accountSid}
              id="twilio-account-sid"
              label="Twilio Account SID"
            >
              <input
                id="twilio-account-sid"
                name="twilio_account_sid"
                type="text"
                defaultValue=""
                autoComplete="off"
                aria-invalid={Boolean(state.errors?.accountSid)}
                aria-describedby={
                  state.errors?.accountSid
                    ? "twilio-account-sid-error"
                    : undefined
                }
                className={inputClass}
              />
            </Field>

            <Field
              error={state.errors?.authToken}
              id="twilio-auth-token"
              label="Twilio Auth Token"
            >
              <input
                id="twilio-auth-token"
                name="twilio_auth_token"
                type="password"
                defaultValue=""
                autoComplete="new-password"
                placeholder={
                  initialValues.isConnected
                    ? "Leave blank to keep existing token"
                    : undefined
                }
                aria-invalid={Boolean(state.errors?.authToken)}
                aria-describedby={
                  state.errors?.authToken
                    ? "twilio-auth-token-error"
                    : undefined
                }
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            error={state.errors?.phoneNumber}
            id="twilio-phone-number"
            label="Twilio Phone Number"
          >
            <input
              id="twilio-phone-number"
              name="twilio_phone_number"
              type="tel"
              defaultValue=""
              autoComplete="off"
              inputMode="tel"
              aria-invalid={Boolean(state.errors?.phoneNumber)}
              aria-describedby={
                state.errors?.phoneNumber
                  ? "twilio-phone-number-error"
                  : undefined
              }
              className={inputClass}
            />
          </Field>

          {state.status === "error" && state.message ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              Could not save Twilio connection: {state.message}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <button
            type="submit"
            className={darkPrimaryButtonClass}
            disabled={isPending}
          >
            <Save className="size-4" aria-hidden="true" />
            {isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
      {initialValues.isConnected ? (
        <form
          action={disconnectTwilioConnection}
          autoComplete="off"
          className="mt-4 flex justify-end"
        >
          <button
            type="submit"
            className={`${secondaryButtonClass} border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Disconnect Twilio
          </button>
        </form>
      ) : null}
    </>
  );
}

function TwilioConnectedStatus({
  initialValues,
}: {
  initialValues: TwilioConnectionValues;
}) {
  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50/60 px-4 py-4">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-teal-700"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-950">
            Twilio connected
          </h2>
          <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            <div>
              <dt className="font-medium text-slate-500">Account SID</dt>
              <dd className="mt-1 break-all font-semibold text-slate-900">
                {maskAccountSid(initialValues.accountSid)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Phone number</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {initialValues.phoneNumber}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Auth token</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                Saved securely
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
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

function maskAccountSid(accountSid: string) {
  const trimmed = accountSid.trim();

  if (!trimmed) {
    return "Not available";
  }

  if (trimmed.length <= 10) {
    return `${trimmed.slice(0, 2)}${"\u2022".repeat(6)}`;
  }

  return `${trimmed.slice(0, 6)}${"\u2022".repeat(6)}${trimmed.slice(-4)}`;
}
