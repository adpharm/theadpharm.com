import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TrendingUp, Users, Lightbulb, Target, ArrowRight, Icon, ChevronLeft, ChevronRight } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "More than just numbers",
    color: "from-[#FF6B35]/20 to-transparent",
    description:
      "Data tells a story, but insight reveals the narrative. We transform analytics into actionable intelligence, connecting dots others don't see.",
  },
  {
    icon: Users,
    title: "Physicians are people too",
    color: "from-[#FF6B35]/20 to-transparent",
    description:
      "Beyond the white coat lies human complexity. Our communications honor medical expertise while acknowledging the person behind the practice.",
  },
  {
    icon: Lightbulb,
    title: "Innovative copywriting: Beyond the straight line",
    color: "from-[#FF6B35]/20 to-transparent",
    description:
      "Scientific accuracy doesn't demand creative sterility. We craft messages that are both medically rigorous and emotionally resonant.",
  },
  {
    icon: Target,
    title: "Strategic targeting",
    color: "from-[#FF6B35]/20 to-transparent",
    description:
      "Precision matters. Every message, perfectly calibrated for its audience. Every touchpoint, intentionally designed. No wasted effort.",
  },
];

export function InsightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [activeCard, setActiveCard] = useState(0);
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalCard, setModalCard] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const prevActiveCard = useRef(activeCard);

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

  // Auto-play functionality - cycles cards every 6 seconds unless hovering/animating/modal open
  useEffect(() => {
    // Don't auto-play if hovering, animating, or modal is open
    if (isHovering || isAnimating || modalCard !== null) {
      return;
    }

    const timer = setInterval(() => {
      prevActiveCard.current = activeCard;
      setAnimatingCard(activeCard);
      setIsAnimating(true);
      setActiveCard((prev) => (prev + 1) % insights.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeCard, isHovering, isAnimating, modalCard]);

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
    const prevOffset = prevVisualPosition * 16;
    const prevTopOffset = prevVisualPosition * 32;

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
    <section ref={ref} className="relative py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#FF6B35] tracking-[0.3em] uppercase text-xs">Insights & Solutions</span>
          <div className="h-px w-32 bg-white/20 mt-4" />
          <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8">
            Our
            <br />
            <span className="text-white/40">Philosophy</span>
          </h2>
        </motion.div>

        {/* Magazine-style Asymmetrical Layout */}
        {/* <div className="space-y-0">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`
                  grid lg:grid-cols-12 gap-8 py-16 border-b border-white/10 last:border-b-0
                  ${isEven ? "" : "lg:text-right"}
                `}
              >
                <div
                  className={`
                  lg:col-span-2 flex items-start
                  ${isEven ? "justify-start" : "lg:justify-end lg:order-2"}
                `}
                >
                  <div className="w-16 h-16 border border-white/20 flex items-center justify-center group hover:border-[#FF6B35] transition-all duration-300">
                    <Icon className="w-7 h-7 text-white/40 group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                </div>

                <div
                  className={`
                  lg:col-span-7 space-y-4
                  ${isEven ? "" : "lg:order-1"}
                `}
                >
                  <h3 className="text-3xl tracking-tight uppercase leading-tight">{insight.title}</h3>
                  <p className="text-white/60 leading-relaxed text-lg">{insight.description}</p>
                </div>

                <div
                  className={`
                  hidden lg:block lg:col-span-3
                  ${isEven ? "" : "lg:order-3"}
                `}
                >
                </div>
              </motion.div>
            );
          })}
        </div> */}

        <div
          className="relative min-h-[500px] overflow-visible"
          style={{ perspective: "1500px", perspectiveOrigin: "center center" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
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
            const offset = visualPosition * 16;
            const topOffset = visualPosition * 32;

            // Active card (stackPosition 0) should always be on top
            // If a card is animating but z-index hasn't changed yet, keep it on top
            const isAnimating = index === animatingCard;
            const shouldBeOnTop = isAnimating && !zIndexChanged;
            const zIndex = shouldBeOnTop ? insights.length + 1 : insights.length - stackPosition;
            return (
              // <div
              //   className="w-full flex flex-col justify-center items-center absolute"
              //   key={index}
              //   style={{
              //     clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
              //     top: `${topOffset}px`,
              //     left: `${offset}px`,
              //     right: `${offset}px`,
              //     zIndex: index,
              //   }}
              // >
              //   <div
              //     className={`
              //         h-32 bg-gradient-to-br ${insight.color} border-b border-white/10 relative
              //         ${isActive ? "" : "opacity-70"}
              //       `}
              //   >
              //     <div className="w-12 h-12 border flex items-center justify-center border-[#FF6B35]">
              //       <insight.icon className="w-7 h-7 transition-colors text-[#FF6B35]" />
              //     </div>
              //   </div>

              //   <div className="bg-black/90 p-6">
              //     <h3 className="text-3xl tracking-tight uppercase leading-tight">{insight.title}</h3>
              //     <p className="text-white/60 leading-relaxed text-lg">{insight.description}</p>
              //   </div>
              // </div>

              <motion.div
                key={index}
                className="absolute top-0 left-0 w-full cursor-pointer"
                variants={getAnimationVariants(index, offset, topOffset, stackPosition)}
                animate="animate"
                style={
                  {
                    "--stack-position": stackPosition,
                    "--z-index": zIndex,
                    zIndex: zIndex,
                    transformStyle: "preserve-3d",
                  } as React.CSSProperties
                }
                onClick={() => openModal(index)}
              >
                <div className="relative group">
                  {/* Glow layer (blurred) - no clip path, extends beyond */}
                  <div className="animated-border-glow absolute -inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Border animation layer - clipped to notched shape */}
                  <div
                    className="animated-border absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Static border - clipped to notched shape */}
                  <div
                    className={`absolute inset-0 border transition-all duration-300 pointer-events-none ${
                      isActive
                        ? "border-white/10 shadow-2xl shadow-[#FF6B35]/10 opacity-100 group-hover:opacity-0"
                        : "border-white/10 opacity-100 group-hover:opacity-0"
                    }`}
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Content wrapper - inset by 3px to let glow show through */}
                  <div className="relative" style={{ padding: "1px" }}>
                    <div
                      className="relative bg-[#121212] overflow-hidden z-10"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
                      }}
                    >
                      {/* Card Header/Visual */}
                      <div
                        className={`
                          h-32 bg-gradient-to-br ${insight.color} border-b border-white/10 relative
                          ${isActive ? "" : "opacity-70"}
                        `}
                      >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                        {/* Icon */}
                        <div className="absolute top-6 left-6">
                          <div
                            className={`
                          w-16 h-16 border flex items-center justify-center
                          ${isActive ? "border-[#FF6B35] bg-[#121212]/80" : "border-white/20 bg-[#121212]/60"}
                        `}
                          >
                            <insight.icon className="w-7 h-7 transition-colors text-[#FF6B35]" />
                          </div>
                        </div>

                        {/* Card Number */}
                        <div className="absolute bottom-4 right-6 text-white/20 text-6xl font-bold">0{index + 1}</div>
                      </div>

                      {/* Card Content */}
                      <div className="p-8">
                        <h3
                          className={`
                        text-2xl lg:text-3xl tracking-tight uppercase leading-tight mb-4
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
                        ${isActive ? "text-white/70" : "text-white/50"}
                      `}
                        >
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevCard}
            disabled={isAnimating}
            className={`w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group ${
              isAnimating ? "opacity-50 cursor-not-allowed" : "hover:border-[#FF6B35]"
            }`}
          >
            <ChevronLeft
              className={`w-6 h-6 transition-colors ${
                isAnimating ? "text-white/30" : "text-white/60 group-hover:text-[#FF6B35]"
              }`}
            />
          </button>

          <div className="flex gap-2">
            {insights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToCard(idx)}
                disabled={isAnimating}
                className={`h-2 transition-all duration-300 ${
                  idx === activeCard ? "w-8 bg-[#FF6B35]" : "w-2 bg-white/20"
                } ${!isAnimating && idx !== activeCard ? "hover:bg-white/40" : ""} ${
                  isAnimating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextCard}
            disabled={isAnimating}
            className={`w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group ${
              isAnimating ? "opacity-50 cursor-not-allowed" : "hover:border-[#FF6B35]"
            }`}
          >
            <ChevronRight
              className={`w-6 h-6 transition-colors ${
                isAnimating ? "text-white/30" : "text-white/60 group-hover:text-[#FF6B35]"
              }`}
            />
          </button>
        </div>

        {/* Card Modal */}
        <AnimatePresence>
          {modalCard !== null &&
            (() => {
              const modalInsight = insights[modalCard];
              const ModalIcon = modalInsight.icon;

              return (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/90 z-[100] backdrop-blur-sm"
                    onClick={closeModal}
                  />

                  {/* Modal Content */}
                  <div
                    className="fixed inset-8 md:inset-16 lg:inset-24 z-[101] flex items-center justify-center"
                    onClick={closeModal}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="relative w-full max-w-4xl bg-[#121212] border border-[#FF6B35]/50 shadow-2xl shadow-[#FF6B35]/20 max-h-full overflow-hidden"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%)",
                        willChange: "transform, opacity",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close Button */}
                      <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 z-10 flex items-center justify-center transition-colors group"
                      >
                        <span className="text-4xl text-white/60 group-hover:text-[#FF6B35] transition-colors leading-none">
                          &times;
                        </span>
                      </button>

                      {/* Modal Header */}
                      <div
                        className={`bg-gradient-to-br ${modalInsight.color} border-b border-white/10 relative p-12 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                        {/* Icon */}
                        <div className="relative mb-6 z-10">
                          <div className="w-20 h-20 border border-[#FF6B35] bg-[#121212]/80 flex items-center justify-center">
                            <ModalIcon className="w-10 h-10 text-[#FF6B35]" />
                          </div>
                        </div>

                        {/* Card Number - Large and clipped */}
                        <div
                          className="absolute -bottom-12 right-12 text-white/10 font-bold leading-none"
                          style={{ fontSize: "20rem" }}
                        >
                          0{modalCard + 1}
                        </div>
                      </div>

                      {/* Modal Body */}
                      <div className="p-12 max-h-[60vh] overflow-y-auto">
                        <h2 className="text-4xl lg:text-5xl tracking-tight uppercase leading-tight mb-6">
                          {modalInsight.title}
                        </h2>
                        <p className="text-white/70 leading-relaxed text-xl">{modalInsight.description}</p>

                        {/* Additional content could go here */}
                        <div className="mt-12 pt-12 border-t border-white/10">
                          <p className="text-white/50 leading-relaxed">
                            This insight represents a core pillar of our approach to pharmaceutical marketing and
                            healthcare communication. Our methodology combines deep industry expertise with innovative
                            thinking to deliver measurable results.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              );
            })()}
        </AnimatePresence>

        {/* Pull Quote / Editorial Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="relative border-l-4 border-[#FF6B35] pl-12 py-8">
            <div className="absolute -left-4 top-0 w-8 h-8 border border-[#FF6B35]" />
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
