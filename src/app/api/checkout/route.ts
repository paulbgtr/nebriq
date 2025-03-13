import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: "polar_oat_csKmA6JBeUo9ch7ydTweSVzsIUjwKp8rLxHwy16HEkX",
  successUrl: "http://localhost:3000/confirmation",
  server: "sandbox", // Use this option if you're using the sandbox environment - else use 'production' or omit the parameter
});

// The Polar API automatically accepts the following URL parameters:
// customerEmail - ?customerEmail=user@example.com
// No need for transformSearchParams as the library handles these parameters automatically
