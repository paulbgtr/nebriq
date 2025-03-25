import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_TOKEN,
  successUrl: "http://localhost:3000/confirmation",
});
