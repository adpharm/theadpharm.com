export function BackgroundGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 0,
      }}
      aria-hidden="true"
    >
      {/* Generate grid cells with varying sizes */}
      {Array.from({ length: 30 }).map((_, index) => {
        // Create irregular sizes with larger spans for less busy look
        const rowSpan = [2, 3, 4, 3, 5, 2, 4, 3, 2, 3][index % 10];
        const colSpan = [2, 3, 2, 4, 3, 2, 3, 2, 4, 2][index % 10];

        return (
          <div
            key={index}
            style={{
              gridColumn: `span ${colSpan}`,
              gridRow: `span ${rowSpan}`,
              border: "1px solid rgba(255, 255, 255, 0.02)",
              minHeight: "150px",
            }}
          />
        );
      })}
    </div>
  );
}
