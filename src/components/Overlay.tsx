import React from "react";

interface OverlayProps {
  state: "hidden" | "revealed" | "shrinking";
}

const Overlay: React.FC<OverlayProps> = ({ state }) => {
  const clipPath =
    state === "revealed"
      ? "circle(150% at 50% 50%)"
      : state === "shrinking"
        ? "circle(0% at 50% 50%)"
        : "circle(0% at 50% 50%)";

  const isVisible = state !== "hidden";

  return (
    isVisible && (
      <div
        className={`absolute inset-0 bg-red-500 rounded-[15px] z-50 transition-[clip-path] duration-600 ease-in-out`}
        style={{ clipPath }}
      ></div>
    )
  );
};

export default Overlay;
