import type { Route } from "./+types/about";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { AboutSection } from "~/components/AboutSection";
import { ContactSection } from "~/components/ContactSection";

export function meta({}: Route.MetaArgs) {
  const title = "About Us | The AdPharm";
  const description = "Learn about The AdPharm's mission, foundation, and leadership team. A full service pharmaceutical advertising agency with 20+ years of experience.";
  const url = "https://theadpharm.com/about";
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

export default function About() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full pt-16">
        <div id="about">
          <AboutSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}
