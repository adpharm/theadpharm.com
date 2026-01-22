import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { services } from "~/data/services";
import { ServiceCard } from "./services/ServiceCard";

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-12 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">What We Do</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Our Core
            <br />
            <span className="text-white/40">Capabilities</span>
          </h2>
        </motion.div>

        {/* Interactive Cards / Manifest */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Technical Annotation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex justify-end"
        >
          <div className="text-right text-xs text-white/30 tracking-widest uppercase max-w-md">
            <div className="h-px w-full bg-white/10 mb-4" />
            Each capability is engineered for maximum impact, integrated seamlessly across all touchpoints.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
