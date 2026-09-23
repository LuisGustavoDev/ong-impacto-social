import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { MetricsSection } from "@/components/sections/MetricsSection";
import { StoriesSection } from "@/components/sections/StoriesSection";

/** A home só compõe as seções; cada id bate com um link da Navbar. */
export default function Home() {
  return (
    <main id="conteudo" className="flex-1">
      <HeroSection />
      <AboutSection />
      <MetricsSection />
      <ImpactSection />
      <StoriesSection />
      <FaqSection />
    </main>
  );
}
