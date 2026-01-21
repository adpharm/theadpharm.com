import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { clients } from "~/data/experience";

export function ClientGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showAll, setShowAll] = useState(false);
  
  // On mobile, show only 6 logos initially
  const displayedClients = showAll ? clients : clients.slice(0, 6);
  const hasMore = clients.length > 6;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3 className="text-xl tracking-widest uppercase mb-8 text-white/60">Trusted Partners</h3>

      <div className="border border-white/10 p-6 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {displayedClients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-center p-4 md:p-6 border border-white/5"
            >
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="max-w-full max-h-12 md:max-h-16 w-auto h-auto object-contain opacity-60 filter brightness-0 invert"
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button - Only shown on mobile when there are more clients */}
        {hasMore && (
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-white/60 hover:text-white/90 tracking-widest uppercase transition-colors border border-white/20 hover:border-white/40 px-6 py-2"
            >
              {showAll ? "Show Less" : `View All (${clients.length})`}
            </button>
          </div>
        )}

        {/* Partnership Tier Annotation */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-white/30 tracking-widest uppercase">
            <div className="w-8 h-px bg-white/20" />
            <span>Tier 1 Pharmaceutical Partners</span>
            <div className="w-8 h-px bg-white/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
