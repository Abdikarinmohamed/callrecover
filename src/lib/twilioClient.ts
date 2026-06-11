import twilio from "twilio";

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID ?? "AC00000000000000000000000000000000",
  process.env.TWILIO_AUTH_TOKEN ?? "placeholder-auth-token",
);
