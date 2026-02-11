import type { Route } from "./+types/services";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { ServicesSection } from "~/components/ServicesSection";
import { ContactSection } from "~/components/ContactSection";

export function meta({}: Route.MetaArgs) {
  const title = "Our Services | The AdPharm";
  const description = "Explore The AdPharm's core capabilities in pharmaceutical advertising, medical communications, digital innovation, and strategic marketing solutions.";
  const url = "https://theadpharm.com/services";
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

export default function Services() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full pt-16">
        <div id="services">
          <ServicesSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}
