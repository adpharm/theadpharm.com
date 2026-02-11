export function BackgroundGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {/* Simple continuous grid lines - clean, no interference */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}
