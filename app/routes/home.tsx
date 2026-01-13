import type { Route } from "./+types/home";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { HeroCircles } from "~/components/HeroCircles";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { HeroSection } from "~/components/HeroSection";
import { AboutSection } from "~/components/AboutSection";
import { ServicesSection } from "~/components/ServicesSection";
import { ExperienceSection } from "~/components/ExperienceSection";
import { InsightsSection } from "~/components/InsightsSection";
import { ContactSection } from "~/components/ContactSection";

export function meta({}: Route.MetaArgs) {
  return [{ title: "The AdPharm" }, { name: "description", content: "A full service agency in the truest sense." }];
}

export default function Home() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full">
        <div id="hero">
          <HeroSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div id="services">
          <ServicesSection />
        </div>
        <div id="experience">
          <ExperienceSection />
        </div>
        <div id="insights">
          <InsightsSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}
