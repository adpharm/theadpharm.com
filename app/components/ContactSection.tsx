import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-24">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div>
              <span className="text-[#FF6B35] tracking-[0.3em] uppercase text-xs">Contact</span>
              <div className="h-px w-32 bg-white/20 mt-4 mb-8" />
              <h2 className="text-5xl lg:text-6xl tracking-tight uppercase">
                Let's
                <br />
                <span className="text-white/40">Connect</span>
              </h2>
            </div>

            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Ready to elevate your pharmaceutical communications? Let's discuss how we can bring precision, creativity,
              and impact to your next campaign.
            </p>

            <div className="space-y-6">
              <motion.a
                href="mailto:hello@theadpharm.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-white hover:text-[#FF6B35] transition-colors group"
              >
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[#FF6B35] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/40 tracking-wider uppercase">Email</div>
                  <div className="text-lg">digital@theadpharm.com</div>
                </div>
              </motion.a>

              <motion.a
                href="tel:+14165551234"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-white hover:text-[#FF6B35] transition-colors group"
              >
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[#FF6B35] transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/40 tracking-wider uppercase">Phone</div>
                  <div className="text-lg">+1 (905) 901-1062</div>
                </div>
              </motion.a>

              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4 text-white group">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[#FF6B35] transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/40 tracking-wider uppercase">Location</div>
                  <div className="text-lg">Oakville, Ontario, Canada</div>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/10">
              <div className="text-xs text-white/40 tracking-wider uppercase mb-4">Follow Us</div>
              <div className="flex gap-4">
                <motion.a
                  href="https://ca.linkedin.com/company/the-adpharm"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Large Logo / Brand Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Stylized Logo */}
              <div className="text-center space-y-4">
                <div className="text-8xl tracking-tighter uppercase leading-none text-white/10 select-none">
                  THE
                  <br />
                  ADPHARM
                </div>
                <div className="w-full h-px bg-[#FF6B35]" />
                <div className="text-sm tracking-[0.3em] uppercase text-white/30">Pharmaceutical Agency</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 pt-12 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-white/40">
            <div>© 2026 The Adpharm. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
