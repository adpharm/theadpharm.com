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
  const title = "The AdPharm | Full Service Pharmaceutical Advertising Agency";
  const description = "A full service pharmaceutical advertising agency in the truest sense. We deliver strategic marketing solutions for life sciences and healthcare brands.";
  const url = "https://theadpharm.com";
  const image = "https://theadpharm.com/images/gray-bg-group-photo.png";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "The AdPharm" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
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
