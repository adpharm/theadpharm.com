import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Insight } from "~/data/insights";

interface InsightModalProps {
  insight: Insight | null;
  index: number | null;
  onClose: () => void;
}

export function InsightModal({ insight, index, onClose }: InsightModalProps) {
  if (!insight || index === null) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 flex items-center justify-center"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-7xl shadow-2xl shadow-[var(--accent-primary)]/20 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto"
          style={{
            willChange: "transform, opacity",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative bg-[var(--bg-base)] min-h-full"
            style={{
              clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
            }}
          >
            {/* Modal border - individual segments to properly show notch border */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top border (stops before notch) */}
              <div
                className="absolute top-0 left-0 h-px bg-[var(--accent-primary)]/50"
                style={{ width: "calc(100% - 24px)" }}
              />
              {/* Right border (starts after notch) */}
              <div
                className="absolute right-0 w-px bg-[var(--accent-primary)]/50"
                style={{ top: "24px", height: "calc(100% - 24px)" }}
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
                  width: "24px",
                  height: "24px",
                  overflow: "visible",
                }}
              >
                <line x1="0" y1="0" x2="24" y2="24" stroke="rgba(255, 107, 53, 0.5)" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 flex items-center justify-center transition-colors group"
            >
              <span className="text-3xl sm:text-4xl text-white/60 group-hover:text-[var(--accent-primary)] transition-colors leading-none">
                &times;
              </span>
            </button>

            {/* Modal Header */}
            <div
              className={`bg-gradient-to-br ${insight.color} border-b border-white/10 relative p-6 sm:p-8 md:p-12 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

              {/* Icon */}
              <div className="relative mb-4 sm:mb-6 z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 border border-[var(--accent-primary)] bg-[var(--bg-base)]/80 flex items-center justify-center">
                  {insight.icon && (
                    <insight.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[var(--accent-primary)]" />
                  )}
                </div>
              </div>

              {/* Decorative element instead of number */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12">
                <div className="flex gap-2 items-end">
                  <div className="w-2 h-12 sm:h-16 md:h-20 bg-[var(--accent-primary)]/20" />
                  <div className="w-2 h-16 sm:h-20 md:h-24 bg-[var(--accent-primary)]/30" />
                  <div className="w-2 h-10 sm:h-12 md:h-16 bg-[var(--accent-primary)]/20" />
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase leading-tight mb-4 sm:mb-6 md:mb-8">
                {insight.title}
              </h2>
              <div className="text-white/70 leading-relaxed text-base sm:text-lg">{insight.fullContent}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );

  return createPortal(modalContent, document.body);
}
