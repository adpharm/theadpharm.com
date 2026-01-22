import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Spacer } from "./misc/spacer";
import { ClientGrid } from "./experience/ClientGrid";
import { TherapeuticAreasList } from "./experience/TherapeuticAreasList";

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-12 lg:py-32 border-b border-white/10 bg-[var(--bg-darker)]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">Our Experience</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Proven
            <br />
            <span className="text-white/40">Excellence</span>
          </h2>
        </motion.div>

        <ClientGrid />

        <Spacer size="lg" />

        <TherapeuticAreasList />
      </div>
    </section>
  );
}
