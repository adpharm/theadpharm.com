import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StyledButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export function StyledButton({
  children,
  icon: IconComponent,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: StyledButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { x: 10 }}
      className={`group flex items-center gap-3 text-white border border-white/20 px-8 py-4 hover:border-[var(--accent-primary)] bg-white/10 hover:bg-[var(--accent-primary)]/10 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="tracking-widest uppercase text-sm">{children}</span>
      {IconComponent && <IconComponent className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
    </motion.button>
  );
}
