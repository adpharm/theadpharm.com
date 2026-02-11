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
      {/* Background image integrated with grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Photo positioned in background */}
        <div className="absolute right-0 bottom-0 w-[80%] h-[90%] hidden lg:block">
          <div className="relative w-full h-full">
            {/* Grid overlay on top of photo */}
            {/* <div
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
              `,
                backgroundSize: "80px 80px",
              }}
            /> */}

            {/* The actual photo with blend mode and opacity */}
            <img
              src="/images/full-group-photo-bw.png"
              alt="The Adpharm Team"
              className="w-full h-full object-cover object-bottom opacity-40"
              style={{
                mixBlendMode: "luminosity",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.8) 100%), linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.8) 100%), linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />

            {/* Accent border frames integrated with grid */}
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[var(--accent-primary)]/20" />
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 w-full px-8 lg:px-16 py-20 ml-6 sm:ml-[10vw]">
        {/* Typography - positioned to the left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8 max-w-3xl"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-orange-400 tracking-[0.3em] uppercase text-xs"
            >
              The Adpharm
            </motion.div>
            <h1 className="text-6xl lg:text-7xl xl:text-[100px] tracking-tight leading-[0.95] uppercase font-semibold">
              A Full Service
              <br />
              <span className="text-white/40">Agency In The</span>
              <br />
              Truest Sense.
            </h1>
          </div>

          <div className="border-l-2 border-[var(--accent-primary)] pl-6 py-2">
            <p className="text-white/70 text-lg max-w-md leading-snug lg:leading-relaxed">
              Proven Canadian partner, 20+ years in pharma, with integrated creative + medical expertise.
            </p>
          </div>

          <a href="/about">
            <StyledButton icon={ArrowRight}>Discover More</StyledButton>
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
