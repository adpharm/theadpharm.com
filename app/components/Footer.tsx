import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-12 lg:mt-32 pt-12 border-t border-white/10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-white/40">
        <div>© 2026 The Adpharm. All rights reserved.</div>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link to="/accessibility" className="hover:text-white transition-colors">
            Accessibility
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
