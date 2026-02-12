import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <motion.a
        href="mailto:digital@theadpharm.com"
        whileHover={{ x: 5 }}
        className="flex items-center gap-4 text-white hover:text-[var(--accent-primary)] transition-colors group"
      >
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-white/40 tracking-wider uppercase">Email</div>
          <div className="text-lg">digital@theadpharm.com</div>
        </div>
      </motion.a>

      <motion.a
        href="tel:+19059011062"
        whileHover={{ x: 5 }}
        className="flex items-center gap-4 text-white hover:text-[var(--accent-primary)] transition-colors group"
      >
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-white/40 tracking-wider uppercase">Phone</div>
          <div className="text-lg">+1 (905) 901-1062</div>
        </div>
      </motion.a>

      <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4 text-white group">
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-white/40 tracking-wider uppercase">Location</div>
          <div className="text-lg">133 Thomas St, Oakville Ontario, L6J 3A9</div>
        </div>
      </motion.div>
    </div>
  );
}
