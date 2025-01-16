import React, { useEffect, useRef } from "react";

const Snowfall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function createSnowParticle(): HTMLDivElement {
      const wrapper = document.createElement("div");
      wrapper.classList.add(
        "absolute",
        "top-0",
        "left-0",
        "pointer-events-none",
      );

      const particle = document.createElement("div");
      particle.classList.add(
        "pointer-events-none",
        "select-none",
        "-translate-y-40",
        "opacity-90",
      );

      // Customize the snow particle (small white circle)
      const size = random(4, 8);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.backgroundColor = "white";

      const duration = random(10, 40);
      const swayDuration = random(3, 5);
      const delay = random(0, 20);
      const left = random(0, 100);

      wrapper.style.left = `${left}%`;
      wrapper.style.animation = `fall ${duration}s linear ${delay}s infinite`;
      particle.style.animation = `sway ${swayDuration}s ease-in-out ${delay}s infinite`;

      wrapper.appendChild(particle);
      return wrapper;
    }

    function generateSnowParticles(count: number) {
      for (let i = 0; i < count; i++) {
        containerRef.current!.appendChild(createSnowParticle());
      }
    }

    generateSnowParticles(120);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-40 overflow-hidden animate-fall animate-sway"
    />
  );
};

export default Snowfall;
