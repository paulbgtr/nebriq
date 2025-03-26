import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_TOKEN,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation`,
});
