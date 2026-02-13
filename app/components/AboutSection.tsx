import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router";
import { GlowingBox } from "./GlowingBox";
import { LeadershipTeam } from "./LeadershipTeam";

interface AboutSectionProps {
  isHomepage?: boolean;
}

export function AboutSection({ isHomepage = false }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="about-us" ref={ref} className="relative py-12 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-orange-400 tracking-[0.3em] uppercase text-sm md:text-xs font-medium">About Us</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
        </motion.div>

        {/* Team Photo with Content - About Page Only */}
        {!isHomepage && (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-16 lg:mb-24">
            {/* Team Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src="/images/full-group-photo-bw.png"
                  alt="The Adpharm Team"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 border-2 border-white/10 pointer-events-none" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl lg:text-4xl tracking-tight uppercase leading-tight">
                Architects of Healthcare Communication
              </h2>
              <p className="text-white/70 leading-relaxed mt-6">
                With over two decades of experience and 100+ successful campaigns under our belt, The Adpharm has grown
                from a boutique Canadian consultancy into a premier, full-spectrum pharmaceutical agency. We exist to
                bridge the critical gap between medical innovation and everyday patient care. By seamlessly integrating
                our deep scientific rigor with creative brilliance, we design evidence-based campaigns that do more than
                just inform. We build profound trust between science and humanity, delivering messages that truly
                inspire action.
              </p>
            </motion.div>
          </div>
        )}

        {/* Grid Layout - Homepage Only */}
        {isHomepage && (
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Background Summary - Now First */}
            <GlowingBox delay={0.2} notched>
              <h3 className="text-3xl tracking-tight uppercase">Our Foundation</h3>
              <p className="text-white/60 leading-relaxed mt-8">
                Established in Canada, The Adpharm has evolved from a boutique pharmaceutical consultancy into a
                full-spectrum agency. Our multidisciplinary team combines scientific rigor with creative brilliance,
                delivering campaigns that don't just inform—they inspire action.
              </p>
              <div className="space-y-2 text-sm text-white/40 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--accent-primary)]" />
                  <span>Canadian Heritage & Global Reach</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--accent-primary)]" />
                  <span>Medical & Creative Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--accent-primary)]" />
                  <span>Evidence-Based Innovation</span>
                </div>
              </div>
            </GlowingBox>

            {/* Mission Statement - Now Second, No Box */}
            <div>
              <h3 className="text-3xl tracking-tight uppercase mt-12">Our Mission</h3>
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
            </div>
          </div>
        )}

        {/* Leadership Team */}
        {!isHomepage && <LeadershipTeam />}

        {/* CTA Button for Homepage */}
        {isHomepage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
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
                    to="/about"
                    className="relative block px-8 py-4 bg-white/10 hover:bg-white/[0.15] transition-colors duration-300"
                  >
                    <span className="text-white tracking-widest uppercase text-sm">Learn More About Us</span>
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
