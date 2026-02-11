import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { MobileMenu } from "./navigation/MobileMenu";
import { ProgressIndicator } from "./navigation/ProgressIndicator";

const sections = [
  { name: "Home", id: "hero", path: "/" },
  { name: "About", id: "about", path: "/about" },
  { name: "Services", id: "services", path: "/services" },
  { name: "Experience", id: "experience", path: "/#experience" },
  { name: "Insights", id: "insights", path: "/insights" },
  { name: "Contact", id: "contact", path: "/#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

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

  useEffect(() => {
    // Handle hash navigation on home page load
    if (isHomePage && location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [isHomePage, location.hash]);

  const scrollToSection = (id: string, path: string) => {
    // Check if it's a direct page route (not a hash)
    if (path.startsWith("/") && !path.includes("#")) {
      // Navigate to the page
      navigate(path);
    } else if (path.includes("#")) {
      // It's a hash link
      const hash = path.split("#")[1];
      if (isHomePage) {
        // On home page: scroll to section
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // On other pages: navigate to home with hash
        navigate(path);
      }
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
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">
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
                onClick={() => scrollToSection(section.id, section.path)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  location.pathname === section.path ||
                  (section.path.includes("#") && isHomePage && activeSection === index)
                    ? "text-[var(--accent-primary)]"
                    : "text-white/60 hover:text-white"
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
        onSectionClick={(id, path) => scrollToSection(id, path || `/#${id}`)}
      />

      {/* Side Progress Indicator */}
      <ProgressIndicator
        sections={sections}
        activeSection={activeSection}
        onSectionClick={(id, path) => scrollToSection(id, path || `/#${id}`)}
      />
    </>
  );
}
