import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { insights } from "~/data/insights";
import { InsightCard } from "./insights/InsightCard";
import { InsightModal } from "./insights/InsightModal";
import { InsightsNavigation } from "./insights/InsightsNavigation";

export function InsightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [activeCard, setActiveCard] = useState(0);
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalCard, setModalCard] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const prevActiveCard = useRef(activeCard);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | "auto">("auto");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const ANIMATION_DURATION = 1000;
  const Z_INDEX_CHANGE_DELAY = 300; // 30% of animation

  const nextCard = () => {
    if (isAnimating) return; // Prevent clicking during animation
    prevActiveCard.current = activeCard;
    setAnimatingCard(activeCard);
    setIsAnimating(true);
    setActiveCard((prev) => (prev + 1) % insights.length);
  };

  const prevCard = () => {
    if (isAnimating) return; // Prevent clicking during animation
    prevActiveCard.current = activeCard;
    setAnimatingCard(activeCard);
    setIsAnimating(true);
    setActiveCard((prev) => (prev - 1 + insights.length) % insights.length);
  };

  const goToCard = (idx: number) => {
    if (isAnimating || idx === activeCard) return; // Prevent clicking during animation or same card
    prevActiveCard.current = activeCard;
    setAnimatingCard(activeCard);
    setIsAnimating(true);
    setActiveCard(idx);
  };

  const openModal = (idx: number) => {
    setModalCard(idx);
  };

  const closeModal = () => {
    setModalCard(null);
  };

  // Auto-play functionality - cycles cards every 6 seconds unless hovering/animating/modal open/grid view
  useEffect(() => {
    // Don't auto-play if hovering, animating, modal is open, or in grid view
    if (isHovering || isAnimating || modalCard !== null || isGridView) {
      return;
    }

    const timer = setInterval(() => {
      prevActiveCard.current = activeCard;
      setAnimatingCard(activeCard);
      setIsAnimating(true);
      setActiveCard((prev) => (prev + 1) % insights.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeCard, isHovering, isAnimating, modalCard, isGridView]);

  // Handle view toggle with height preservation
  const handleToggleView = () => {
    // Capture current height before transition
    if (containerRef.current) {
      const currentHeight = containerRef.current.offsetHeight;
      setContainerHeight(currentHeight);
      setIsTransitioning(true);

      // If switching from grid to stack view, scroll to insights section like the nav does
      if (isGridView) {
        const insightsElement = document.getElementById("insights");
        if (insightsElement) {
          insightsElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsGridView((prev) => !prev);
  };

  // Change z-index after card moves away
  const [zIndexChanged, setZIndexChanged] = useState(false);

  useEffect(() => {
    if (animatingCard !== null) {
      // Change z-index after card moves away
      const zIndexTimeout = setTimeout(() => {
        setZIndexChanged(true);
      }, Z_INDEX_CHANGE_DELAY);

      // Clear animation state after complete
      const completeTimeout = setTimeout(() => {
        setAnimatingCard(null);
        setZIndexChanged(false);
        setIsAnimating(false);
      }, ANIMATION_DURATION);

      return () => {
        clearTimeout(zIndexTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [animatingCard]);

  // Animation variants
  const getAnimationVariants = (index: number, offset: number, topOffset: number, stackPosition: number) => {
    const isActive = index === activeCard;
    // Check if this card was just the active card (was at position 0, now moving back)
    const justDeactivated = prevActiveCard.current === index && !isActive;

    // Calculate previous position for the deactivated card
    const prevStackPosition = (index - prevActiveCard.current + insights.length) % insights.length;
    const prevVisualPosition = insights.length - 1 - prevStackPosition;
    const prevOffset = prevVisualPosition * 8; // Reduced from 16
    const prevTopOffset = prevVisualPosition * 16; // Reduced from 32

    return {
      animate: justDeactivated
        ? {
            // Keyframe animation:
            // 0-30%: Move LEFT away from stack (far enough to clear the full card width)
            // 30-70%: Stay LEFT while z-index changes and cards shift
            // 70-100%: Move RIGHT to final back position
            x: [prevOffset, prevOffset - 1200, prevOffset - 1200, offset],
            y: [prevTopOffset, prevTopOffset, topOffset, topOffset],
            opacity: [1, 0.9, 0.7, Math.max(0.5, 1 - stackPosition * 0.15)],
            scale: [1, 0.95, 0.92, 1],
            transition: {
              duration: 1.0,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut" as const,
            },
          }
        : {
            // Normal smooth transition for other cards
            x: offset,
            y: topOffset,
            opacity: stackPosition === 0 ? 1 : Math.max(0.5, 1 - stackPosition * 0.15),
            scale: 1,
            transition: {
              duration: 1.0,
              ease: "easeInOut" as const,
            },
          },
    };
  };

  return (
    <section ref={ref} className="relative py-12 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">Insights & Solutions</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Our
            <br />
            <span className="text-white/40">Philosophy</span>
          </h2>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="relative overflow-visible"
          animate={{
            minHeight: typeof containerHeight === "number" ? containerHeight : isGridView ? "auto" : 500,
            marginBottom: isGridView ? 48 : 24, // Less gap in stack view
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              // After exit completes, wait for new content to render, then measure and transition to new height
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (containerRef.current) {
                    const newHeight = containerRef.current.scrollHeight;
                    setContainerHeight(newHeight);
                    // After reaching new height, reset to auto
                    setTimeout(() => {
                      setContainerHeight("auto");
                      setIsTransitioning(false);
                    }, 500);
                  }
                });
              });
            }}
          >
            {!isGridView ? (
              <motion.div
                key="stacked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full pr-8 sm:pr-12 md:pr-0"
                style={{ perspective: "1500px", perspectiveOrigin: "center center", minHeight: "500px" }}
              >
                {insights.map((insight, index) => {
                  const isActive = index === activeCard;

                  // Calculate position in stack: active card is at position 0 (front/bottom-right)
                  // Cards cycle through positions as activeCard changes
                  const stackPosition = (index - activeCard + insights.length) % insights.length;

                  // Calculate visual offset based on stack position
                  // Position 0 = bottom-right (smallest offset)
                  // Position 3 = top-left (largest offset)
                  const visualPosition = insights.length - 1 - stackPosition;
                  // Responsive offsets: smaller on mobile, larger on desktop
                  const offset = visualPosition * 8; // Reduced from 16
                  const topOffset = visualPosition * 16; // Reduced from 32

                  // Active card (stackPosition 0) should always be on top
                  // If a card is animating but z-index hasn't changed yet, keep it on top
                  const isAnimating = index === animatingCard;
                  const shouldBeOnTop = isAnimating && !zIndexChanged;
                  const zIndex = shouldBeOnTop ? insights.length + 1 : insights.length - stackPosition;
                  return (
                    <InsightCard
                      key={index}
                      insight={insight}
                      index={index}
                      isActive={isActive}
                      onClick={() => openModal(index)}
                      style={
                        {
                          "--stack-position": stackPosition,
                          "--z-index": zIndex,
                          zIndex: zIndex,
                          transformStyle: "preserve-3d",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "calc(100% - 24px)", // Prevent overflow on mobile
                          maxWidth: "100%",
                        } as React.CSSProperties
                      }
                      variants={getAnimationVariants(index, offset, topOffset, stackPosition)}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:grid md:grid-cols-2 gap-6"
              >
                {insights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    insight={insight}
                    index={index}
                    isActive={true}
                    onClick={() => openModal(index)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Controls */}
        <InsightsNavigation
          activeCard={activeCard}
          totalCards={insights.length}
          isGridView={isGridView}
          isAnimating={isAnimating}
          onPrevCard={prevCard}
          onNextCard={nextCard}
          onGoToCard={goToCard}
          onToggleView={handleToggleView}
        />

        {/* Card Modal */}
        <AnimatePresence>
          {modalCard !== null && <InsightModal insight={insights[modalCard]} index={modalCard} onClose={closeModal} />}
        </AnimatePresence>

        {/* Pull Quote / Editorial Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="relative border-l-4 border-[var(--accent-primary)] pl-12 py-8">
            <div className="absolute -left-4 top-0 w-8 h-8 border border-[var(--accent-primary)]" />
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
