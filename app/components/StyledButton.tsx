import { motion } from "framer-motion";
import type { Icon } from "lucide-react";

interface StyledButtonProps {
  children: React.ReactNode;
  icon?: Icon;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function StyledButton({ children, icon: Icon, onClick, type = "button", className = "" }: StyledButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ x: 10 }}
      className={`group flex items-center gap-3 text-white border border-white/20 px-8 py-4 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all duration-300 ${className}`}
    >
      <span className="tracking-widest uppercase text-sm">{children}</span>
      {Icon && <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
    </motion.button>
  );
}
