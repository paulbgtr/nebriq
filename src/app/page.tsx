import { NeuralNetwork } from "@/modules/landing-page/features/visuals/neural-network";
import { HeroSection } from "@/modules/landing-page/sections/hero";
import { FeaturesOverviewSection } from "@/modules/landing-page/sections/features-section";
import { EssentialToolsSection } from "@/modules/landing-page/sections/essential-tools-section";
import { CtaSection } from "@/modules/landing-page/sections/cta-section";
import { Header } from "@/modules/landing-page/sections/header";
import { Footer } from "@/modules/landing-page/sections/footer";
import { PowerfulEditorSection } from "@/modules/landing-page/sections/powerful-editor";
import { ProblemSection } from "@/modules/landing-page/sections/problem";
import { PricingSection } from "@/modules/landing-page/sections/pricing-section";
import { OpenSourceSection } from "@/modules/landing-page/sections/open-source-section";
import { polar } from "@/shared/lib/polar/client";

export default async function Home() {
  const motionConfig = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const polarClient = await polar();

  const { result } = await polarClient.products.list({
    isArchived: false,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header motionConfig={motionConfig} />

      {/* Main Content */}
      <main className="flex-1 mt-10">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <NeuralNetwork />

          <div className="absolute inset-0 bg-gradient-radial from-background/70 via-background/50 to-transparent" />
        </div>

        <HeroSection />

        <ProblemSection />

        <FeaturesOverviewSection />

        <EssentialToolsSection />

        <PowerfulEditorSection />

        <OpenSourceSection />

        <PricingSection products={result.items} />

        <CtaSection />

        <Footer />
      </main>
    </div>
  );
}
