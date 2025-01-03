import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Poppins } from "next/font/google";
import { Toaster } from "@/shared/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nebriq - Write Better, Think Clearer | AI-Powered Writing Workspace",
  description:
    "Transform your writing process with Nebriq, an all-in-one AI writing workspace that helps you organize thoughts, connect ideas, and produce better content in half the time.",
  keywords: [
    "writing tool",
    "note-taking",
    "AI writing assistant",
    "productivity tool",
    "content organization",
  ],
  authors: [{ name: "Nebriq" }],
  creator: "Nebriq",
  publisher: "Nebriq",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nebriq.com",
    title: "Nebriq - Write Better, Think Clearer",
    description:
      "Transform your writing process with Nebriq, an all-in-one AI writing workspace that helps you organize thoughts, connect ideas, and produce better content in half the time.",
    siteName: "Nebriq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebriq - Write Better, Think Clearer",
    description:
      "Transform your writing process with Nebriq, an all-in-one AI writing workspace.",
    creator: "@nebriq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token", // todo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Nebriq",
              applicationCategory: "ProductivityApplication",
              description:
                "An all-in-one writing workspace that helps you organize thoughts, connect ideas, and produce better content.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              operatingSystem: "Web browser",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "100",
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>

        <Toaster />
      </body>
    </html>
  );
}
