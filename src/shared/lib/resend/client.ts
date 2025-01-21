import { Resend } from "resend";

if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment");
}

export const client = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
