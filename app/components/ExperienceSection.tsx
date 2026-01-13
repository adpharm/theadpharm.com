import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const therapeuticAreas = [
  {
    name: "Hematology",
    description:
      "Deep expertise in blood disorders, from rare diseases to common conditions. Strategic campaigns for novel therapeutics and diagnostic innovations.",
    stats: { campaigns: "25+", years: "15" },
  },
  {
    name: "Oncology",
    description:
      "Pioneering communications in cancer care. From immunotherapy breakthroughs to precision medicine, we tell stories that matter.",
    stats: { campaigns: "40+", years: "18" },
  },
  {
    name: "Dermatology",
    description:
      "Transforming conversations around skin health. Clinical excellence meets patient-centered narratives in every campaign.",
    stats: { campaigns: "30+", years: "12" },
  },
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
  const [expandedArea, setExpandedArea] = useState<number | null>(null);

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

        {/* Therapeutic Areas - Dashboard Feel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-xl tracking-widest uppercase mb-8 text-white/60">Therapeutic Areas</h3>

          <div className="grid gap-0 border border-white/10">
            {therapeuticAreas.map((area, index) => (
              <div
                key={index}
                className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedArea(expandedArea === index ? null : index)}
                  className="w-full p-8 flex items-start gap-6 text-left group"
                >
                  <div className="flex-shrink-0 w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[#FF6B35] transition-colors">
                    {expandedArea === index ? (
                      <Minus className="w-5 h-5 text-[#FF6B35]" />
                    ) : (
                      <Plus className="w-5 h-5 text-white/40 group-hover:text-[#FF6B35] transition-colors" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-2xl uppercase tracking-tight group-hover:text-[#FF6B35] transition-colors">
                        {area.name}
                      </h4>
                      <div className="flex gap-8 text-sm text-white/40">
                        <div>
                          <div className="text-white">{area.stats.campaigns}</div>
                          <div className="text-xs">Campaigns</div>
                        </div>
                        <div>
                          <div className="text-white">{area.stats.years}</div>
                          <div className="text-xs">Years</div>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedArea === index ? "auto" : 0,
                        opacity: expandedArea === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/60 mt-4 leading-relaxed max-w-3xl">{area.description}</p>
                    </motion.div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Client Logo Soup - High-end Monochrome */}
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
          </div>

          {/* Partnership Tier Annotation */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-white/30 tracking-widest uppercase">
              <div className="w-8 h-px bg-white/20" />
              <span>Tier 1 Pharmaceutical Partners</span>
              <div className="w-8 h-px bg-white/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
