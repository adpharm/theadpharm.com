import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import { MobileMenu } from "./navigation/MobileMenu";
import { ProgressIndicator } from "./navigation/ProgressIndicator";

const sections = [
  { name: "Home", id: "hero" },
  { name: "About", id: "about" },
  { name: "Services", id: "services" },
  { name: "Experience", id: "experience" },
  { name: "Insights", id: "insights" },
  { name: "Contact", id: "contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          isScrolled ? "bg-[var(--bg-base)]/90 backdrop-blur-lg border-white/10" : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white tracking-wider uppercase cursor-pointer flex items-center"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <img src="/images/logo.png" alt="The Adpharm" className="h-4 w-auto" />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  activeSection === index ? "text-[var(--accent-primary)]" : "text-white/60 hover:text-white"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[var(--accent-primary)] transition-colors flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* Side Progress Indicator */}
      <ProgressIndicator sections={sections} activeSection={activeSection} onSectionClick={scrollToSection} />
    </>
  );
}
