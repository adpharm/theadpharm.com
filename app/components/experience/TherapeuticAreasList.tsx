import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { therapeuticAreas } from "~/data/experience";

export function TherapeuticAreasList() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
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
  );
}
