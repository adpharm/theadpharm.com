import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { services } from "~/data/services";
import { ServiceCard } from "./services/ServiceCard";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";

interface ServicesSectionProps {
  isHomepage?: boolean;
}

export function ServicesSection({ isHomepage = false }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(() => new Set(services.map((_, index) => index)));

  return (
    <section ref={ref} className="relative py-12 lg:py-32 border-b border-white/10 scroll-mt-24">
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
        {!isHomepage ? (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <p className="text-lg leading-relaxed text-white/60 max-w-4xl">
                Each capability is engineered for maximum impact and seamlessly integrated across every touchpoint.
              </p>
            </motion.div>
            <div className="space-y-8">
              {services.map((service, index) => (
                <ServiceCard
                  id={service.id}
                  key={index}
                  service={service}
                  index={index}
                  isExpanded={expandedIndices.has(index)}
                  onToggle={() => {
                    const newExpanded = new Set(expandedIndices);
                    if (newExpanded.has(index)) {
                      newExpanded.delete(index);
                    } else {
                      newExpanded.add(index);
                      browserTrackEvent("Service Accordion Expanded", {
                        service_title: service.title,
                        service_index: index,
                      });
                    }
                    setExpandedIndices(newExpanded);
                  }}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                className="bg-white/5 border border-white/10 p-8"
              >
                <h3 className="text-2xl tracking-tight uppercase text-white mb-4">{service.title}</h3>
                <p className="text-white/60 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Technical Annotation or CTA */}
        {!isHomepage ? (
          // <motion.div
          //   initial={{ opacity: 0 }}
          //   animate={isInView ? { opacity: 1 } : {}}
          //   transition={{ duration: 0.8, delay: 0.8 }}
          //   className="mt-16 flex justify-end"
          // >
          //   <div className="text-right text-xs text-white/30 tracking-widest uppercase max-w-md">
          //     <div className="h-px w-full bg-white/10 mb-4" />
          //     Each capability is engineered for maximum impact, integrated seamlessly across all touchpoints.
          //   </div>
          // </motion.div>
          <></>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative mobile-glow-active">
              {/* Glow layer (blurred) - always visible */}
              <div className="animated-border-glow absolute inset-0 opacity-100" />

              {/* Border animation layer - always visible */}
              <div className="animated-border absolute inset-0 opacity-100" />

              {/* Content wrapper */}
              <div className="relative p-px">
                <div className="relative bg-[var(--bg-base)] z-10">
                  <Link
                    to="/services"
                    onClick={() => browserTrackEvent("CTA Clicked", { cta_label: "Explore Our Services" })}
                    className="relative block px-8 py-4 bg-white/10 hover:bg-white/[0.15] transition-colors duration-300"
                  >
                    <span className="text-white tracking-widest uppercase text-sm">Explore Our Services</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
