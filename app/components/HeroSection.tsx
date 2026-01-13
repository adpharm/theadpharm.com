import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-white/10">
      {/* Background geometric elements */}

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-orange-400 tracking-[0.3em] uppercase text-xs"
              >
                The Adpharm
              </motion.div>
              <h1 className="text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] uppercase font-semibold">
                A Full Service
                <br />
                <span className="text-white/40">
                  Agency
                  <br />
                  In The
                </span>
                <br />
                Truest Sense.
              </h1>
            </div>

            <div className="border-l-2 border-[#FF6B35] pl-6 py-2">
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Proven Canadian partner, 20+ years in pharma, with integrated creative + medical expertise.
              </p>
            </div>

            <motion.button
              whileHover={{ x: 10 }}
              className="group flex items-center gap-3 text-white border border-white/20 px-8 py-4 hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-all duration-300"
            >
              <span className="tracking-widest uppercase text-sm">Discover More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right: Abstract 3D element placeholder */}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-16 bg-gradient-to-b from-[#FF6B35] to-transparent"
        />
      </motion.div>

      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] border border-white/5 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] border border-white/10 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />

        {/* Grid lines */}
        {/* <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full grid grid-cols-12 gap-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white" />
            ))}
          </div>
        </div> */}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute inset-0 h-[500px] hidden lg:block"
      >
        <div className="absolute right-[20%] -bottom-[40%] flex items-center justify-center">
          {/* Multiple rotating circles */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-80 h-80 border border-white/10 rounded-full relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF6B35] rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/20 rounded-full" />
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-60 h-60 border border-[#FF6B35]/30 rounded-full"
          >
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-[#FF6B35] rounded-full" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-[#FF6B35] rounded-full" />
          </motion.div>

          <div className="absolute w-40 h-40 bg-gradient-to-br from-[#FF6B35]/10 to-transparent rounded-full blur-xl" />
        </div>
      </motion.div>
    </section>
  );
}
