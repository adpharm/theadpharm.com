import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";

export function SocialLinks() {
  return (
    <div className="pt-8 border-t border-white/10">
      <div className="text-xs text-white/40 tracking-wider uppercase mb-4">Follow Us</div>
      <div className="flex gap-4">
        <motion.a
          href="https://ca.linkedin.com/company/the-adpharm"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3 }}
          onClick={() => browserTrackEvent("Contact Link Clicked", { link_type: "linkedin" })}
          className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
        >
          <Linkedin className="w-5 h-5" />
        </motion.a>
        {/* <motion.a
          href="#"
          whileHover={{ y: -3 }}
          className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
        >
          <Twitter className="w-5 h-5" />
        </motion.a> */}
      </div>
    </div>
  );
}
