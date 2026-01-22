import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ContactInfo } from "./contact/ContactInfo";
import { SocialLinks } from "./contact/SocialLinks";
import { ContactForm } from "./contact/ContactForm";
import { Footer } from "./Footer";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-12 lg:py-32 bg-[var(--bg-darker)]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:space-y-12 order-1 lg:order-none"
          >
            <div>
              <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">Contact</span>
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

            <ContactInfo />

            <div className="lg:block hidden">
              <SocialLinks />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:pl-12 order-2 lg:order-none"
          >
            <ContactForm />
          </motion.div>

          {/* Social Links - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:hidden order-3"
          >
            <SocialLinks />
          </motion.div>
        </div>

        <Footer />
      </div>
    </section>
  );
}
