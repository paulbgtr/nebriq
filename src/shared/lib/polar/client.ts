import { Polar } from "@polar-sh/sdk";
import { getPolarToken } from "@/app/actions/polar/token";

export const polar = async () => {
  const token = await getPolarToken();
  return new Polar({
    accessToken: token,
  });
};
