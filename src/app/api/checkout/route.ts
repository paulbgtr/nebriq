import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: "polar_oat_FMTTLU0bdT38mSSt17CsfatvmiFvPSk0xhDm3351JUW",
  successUrl: "http://localhost:3000/confirmation",
});
