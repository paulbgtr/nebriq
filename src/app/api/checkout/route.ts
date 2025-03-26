import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const plan = searchParams.get("plan");
  const metadata = searchParams.get("metadata");

  console.log("Checkout request:", {
    url: request.url,
    productId,
    plan,
    metadata: metadata ? JSON.parse(decodeURIComponent(metadata)) : null,
    headers: Object.fromEntries(request.headers.entries()),
    origin: request.headers.get("origin"),
    referer: request.headers.get("referer"),
  });

  if (!productId) {
    console.error("Missing productId parameter");
    return NextResponse.json(
      { error: "Missing productId parameter" },
      { status: 400 }
    );
  }

  try {
    // Use the Checkout function from Polar
    const checkoutHandler = Checkout({
      accessToken: process.env.POLAR_TOKEN,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation`,
    });

    // Pass the request to the handler
    return checkoutHandler(request);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
};
