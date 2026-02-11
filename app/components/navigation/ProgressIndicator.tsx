import { motion } from "framer-motion";

interface Section {
  name: string;
  id: string;
  path: string;
}

interface ProgressIndicatorProps {
  sections: Section[];
  activeSection: number;
  onSectionClick: (id: string, path?: string) => void;
}

export function ProgressIndicator({ sections, activeSection, onSectionClick }: ProgressIndicatorProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => onSectionClick(section.id, section.path)}
            whileHover={{ scale: 1.5 }}
            className="relative group"
          >
            <div
              className={`w-2 h-2 transition-all duration-300 ${
                activeSection === index ? "bg-[var(--accent-primary)] scale-150" : "bg-white/20 hover:bg-white/40"
              }`}
            />

            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-white text-[var(--bg-base)] px-3 py-1 text-xs tracking-wider uppercase whitespace-nowrap">
                {section.name}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
