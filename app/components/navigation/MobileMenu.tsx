import { motion } from "framer-motion";

interface Section {
  name: string;
  id: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  sections: Section[];
  activeSection: number;
  onSectionClick: (id: string, path?: string) => void;
}

export function MobileMenu({ isOpen, sections, activeSection, onSectionClick }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : "100%",
      }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 bg-[var(--bg-base)] lg:hidden"
    >
      <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : 50,
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onSectionClick(section.id, section.path)}
            className={`text-3xl tracking-tight uppercase transition-colors ${
              activeSection === index ? "text-[var(--accent-primary)]" : "text-white/60 hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {section.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
