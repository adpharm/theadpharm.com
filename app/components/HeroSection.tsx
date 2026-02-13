import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { StyledButton } from "./StyledButton";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden border-b border-white/10">
      {/* Background image - max 1920px wide with gradient edges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        {/* Image container - max 1920px */}
        <div className="relative w-full max-w-[1920px] h-full">
          <img
            src="/images/full-group-photo-bw.png"
            alt="The Adpharm Team"
            className="w-full h-full object-cover object-center"
          />

          {/* Dark tint overlay for text contrast */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Accent border frames - desktop only */}
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[var(--accent-primary)]/20 hidden lg:block" />
        </div>
        
        {/* Left gradient fade for ultrawide screens */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        
        {/* Right gradient fade for ultrawide screens */}
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 py-20">
        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8 max-w-3xl"
        >
          <div className="space-y-2">
            <h1 className="text-6xl lg:text-7xl xl:text-[100px] tracking-tight leading-[0.95] uppercase font-semibold">
              A Full Service
              <br />
              <span className="text-orange-500">Agency </span>In The
              <br />
              Truest Sense.
            </h1>
          </div>

          <div className="border-l-2 border-[var(--accent-primary)] pl-6 py-2">
            <p className="text-white/70 text-lg max-w-md leading-snug lg:leading-relaxed">
              Proven Canadian partner, 20+ years in pharma, with integrated creative + medical expertise.
            </p>
          </div>

          <a href="#contact">
            <StyledButton icon={ArrowRight}>Contact Us</StyledButton>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasScrolled ? 0 : 1 }}
        transition={{ duration: hasScrolled ? 0.5 : 1, delay: hasScrolled ? 0 : 1.5 }}
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase flex items-center gap-2">
          Scroll <ArrowDown className="animate-bounce w-4 h-4 text-[var(--accent-primary)]" />{" "}
        </span>
      </motion.div>
    </section>
  );
}
