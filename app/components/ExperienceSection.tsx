import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Spacer } from "./misc/spacer";

const therapeuticAreas = [
  "Hematology",
  "Dermatology",
  "Neurology",
  "Oncology",
  "Rare Disease",
  "And More",
];

const clients = [
  { name: "AbbVie", logo: "/images/client-logos/abbvie_blue.webp" },
  { name: "Advanz Pharma", logo: "/images/client-logos/advanz_pharma_dark2.webp" },
  { name: "Apotex", logo: "/images/client-logos/apotex.webp" },
  { name: "Axsome", logo: "/images/client-logos/axsome.webp" },
  { name: "Daiichi Sankyo", logo: "/images/client-logos/daiichi.png" },
  { name: "Gilead", logo: "/images/client-logos/gilead.png" },
  { name: "GSK", logo: "/images/client-logos/gsk.png" },
  { name: "Johnson & Johnson", logo: "/images/client-logos/j_and_j_dark.webp" },
  { name: "Kenvue", logo: "/images/client-logos/kenvue.webp" },
  { name: "Mirum", logo: "/images/client-logos/mirum_dark.webp" },
  { name: "MT Pharma", logo: "/images/client-logos/mt_pharma_dark.webp" },
  { name: "Novo Nordisk", logo: "/images/client-logos/novo.png" },
  { name: "Sobi", logo: "/images/client-logos/sobi_dark.webp" },
  { name: "Sun Pharma", logo: "/images/client-logos/sun_pharma_white.webp" },
  { name: "Taiho", logo: "/images/client-logos/taiho.webp" },
];

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-32 border-b border-white/10 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#FF6B35] tracking-[0.3em] uppercase text-xs">Our Experience</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Proven
            <br />
            <span className="text-white/40">Excellence</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl tracking-widest uppercase mb-8 text-white/60">Trusted Partners</h3>

          <div className="border border-white/10 p-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {clients.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-center p-6 border border-white/5 hover:border-[#FF6B35]/30 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-w-full max-h-16 w-auto h-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity filter brightness-0 invert"
                  />
                </motion.div>
              ))}
            </div>

                      {/* Partnership Tier Annotation */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-white/30 tracking-widest uppercase">
              <div className="w-8 h-px bg-white/20" />
              <span>Tier 1 Pharmaceutical Partners</span>
              <div className="w-8 h-px bg-white/20" />
            </div>
          </div>
          </div>

        </motion.div>

        <Spacer size="lg" />

        {/* Therapeutic Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-xl tracking-widest uppercase mb-8 text-white/60">Therapeutic Areas</h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapeuticAreas.map((area, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3 text-lg uppercase tracking-wide"
                >
                  <span className="text-orange-400 bg-orange-400 w-1.5 h-1.5"></span>
                  <span className="text-white/80 font-display text-3xl">{area}</span>
                </motion.li>
              ))}
            </ul>
        </motion.div>

        {/* Client Logo Soup - High-end Monochrome */}
        
      </div>
    </section>
  );
}
