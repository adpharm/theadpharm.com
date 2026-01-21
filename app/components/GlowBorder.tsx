import type { ReactNode, CSSProperties } from "react";
import { useMobileGlow } from "~/hooks/useMobileGlow";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  /**
   * Optional clip path for non-rectangular shapes.
   * Example: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)"
   */
  clipPath?: string;
  /**
   * Optional clip path for the inner content (usually 2px smaller on notched corner)
   * Example: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)"
   */
  innerClipPath?: string;
  /**
   * Whether to show cursor pointer on the entire container
   * Default: true
   */
  showPointer?: boolean;
  /**
   * Whether to enable mobile glow effect based on viewport visibility
   * Default: true
   */
  enableMobileGlow?: boolean;
}

/**
 * GlowBorder Component
 *
 * Applies a rotating border glow effect that's only visible through a 1px gap around the content.
 * Extracted from the InsightsSection cards for reusability.
 *
 * The glow effect works by:
 * 1. Creating animated border layers (glow + sharp)
 * 2. Adding 1px padding to the content wrapper
 * 3. Filling the content with background color, leaving only the 1px gap visible
 * 
 * On mobile, uses viewport visibility instead of hover (only one element glows at a time)
 */
export function GlowBorder({ 
  children, 
  className = "", 
  clipPath, 
  innerClipPath, 
  showPointer = true,
  enableMobileGlow = true 
}: GlowBorderProps) {
  const { elementRef, isGlowing } = useMobileGlow(enableMobileGlow);
  const borderStyle: CSSProperties = clipPath ? { clipPath } : {};
  const contentStyle: CSSProperties = innerClipPath ? { clipPath: innerClipPath } : {};

  return (
    <div 
      ref={elementRef}
      className={`relative group ${showPointer ? "cursor-pointer" : ""} ${isGlowing ? "mobile-glow-active" : ""} ${className}`}
    >
      {/* Glow layer (blurred) - no clip path, extends beyond */}
      <div className="animated-border-glow absolute -inset-0 opacity-0 group-hover:opacity-60 mobile-glow-active:opacity-60 transition-opacity duration-300" />

      {/* Border animation layer - with optional clip path */}
      <div
        className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 mobile-glow-active:opacity-100 transition-opacity duration-300"
        style={borderStyle}
      />

      {/* Static border - with optional clip path */}
      {clipPath ? (
        // For notched shapes, use individual border segments to properly draw all edges including the diagonal
        <div className="absolute inset-0 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0 transition-all duration-300 pointer-events-none">
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
      ) : (
        // For rectangular shapes, use regular border
        <div className="absolute inset-0 border border-white/10 opacity-100 group-hover:opacity-0 mobile-glow-active:opacity-0 transition-all duration-300 pointer-events-none" />
      )}

      {/* Content wrapper - creates the 1px gap for the glow to show through */}
      <div className="relative h-full" style={{ padding: "1px" }}>
        <div className="relative bg-[var(--bg-base)] overflow-hidden z-10 h-full" style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
