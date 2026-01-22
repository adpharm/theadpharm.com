import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Data from the chart image
const chartData = [
  {
    name: "Personal / Non-Work Time",
    value: 43.9,
    color: "var(--chart-slate)", // Deep slate gray
  },
  {
    name: "Direct Patient Care",
    value: 33.7,
    color: "var(--chart-red)", // Deep red
  },
  {
    name: "Admin Tasks",
    value: 8.2,
    color: "var(--chart-amber)", // Deep amber
  },
  {
    name: "Cont. Medical Education (CME)",
    value: 5.8,
    color: "var(--chart-purple)", // Deep purple
  },
  {
    name: "Peer Collaboration",
    value: 3.9,
    color: "var(--chart-sky)", // Deep sky blue
  },
  {
    name: "Practice Management",
    value: 2.7,
    color: "var(--chart-emerald)", // Deep emerald
  },
  {
    name: "Prescribing & Treatment",
    value: 1.3,
    color: "var(--chart-pink)", // Deep pink
  },
  {
    name: "Ind. Meetings & Conferences",
    value: 0.5,
    color: "var(--chart-indigo)", // Deep indigo
  },
];

export function PhysicianTimeChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSectionClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const activeData = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div ref={ref} className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="border border-white/10 bg-[var(--bg-base)] p-4 lg:p-8 relative overflow-hidden w-fit"
      >
        {/* Decorative Grid Overlay */}
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 pointer-events-none" /> */}

        <div className="relative z-10 flex flex-col items-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex-grow-1 max-w-sm"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[var(--accent-primary)]" />
              <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">Industry Insight</span>
            </div>
            <h3 className="text-2xl lg:text-3xl tracking-tight uppercase leading-tight text-center w-full">
              A Day in the Life of a <span className="text-white/60">Canadian Physician</span>
            </h3>
          </motion.div>

          {/* Chart Container */}
          <div className="flex flex-col items-center max-w-md">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-2xl"
            >
              <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={200}
                    innerRadius={120}
                    fill="var(--chart-blue)"
                    dataKey="value"
                    animationBegin={600}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={(_, index) => handleSectionClick(index)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                        style={{
                          filter: activeIndex === index ? "brightness(1.3)" : "none",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Circle with Active Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="w-[240px] h-[240px] rounded-full border border-white/10 bg-[var(--bg-darker)] flex items-center justify-center p-8"
                >
                  {activeData ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <div
                        className="w-5 h-5 mx-auto mb-4 border border-white/20"
                        style={{ backgroundColor: activeData.color }}
                      />
                      <div className="text-5xl font-mono text-[var(--accent-primary)] mb-3">{activeData.value}%</div>
                      <div className="text-base text-white/70 leading-tight uppercase tracking-wide">
                        {activeData.name}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <div className="text-sm text-white/40 uppercase tracking-widest mb-2">Time Allocation</div>
                      <div className="text-white/20 text-base">Hover to explore</div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Data Source Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 2 }}
              className="mt-8 w-full text-center"
            >
              <p className="text-xs text-white/30 leading-relaxed">
                Understanding physician time allocation is critical for effective pharmaceutical communications.
                Strategic messaging must respect the constraints of modern medical practice.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
