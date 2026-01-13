import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { name: "Home", id: "hero" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Experience", id: "experience" },
    { name: "Insights", id: "insights" },
    { name: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 200;
      const windowHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "bg-[#121212]/90 backdrop-blur-lg border-white/10" : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-white tracking-wider uppercase cursor-pointer"
            style={{ fontFamily: "var(--font-headline)" }}
            onClick={() => scrollToSection("hero")}
          >
            <img src="/images/logo.png" alt="The Adpharm" className="h-4 w-auto" />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  activeSection === index ? "text-[#FF6B35]" : "text-white/60 hover:text-white"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[#FF6B35] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : "100%",
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-[#121212] lg:hidden"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                x: isMobileMenuOpen ? 0 : 50,
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => scrollToSection(section.id)}
              className={`text-3xl tracking-tight uppercase transition-colors ${
                activeSection === index ? "text-[#FF6B35]" : "text-white/60 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {section.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Side Progress Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              whileHover={{ scale: 1.5 }}
              className="relative group"
            >
              <div
                className={`w-2 h-2 transition-all duration-300 ${
                  activeSection === index ? "bg-[#FF6B35] scale-150" : "bg-white/20 hover:bg-white/40"
                }`}
              />

              {/* Tooltip */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white text-[#121212] px-3 py-1 text-xs tracking-wider uppercase whitespace-nowrap">
                  {section.name}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
