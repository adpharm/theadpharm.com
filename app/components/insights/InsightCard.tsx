import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Insight } from "~/data/insights";
import { useMobileGlow } from "~/hooks/useMobileGlow";

interface InsightCardProps {
  insight: Insight;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  variants?: any;
  enableMobileGlow?: boolean;
}

export function InsightCard({
  insight,
  index,
  isActive = false,
  onClick,
  style,
  variants,
  enableMobileGlow = true,
}: InsightCardProps) {
  const Icon = insight.icon;
  const { elementRef, isGlowing } = useMobileGlow(enableMobileGlow);

  return (
    <motion.div
      className={`${onClick ? "cursor-pointer" : ""} h-[420px] md:h-auto`}
      onClick={onClick}
      style={style}
      variants={variants}
      animate="animate"
    >
      <div ref={elementRef} className={`relative group h-full ${isGlowing ? "mobile-glow-active" : ""}`}>
        {/* Glow layer (blurred) - no clip path, extends beyond */}
        <div className="animated-border-glow absolute -inset-0 opacity-0 group-hover:opacity-60 mobile-glow-active:opacity-60 transition-opacity duration-300" />

        {/* Border animation layer - clipped to notched shape */}
        <div
          className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 mobile-glow-active:opacity-100 transition-opacity duration-300"
          style={{
            clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
          }}
        />

        {/* Static border - individual segments to properly show notch border */}
        <div
          className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
            isActive
              ? "shadow-2xl shadow-[var(--accent-primary)]/10 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0"
              : "opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0"
          }`}
        >
          {/* Top border (stops before notch) */}
          <div className="absolute top-0 left-0 h-px bg-white/10" style={{ width: "calc(100% - 24px)" }} />
          {/* Right border (starts after notch) */}
          <div className="absolute right-0 w-px bg-white/10" style={{ top: "24px", height: "calc(100% - 24px)" }} />
          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          {/* Left border */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
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
            <line x1="0" y1="0" x2="24" y2="24" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Content wrapper - inset by 3px to let glow show through */}
        <div className="relative h-full" style={{ padding: "1px" }}>
          <div
            className="relative bg-[var(--bg-base)] overflow-hidden z-10 h-full flex flex-col"
            style={{
              clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
            }}
          >
            {/* Card Header/Visual */}
            <div
              className={`
                h-32 bg-gradient-to-br ${insight.color} border-b border-white/10 relative flex-shrink-0
                ${isActive ? "" : "opacity-70"}
              `}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

              {/* Icon */}
              <div className="absolute top-6 left-6">
                <div
                  className={`
                    w-16 h-16 border flex items-center justify-center
                    ${isActive ? "border-[var(--accent-primary)] bg-[var(--bg-base)]/80" : "border-white/20 bg-[var(--bg-base)]/60"}
                  `}
                >
                  <Icon className="w-7 h-7 transition-colors text-[var(--accent-primary)]" />
                </div>
              </div>

              {/* Decorative element instead of number */}
              <div className="absolute bottom-4 right-6">
                <div className="flex gap-1 items-end">
                  <div className="w-1 h-8 bg-[var(--accent-primary)]/20" />
                  <div className="w-1 h-12 bg-[var(--accent-primary)]/30" />
                  <div className="w-1 h-6 bg-[var(--accent-primary)]/20" />
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 flex-1 flex flex-col overflow-hidden">
              <h3
                className={`
                  text-2xl lg:text-3xl tracking-tight uppercase leading-tight mb-4 flex-shrink-0
                  transition-colors duration-300
                  ${isActive ? "text-white" : "text-white/70"}
                `}
              >
                {insight.title}
              </h3>
              <p
                className={`
                  leading-relaxed text-lg
                  transition-colors duration-300
                  line-clamp-4 md:line-clamp-none
                  ${isActive ? "text-white/70" : "text-white/50"}
                `}
              >
                {insight.description}
              </p>

              {/* Chevron indicator */}
              {onClick && (
                <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-white/40 group-hover:text-[var(--accent-primary)] mobile-glow-active:text-[var(--accent-primary)] transition-colors duration-300">
                  <span className="tracking-wider uppercase">Learn More</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 mobile-glow-active:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
