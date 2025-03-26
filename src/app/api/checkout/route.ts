import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_TOKEN,
  successUrl: "https://nebriq.com/confirmation",
});
