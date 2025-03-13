import { Polar } from "@polar-sh/sdk";

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN is not set");
}

export const polar = new Polar({
  accessToken: "polar_oat_FMTTLU0bdT38mSSt17CsfatvmiFvPSk0xhDm3351JUW",
});
