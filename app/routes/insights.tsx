import type { Route } from "./+types/insights";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { InsightsSection } from "~/components/InsightsSection";
import { ContactSection } from "~/components/ContactSection";

export function meta({}: Route.MetaArgs) {
  const title = "Insights & Solutions | The AdPharm";
  const description = "Discover intelligence-driven insights and innovative solutions from The AdPharm's pharmaceutical advertising experts.";
  const url = "https://theadpharm.com/insights";
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

export default function Insights() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full pt-16">
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
