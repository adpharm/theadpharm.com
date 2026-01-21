import { motion } from "framer-motion";

interface OrbitingDot {
  color: string;
  angle: number;
}

interface Circle {
  radius: number;
  dots: OrbitingDot[];
  clockwise: boolean;
  strokeColor?: string;
  top: string;
  left: string;
}

export function HeroCircles() {
  // Define the circles with their properties based on the screenshot
  const circles: Circle[] = [
    {
      radius: 200,
      dots: [
        { color: "Orange-400", angle: 0 },
        { color: "Orange-400", angle: 180 },
      ],
      clockwise: true,
      strokeColor: "Orange-400",
      top: "20%",
      left: "20%",
    },
    {
      radius: 280,
      dots: [{ color: "gray", angle: 45 }],
      clockwise: false,
      top: "20%",
      left: "20%",
    },
    {
      radius: 350,
      dots: [{ color: "Orange-400", angle: 90 }],
      clockwise: false,
      top: "35%",
      left: "50%",
    },
  ];

  return (
    <div className="relative w-full h-full">
      {circles.map((circle, circleIndex) => (
        <div
          key={circleIndex}
          className="absolute"
          style={{
            top: circle.top,
            left: circle.left,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Circle outline */}
          <svg
            width={circle.radius * 2}
            height={circle.radius * 2}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <circle
              cx={circle.radius}
              cy={circle.radius}
              r={circle.radius - 1}
              fill="none"
              stroke={circle.strokeColor ? `oklch(var(--color-${circle.strokeColor}))` : "rgba(255, 255, 255, 0.1)"}
              strokeWidth="1"
            />
          </svg>

          {/* Orbiting dots */}
          {circle.dots.map((dot, dotIndex) => {
            const duration = 15 + circleIndex * 3; // Vary speed per circle

            return (
              <motion.div
                key={dotIndex}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: "12px",
                  height: "12px",
                }}
                animate={{
                  rotate: circle.clockwise ? 360 : -360,
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (dot.angle / 360) * duration,
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor:
                      dot.color === "gray" ? "rgba(255, 255, 255, 0.4)" : `oklch(var(--color-${dot.color}))`,
                    top: `${-circle.radius}px`,
                    left: "-6px",
                    boxShadow: dot.color !== "gray" ? `0 0 20px oklch(var(--color-${dot.color}))` : "none",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
