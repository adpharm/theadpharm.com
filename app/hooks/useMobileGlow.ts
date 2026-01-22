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

    // Register this element with the global manager
    const unregister = MobileGlowManager.register(element, setIsGlowing);

    // Set up intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            MobileGlowManager.updateVisibility(element, entry.intersectionRatio);
          } else {
            MobileGlowManager.updateVisibility(element, 0);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: "-10% 0px -10% 0px", // Slightly reduce viewport to prioritize centered elements
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

/**
 * Global singleton manager for mobile glow effects
 * Ensures only one element glows at a time
 */
class MobileGlowManagerClass {
  private elements = new Map<HTMLElement, {
    setIsGlowing: (value: boolean) => void;
    intersectionRatio: number;
  }>();
  private currentGlowingElement: HTMLElement | null = null;

  register(element: HTMLElement, setIsGlowing: (value: boolean) => void) {
    this.elements.set(element, { setIsGlowing, intersectionRatio: 0 });
    
    return () => {
      this.elements.delete(element);
      if (this.currentGlowingElement === element) {
        this.currentGlowingElement = null;
        this.selectNextElement();
      }
    };
  }

  updateVisibility(element: HTMLElement, intersectionRatio: number) {
    const data = this.elements.get(element);
    if (!data) return;

    data.intersectionRatio = intersectionRatio;
    
    // Recalculate which element should glow
    this.selectNextElement();
  }

  private selectNextElement() {
    // Find visible elements (with sufficient intersection ratio)
    const visibleElements: Array<{ element: HTMLElement; data: any; top: number }> = [];

    this.elements.forEach((data, element) => {
      if (data.intersectionRatio >= 0.1) {
        const rect = element.getBoundingClientRect();
        visibleElements.push({
          element,
          data,
          top: rect.top + window.scrollY // Get absolute position
        });
      }
    });

    if (visibleElements.length === 0) {
      // No elements are sufficiently visible
      if (this.currentGlowingElement) {
        const prevData = this.elements.get(this.currentGlowingElement);
        if (prevData) {
          prevData.setIsGlowing(false);
        }
        this.currentGlowingElement = null;
      }
      return;
    }

    // Sort by vertical position (top to bottom)
    visibleElements.sort((a, b) => a.top - b.top);

    // Find the element closest to the center of the viewport
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    let bestElement = visibleElements[0].element;
    let bestDistance = Math.abs(visibleElements[0].top - viewportCenter);

    for (const { element, top } of visibleElements) {
      const distance = Math.abs(top - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestElement = element;
      }
    }

    // Update if the glowing element has changed
    if (bestElement !== this.currentGlowingElement) {
      // Turn off the previous element
      if (this.currentGlowingElement) {
        const prevData = this.elements.get(this.currentGlowingElement);
        if (prevData) {
          prevData.setIsGlowing(false);
        }
      }

      // Turn on the new element
      this.currentGlowingElement = bestElement;
      if (bestElement) {
        const newData = this.elements.get(bestElement);
        if (newData) {
          newData.setIsGlowing(true);
        }
      }
    }
  }
}

// Export singleton instance
export const MobileGlowManager = new MobileGlowManagerClass();
