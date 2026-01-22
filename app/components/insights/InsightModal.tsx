import { motion, AnimatePresence } from "framer-motion";
import type { Insight } from "~/data/insights";

interface InsightModalProps {
  insight: Insight | null;
  index: number | null;
  onClose: () => void;
}

export function InsightModal({ insight, index, onClose }: InsightModalProps) {
  if (!insight || index === null) return null;

  const ModalIcon = insight.icon;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 z-[999] backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          className="fixed inset-8 md:inset-12 lg:inset-16 z-[1000] flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-7xl shadow-2xl shadow-[var(--accent-primary)]/20 max-h-[80vh] overflow-y-auto"
            style={{
              willChange: "transform, opacity",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative bg-[var(--bg-base)] min-h-full"
              style={{
                clipPath: "polygon(0 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%)",
              }}
            >
              {/* Modal border - individual segments to properly show notch border */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top border (stops before notch) */}
                <div
                  className="absolute top-0 left-0 h-px bg-[var(--accent-primary)]/50"
                  style={{ width: "calc(100% - 48px)" }}
                />
                {/* Right border (starts after notch) */}
                <div
                  className="absolute right-0 w-px bg-[var(--accent-primary)]/50"
                  style={{ top: "48px", height: "calc(100% - 48px)" }}
                />
                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent-primary)]/50" />
                {/* Left border */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--accent-primary)]/50" />
                {/* Diagonal notch border - SVG for precise positioning */}
                <svg
                  className="absolute"
                  style={{
                    top: 0,
                    right: 0,
                    width: "48px",
                    height: "48px",
                    overflow: "visible",
                  }}
                >
                  <line x1="0" y1="0" x2="48" y2="48" stroke="rgba(255, 107, 53, 0.5)" strokeWidth="1.5" />
                </svg>
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 flex items-center justify-center transition-colors group"
              >
                <span className="text-4xl text-white/60 group-hover:text-[var(--accent-primary)] transition-colors leading-none">
                  &times;
                </span>
              </button>

              {/* Modal Header */}
              <div
                className={`bg-gradient-to-br ${insight.color} border-b border-white/10 relative p-12 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                {/* Icon */}
                <div className="relative mb-6 z-10">
                  <div className="w-20 h-20 border border-[var(--accent-primary)] bg-[var(--bg-base)]/80 flex items-center justify-center">
                    <ModalIcon className="w-10 h-10 text-[var(--accent-primary)]" />
                  </div>
                </div>

                {/* Card Number - Large and clipped */}
                <div
                  className="absolute -bottom-12 right-12 text-white/10 font-bold leading-none"
                  style={{ fontSize: "20rem" }}
                >
                  0{index + 1}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-12">
                <h2 className="text-4xl lg:text-5xl tracking-tight uppercase leading-tight mb-8">{insight.title}</h2>
                <div className="text-white/70 leading-relaxed text-lg">{insight.fullContent}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
}
