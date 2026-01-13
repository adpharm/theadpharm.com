import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowingBoxProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * GlowingBox Component with rotating border glow effect
 *
 * Uses a rotating conic gradient technique for smooth traveling light effect
 */
export function GlowingBox({ children, delay = 0, className = "" }: GlowingBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <div className="relative group">
        {/* Glow layer (blurred) - only visible on hover */}
        <div className="animated-border-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Border animation layer - only visible on hover */}
        <div className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Static border - visible when not hovering */}
        <div className="absolute inset-0 border border-white/10 opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />

        {/* Content wrapper - creates the size, with inner content inset by 1px on all sides */}
        <div className="relative p-px">
          <div className="relative bg-[#121212] p-12 z-10">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
