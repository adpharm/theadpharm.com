import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Strategy",
    description:
      "Comprehensive market analysis, brand positioning, and campaign architecture designed to penetrate target audiences with surgical precision.",
    details: [
      "Franchise and portfolio planning",
      "Insight generation and creative strategy",
      "Media strategy",
      "Launch, sales and workshop meetings",
      "KOL and stakeholder identification",
    ],
  },
  {
    number: "02",
    title: "Creative",
    description:
      "From concept to execution, we craft compelling narratives and visual experiences that resonate across all audiences and channels.",
    details: [
      "HCP, Patient, and Consumer Content Development",
      "Regulatory-Compliant Creative (PAAB & ASC Expertise)",
      "Sales Enablement Tools and Marketing Collateral",
      "Booth and Exhibit Design",
      "Corporate Communications and Messaging",
      "Logo and Visual Identity Development",
      "Brand Guidelines and Style Guide Creation",
      "Commercial Print Services (Conference, Sales and Marketing Materials)",
    ],
  },
  {
    number: "03",
    title: "Technical Capabilities",
    description:
      "Cutting-edge digital experiences that merge technological innovation with human-centered design principles.",
    details: [
      "Website and App Design and Development (Full Stack)",
      "Customer Experience (CX), UX, and UI Design and Optimization",
      "CRM Journey Mapping and Development",
      "Email Campaign Design and Deployment",
      "Advanced Analytics and Performance Reporting",
      "AI Tool Design and Development",
      "Personalization & Targeting",
    ],
  },
  {
    number: "04",
    title: "Medical Communications",
    description:
      "Translating complex science into compelling narratives that resonate with healthcare professionals and drive meaningful engagement.",
    details: [
      "Advisory Boards and Consultancy Meetings",
      "Speaker Training and Development Programs",
      "Online Learning Activities (OLAs) and Accredited Continuing Medical Education (CME)",
      "Symposia, Manuscripts, and Medical Slide Deck Development",
      "Ambassador Programs, Stakeholder Mapping, and Asynchronous Engagements",
    ],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#FF6B35] tracking-[0.3em] uppercase text-xs">What We Do</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Our Core
            <br />
            <span className="text-white/40">Capabilities</span>
          </h2>
        </motion.div>

        {/* Interactive Cards / Manifest */}
        <div className="space-y-0 border-t border-white/10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-white/10"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full text-left py-8 px-6 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-8">
                  <span className="text-[#FF6B35] text-lg tracking-wider font-mono">{service.number}</span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl lg:text-3xl tracking-tight uppercase group-hover:text-[#FF6B35] transition-colors">
                        {service.title}
                      </h3>
                      <ChevronRight
                        className={`w-6 h-6 text-white/40 transition-all duration-300 ${
                          expandedIndex === index ? "rotate-90 text-[#FF6B35]" : "group-hover:text-white"
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
                  height: expandedIndex === index ? "auto" : 0,
                  opacity: expandedIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-8 pl-[5.5rem]">
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[#FF6B35]/20">
                    {service.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-3 text-sm text-white/70">
                        <div className="w-1 h-1 bg-[#FF6B35] mt-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
