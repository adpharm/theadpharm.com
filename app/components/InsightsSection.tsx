import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Users, Lightbulb, Target } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "More than just numbers",
    description:
      "Data tells a story, but insight reveals the narrative. We transform analytics into actionable intelligence, connecting dots others don't see.",
  },
  {
    icon: Users,
    title: "Physicians are people too",
    description:
      "Beyond the white coat lies human complexity. Our communications honor medical expertise while acknowledging the person behind the practice.",
  },
  {
    icon: Lightbulb,
    title: "Innovative copywriting: Beyond the straight line",
    description:
      "Scientific accuracy doesn't demand creative sterility. We craft messages that are both medically rigorous and emotionally resonant.",
  },
  {
    icon: Target,
    title: "Strategic targeting",
    description:
      "Precision matters. Every message, perfectly calibrated for its audience. Every touchpoint, intentionally designed. No wasted effort.",
  },
];

export function InsightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#FF6B35] tracking-[0.3em] uppercase text-xs">Insights & Solutions</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Our
            <br />
            <span className="text-white/40">Philosophy</span>
          </h2>
        </motion.div>

        {/* Magazine-style Asymmetrical Layout */}
        <div className="space-y-0">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`
                  grid lg:grid-cols-12 gap-8 py-16 border-b border-white/10 last:border-b-0
                  ${isEven ? "" : "lg:text-right"}
                `}
              >
                {/* Icon Column */}
                <div
                  className={`
                  lg:col-span-2 flex items-start
                  ${isEven ? "justify-start" : "lg:justify-end lg:order-2"}
                `}
                >
                  <div className="w-16 h-16 border border-white/20 flex items-center justify-center group hover:border-[#FF6B35] transition-all duration-300">
                    <Icon className="w-7 h-7 text-white/40 group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                </div>

                {/* Content Column */}
                <div
                  className={`
                  lg:col-span-7 space-y-4
                  ${isEven ? "" : "lg:order-1"}
                `}
                >
                  <h3 className="text-3xl tracking-tight uppercase leading-tight">{insight.title}</h3>
                  <p className="text-white/60 leading-relaxed text-lg">{insight.description}</p>
                </div>

                {/* Spacer Column */}
                <div
                  className={`
                  hidden lg:block lg:col-span-3
                  ${isEven ? "" : "lg:order-3"}
                `}
                >
                  {/* Empty space for asymmetry */}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pull Quote / Editorial Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="relative border-l-4 border-[#FF6B35] pl-12 py-8">
            <div className="absolute -left-4 top-0 w-8 h-8 border border-[#FF6B35]" />
            <blockquote className="text-2xl lg:text-3xl tracking-tight leading-relaxed text-white/80">
              "We don't just communicate science—we architect experiences that transform understanding into action,
              skepticism into confidence, and information into impact."
            </blockquote>
            <cite className="block mt-6 text-sm text-white/40 tracking-widest uppercase not-italic">
              The Adpharm Manifesto
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
