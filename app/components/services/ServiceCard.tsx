import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { GlowBorder } from "../GlowBorder";
import type { Service } from "~/data/services";

interface ServiceCardProps {
  service: Service;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isInView: boolean;
}

export function ServiceCard({ service, index, isExpanded, onToggle, isInView }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlowBorder
        clipPath="polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)"
        innerClipPath="polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)"
        showPointer={false}
      >
        <div>
          {/* Clickable Header */}
          <button
            onClick={onToggle}
            className="w-full text-left py-8 px-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-8">
              <span className="text-[var(--accent-primary)] text-lg tracking-wider font-mono">{service.number}</span>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl lg:text-3xl tracking-tight uppercase group-hover:text-[var(--accent-primary)] transition-colors">
                    {service.title}
                  </h3>
                  <ChevronRight
                    className={`w-6 h-6 text-white/40 transition-all duration-300 ${
                      isExpanded ? "rotate-90 text-[var(--accent-primary)]" : "group-hover:text-white"
                    }`}
                  />
                </div>

                <p className="text-white/60 leading-relaxed max-w-3xl">{service.description}</p>
              </div>
            </div>
          </button>

          {/* Expanded Details */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pl-[5.5rem]">
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[var(--accent-primary)]/20">
                {service.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="w-1 h-1 bg-[var(--accent-primary)] mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </GlowBorder>
    </motion.div>
  );
}
