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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-white/10">
      {/* Background geometric elements */}

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
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
              <h1 className="text-6xl lg:text-7xl xl:text-[86px] tracking-tight leading-[0.95] uppercase font-semibold">
                A Full Service
                <br />
                <span className="text-white/40">
                  Agency
                  <br />
                  In The
                </span>
                <br />
                Truest Sense.
              </h1>
            </div>

            <div className="border-l-2 border-[var(--accent-primary)] pl-6 py-2">
              <p className="text-white/70 text-lg max-w-md leading-snug lg:leading-relaxed">
                Proven Canadian partner, 20+ years in pharma, with integrated creative + medical expertise.
              </p>
            </div>

            <a href="#about-us">
              <StyledButton icon={ArrowRight}>Discover More</StyledButton>
            </a>
          </motion.div>

          {/* Right: Abstract 3D element placeholder */}
        </div>
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
        {/* <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 md:h-16 bg-gradient-to-b from-[var(--accent-primary)] to-transparent"
        /> */}
      </motion.div>

      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] border border-white/5 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] border border-white/10 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />

        {/* Grid lines */}
        {/* <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full grid grid-cols-12 gap-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white" />
            ))}
          </div>
        </div> */}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute inset-0 h-[500px] hidden lg:block"
      >
        <div className="absolute right-[20%] -bottom-[40%] flex items-center justify-center">
          {/* Multiple rotating circles */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-80 h-80 border border-white/10 rounded-full relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--accent-primary)] rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/20 rounded-full" />
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-60 h-60 border border-[var(--accent-primary)]/30 rounded-full"
          >
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-[var(--accent-primary)] rounded-full" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-[var(--accent-primary)] rounded-full" />
          </motion.div>

          <div className="absolute w-40 h-40 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent rounded-full blur-xl" />
        </div>
      </motion.div>
    </section>
  );
}
