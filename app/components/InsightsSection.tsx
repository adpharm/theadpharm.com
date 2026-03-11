import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { insights } from "~/data/insights";
import { InsightCard } from "./insights/InsightCard";
import { InsightModal } from "./insights/InsightModal";
import { InsightsNavigation } from "./insights/InsightsNavigation";

interface InsightsSectionProps {
  isHomepage?: boolean;
}

export function InsightsSection({ isHomepage = false }: InsightsSectionProps) {
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
            Intelligence that
            <br />
            <span className="text-white/40">drives Engagement</span>
          </h2>
        </motion.div>

        {/* Insights Content - Homepage shows cards, Full page shows newsletter */}
        {isHomepage ? (
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="border border-white/10 p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-orange-400/20 to-transparent border border-orange-400/30">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-xl tracking-tight text-white uppercase">{insight.title}</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed">{insight.description}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <>
            {/* Intro Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mb-20"
            >
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Meaningful engagement begins with deep insight. Our approach combines rigorous data analysis, behavioral
                science, and creative strategy to uncover what truly resonates with healthcare professionals and
                patients alike.
                <br />
                <br />
                This is where we unpack the evidence-based thinking that powers our work. From precision-targeted
                messaging to omnichannel orchestration, explore the exact methodologies we use to transform complex
                pharmaceutical communications into measurable outcomes.
              </p>
            </motion.div>

            {/* Newsletter Signup Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="border border-white/10 bg-white/5 p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Left: Heading and Description */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-3xl lg:text-4xl tracking-tight uppercase mb-6">
                      Stay <span className="text-orange-400">Informed</span>
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      Join our network of healthcare marketers. Get actionable insights rooted in behavioural science,
                      deep-dive case studies, and proven campaign strategies delivered directly to your inbox.
                    </p>
                  </div>

                  {/* Right: Form */}
                  <div>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm text-white/40 mb-2 uppercase tracking-wider"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm text-white/40 mb-2 uppercase tracking-wider"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm text-white/40 mb-2 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                          placeholder="john@company.com"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-orange-400 hover:bg-orange-500 text-black font-medium py-4 px-8 uppercase tracking-wider transition-colors duration-300"
                      >
                        Subscribe to Newsletter
                      </button>

                      <p className="text-xs text-white/30 text-center mt-4">
                        By subscribing, you agree to receive marketing communications. You can unsubscribe at any time.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Commented out cards section - will be replaced with newsletter form
        {!isHomepage && (
          <motion.div
            ref={containerRef}
            className="relative overflow-visible"
            animate={{
              minHeight: typeof containerHeight === "number" ? containerHeight : isGridView ? "auto" : 500,
              marginBottom: isGridView ? 48 : 24,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (containerRef.current) {
                    const newHeight = containerRef.current.scrollHeight;
                    setContainerHeight(newHeight);
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
                  const stackPosition = (index - activeCard + insights.length) % insights.length;
                  const visualPosition = insights.length - 1 - stackPosition;
                  const offset = visualPosition * 8;
                  const topOffset = visualPosition * 16;
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
                          width: "calc(100% - 24px)",
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
        )}

        {!isHomepage && (
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
        )}
        */}

        {/* CTA Button for Homepage */}
        {isHomepage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative mobile-glow-active">
              {/* Glow layer (blurred) - always visible */}
              <div className="animated-border-glow absolute inset-0 opacity-100" />

              {/* Border animation layer - always visible */}
              <div className="animated-border absolute inset-0 opacity-100" />

              {/* Content wrapper */}
              <div className="relative p-px">
                <div className="relative bg-[var(--bg-base)] z-10">
                  <Link
                    to="/insights"
                    className="relative block px-8 py-4 bg-white/10 hover:bg-white/[0.15] transition-colors duration-300"
                  >
                    <span className="text-white tracking-widest uppercase text-sm">Access Our Insights</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card Modal - Commented out with cards
        {!isHomepage && (
          <AnimatePresence>
            {modalCard !== null && <InsightModal insight={insights[modalCard]} index={modalCard} onClose={closeModal} />}
          </AnimatePresence>
        )}
        */}
      </div>
    </section>
  );
}
