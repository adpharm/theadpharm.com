import { useEffect, useRef, useState } from "react";

/**
 * Hook to manage mobile glow effect for a single element
 * Only one element can glow at a time across the entire app
 *
 * @param enabled - Whether this element should participate in mobile glow
 * @returns isGlowing - Whether this specific element should currently glow
 */
export function useMobileGlow(enabled: boolean = true) {
  const [isGlowing, setIsGlowing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const element = elementRef.current;
    if (!element) return;

    const unregister = MobileGlowManager.register(element, setIsGlowing);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          MobileGlowManager.updateVisibility(
            element,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: "-5% 0px -5% 0px",
      }
    );

    observerRef.current.observe(element);

    return () => {
      unregister();
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [enabled]);

  return { elementRef, isGlowing };
}

const ROW_THRESHOLD = 30;

class MobileGlowManagerClass {
  private elements = new Map<
    HTMLElement,
    {
      setIsGlowing: (value: boolean) => void;
      intersectionRatio: number;
    }
  >();
  private currentGlowingElement: HTMLElement | null = null;
  private scrollRAF: number | null = null;
  private scrollListenerActive = false;

  register(element: HTMLElement, setIsGlowing: (value: boolean) => void) {
    this.elements.set(element, { setIsGlowing, intersectionRatio: 0 });
    this.ensureScrollListener();

    return () => {
      this.elements.delete(element);
      if (this.currentGlowingElement === element) {
        this.currentGlowingElement = null;
        this.selectNextElement();
      }
      if (this.elements.size === 0) this.removeScrollListener();
    };
  }

  updateVisibility(element: HTMLElement, intersectionRatio: number) {
    const data = this.elements.get(element);
    if (!data) return;

    data.intersectionRatio = intersectionRatio;
    this.selectNextElement();
  }

  private ensureScrollListener() {
    if (this.scrollListenerActive || typeof window === "undefined") return;
    this.scrollListenerActive = true;
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  private removeScrollListener() {
    if (!this.scrollListenerActive) return;
    this.scrollListenerActive = false;
    window.removeEventListener("scroll", this.handleScroll);
    if (this.scrollRAF !== null) {
      cancelAnimationFrame(this.scrollRAF);
      this.scrollRAF = null;
    }
  }

  private handleScroll = () => {
    if (this.scrollRAF !== null) return;
    this.scrollRAF = requestAnimationFrame(() => {
      this.scrollRAF = null;
      this.selectNextElement();
    });
  };

  private selectNextElement() {
    const visibleElements: Array<{
      element: HTMLElement;
      centerY: number;
      centerX: number;
    }> = [];

    this.elements.forEach((data, element) => {
      if (data.intersectionRatio >= 0.1) {
        const rect = element.getBoundingClientRect();
        visibleElements.push({
          element,
          centerY: rect.top + rect.height / 2,
          centerX: rect.left + rect.width / 2,
        });
      }
    });

    if (visibleElements.length === 0) {
      if (this.currentGlowingElement) {
        const prevData = this.elements.get(this.currentGlowingElement);
        if (prevData) prevData.setIsGlowing(false);
        this.currentGlowingElement = null;
      }
      return;
    }

    // Document order: top-to-bottom, left-to-right within the same row
    visibleElements.sort((a, b) => {
      const dy = a.centerY - b.centerY;
      if (Math.abs(dy) > ROW_THRESHOLD) return dy;
      return a.centerX - b.centerX;
    });

    const triggerY = window.innerHeight * 0.5;

    // Last element in document order whose center has crossed the trigger line
    let bestElement: HTMLElement | null = null;
    for (const { element, centerY } of visibleElements) {
      if (centerY <= triggerY) {
        bestElement = element;
      }
    }

    // Nothing above trigger yet — pick the visible element closest to the trigger
    if (!bestElement) {
      let closestDistance = Infinity;
      for (const { element, centerY } of visibleElements) {
        const distance = centerY - triggerY;
        if (distance < closestDistance) {
          closestDistance = distance;
          bestElement = element;
        }
      }
    }

    if (bestElement && bestElement !== this.currentGlowingElement) {
      if (this.currentGlowingElement) {
        const prevData = this.elements.get(this.currentGlowingElement);
        if (prevData) prevData.setIsGlowing(false);
      }

      this.currentGlowingElement = bestElement;
      const newData = this.elements.get(bestElement);
      if (newData) newData.setIsGlowing(true);
    }
  }
}

export const MobileGlowManager = new MobileGlowManagerClass();
