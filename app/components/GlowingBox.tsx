import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMobileGlow } from "~/hooks/useMobileGlow";

interface GlowingBoxProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  enableMobileGlow?: boolean;
}

/**
 * GlowingBox Component with rotating border glow effect
 *
 * Uses a rotating conic gradient technique for smooth traveling light effect
 * On mobile, uses viewport visibility instead of hover (only one element glows at a time)
 */
export function GlowingBox({ children, delay = 0, className = "", enableMobileGlow = true }: GlowingBoxProps) {
  const { elementRef, isGlowing } = useMobileGlow(enableMobileGlow);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <div ref={elementRef} className={`relative group ${isGlowing ? "mobile-glow-active" : ""}`}>
        {/* Glow layer (blurred) - visible on hover or mobile glow */}
        <div className="animated-border-glow absolute inset-0 opacity-0 group-hover:opacity-100 mobile-glow-active:opacity-100 transition-opacity duration-500" />

        {/* Border animation layer - visible on hover or mobile glow */}
        <div className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 mobile-glow-active:opacity-100 transition-opacity duration-500" />

        {/* Static border - visible when not hovering and not mobile glowing */}
        <div className="absolute inset-0 border border-white/10 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0 transition-opacity duration-500 pointer-events-none" />

        {/* Content wrapper - creates the size, with inner content inset by 1px on all sides */}
        <div className="relative p-px">
          <div className="relative bg-[var(--bg-base)] p-12 z-10">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
