import { ChevronLeft, ChevronRight } from "lucide-react";

interface InsightsNavigationProps {
  activeCard: number;
  totalCards: number;
  isGridView: boolean;
  isAnimating: boolean;
  onPrevCard: () => void;
  onNextCard: () => void;
  onGoToCard: (index: number) => void;
  onToggleView: () => void;
}

export function InsightsNavigation({
  activeCard,
  totalCards,
  isGridView,
  isAnimating,
  onPrevCard,
  onNextCard,
  onGoToCard,
  onToggleView,
}: InsightsNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {!isGridView && (
        <>
          <button
            onClick={onPrevCard}
            disabled={isAnimating}
            className={`w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group ${
              isAnimating ? "opacity-50 cursor-not-allowed" : "hover:border-[var(--accent-primary)]"
            }`}
          >
            <ChevronLeft
              className={`w-6 h-6 transition-colors ${
                isAnimating ? "text-white/30" : "text-white/60 group-hover:text-[var(--accent-primary)]"
              }`}
            />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalCards }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onGoToCard(idx)}
                disabled={isAnimating}
                className={`h-2 transition-all duration-300 ${
                  idx === activeCard ? "w-8 bg-[var(--accent-primary)]" : "w-2 bg-white/20"
                } ${!isAnimating && idx !== activeCard ? "hover:bg-white/40" : ""} ${
                  isAnimating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNextCard}
            disabled={isAnimating}
            className={`w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group ${
              isAnimating ? "opacity-50 cursor-not-allowed" : "hover:border-[var(--accent-primary)]"
            }`}
          >
            <ChevronRight
              className={`w-6 h-6 transition-colors ${
                isAnimating ? "text-white/30" : "text-white/60 group-hover:text-[var(--accent-primary)]"
              }`}
            />
          </button>

          <div className="w-px h-8 bg-white/20 mx-2" />
        </>
      )}

      <button
        onClick={onToggleView}
        className="px-6 h-12 border border-white/20 flex items-center justify-center gap-2 transition-colors group hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5"
      >
        <span className="text-sm tracking-widest uppercase text-white/60 group-hover:text-[var(--accent-primary)] transition-colors">
          {isGridView ? "Stack view" : "View all"}
        </span>
      </button>
    </div>
  );
}
