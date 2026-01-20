import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlowingBox } from "./GlowingBox";
import { LeadershipTeam } from "./LeadershipTeam";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-orange-400 tracking-[0.3em] uppercase text-xs">About Us</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Mission Statement */}
          <GlowingBox delay={0.2}>
            <div className="absolute top-0 right-0 w-24 h-24 border-l border-b border-white/10" />
            <h3 className="text-3xl tracking-tight uppercase">Our Mission</h3>
            <p className="text-white/60 leading-relaxed mt-8">
              To bridge the gap between pharmaceutical innovation and patient care through exceptional creative
              excellence and unwavering medical accuracy. We are architects of communication, building trust between
              science and humanity.
            </p>
            <div className="flex gap-8 text-sm text-white/40 mt-8">
              <div className="border-l-2 border-orange-400 pl-4">
                <div className="text-white text-2xl">20+</div>
                <div>Years Experience</div>
              </div>
              <div className="border-l-2 border-orange-400 pl-4">
                <div className="text-white text-2xl">100+</div>
                <div>Successful Campaigns</div>
              </div>
            </div>
          </GlowingBox>

          {/* Background Summary */}
          <GlowingBox delay={0.3}>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-l border-t border-white/10" />
            <h3 className="text-3xl tracking-tight uppercase">Our Foundation</h3>
            <p className="text-white/60 leading-relaxed mt-8">
              Established in Canada, The Adpharm has evolved from a boutique pharmaceutical consultancy into a
              full-spectrum agency. Our multidisciplinary team combines scientific rigor with creative brilliance,
              delivering campaigns that don't just inform—they inspire action.
            </p>
            <div className="space-y-2 text-sm text-white/40 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35]" />
                <span>Canadian Heritage & Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35]" />
                <span>Medical & Creative Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35]" />
                <span>Evidence-Based Innovation</span>
              </div>
            </div>
          </GlowingBox>
        </div>

        {/* Leadership Team */}
        <LeadershipTeam />
      </div>
    </section>
  );
}
