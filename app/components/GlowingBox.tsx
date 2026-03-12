import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { useMobileGlow } from "~/hooks/useMobileGlow";

interface GlowingBoxProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  enableMobileGlow?: boolean;
  notched?: boolean;
  contentPadding?: string;
}

/**
 * GlowingBox Component with rotating border glow effect
 *
 * Uses a rotating conic gradient technique for smooth traveling light effect
 * On mobile, uses viewport visibility instead of hover (only one element glows at a time)
 */
export function GlowingBox({
  children,
  delay = 0,
  className = "",
  enableMobileGlow = true,
  notched = false,
  contentPadding = "p-6 md:p-8 lg:p-12",
}: GlowingBoxProps) {
  const { elementRef, isGlowing } = useMobileGlow(enableMobileGlow);

  // Clip paths for notched corner (top-right corner)
  const outerClipPath = notched ? "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" : undefined;
  const innerClipPath = notched ? "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)" : undefined;

  const borderStyle: CSSProperties = outerClipPath ? { clipPath: outerClipPath } : {};
  const contentStyle: CSSProperties = innerClipPath ? { clipPath: innerClipPath } : {};

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
        <div
          className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 mobile-glow-active:opacity-100 transition-opacity duration-500"
          style={borderStyle}
        />

        {/* Static border - visible when not hovering and not mobile glowing */}
        {notched ? (
          // For notched shapes, use individual border segments to properly draw all edges including the diagonal
          <div className="absolute inset-0 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0 transition-opacity duration-500 pointer-events-none">
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
              className="absolute z-20"
              style={{
                top: 0,
                right: 0,
                width: "24px",
                height: "24px",
                overflow: "visible",
              }}
            >
              <line x1="0" y1="0" x2="24" y2="24" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            </svg>
          </div>
        ) : (
          // For rectangular shapes, use regular border
          <div className="absolute inset-0 border border-white/10 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0 transition-opacity duration-500 pointer-events-none" />
        )}

        {/* Content wrapper - creates the size, with inner content inset by 1px on all sides */}
        <div className="relative p-px">
          <div className={`relative bg-[var(--bg-base)] ${contentPadding} z-10`} style={contentStyle}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
