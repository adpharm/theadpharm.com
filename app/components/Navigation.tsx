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

// Map routes to their sections (for progress indicator)
const pageSectionsMap: Record<string, string[]> = {
  "/": ["hero", "experience", "contact"],
  "/home": ["hero", "experience", "contact"],
  "/about": ["about", "contact"],
  "/services": ["services", "contact"],
  "/insights": ["insights", "contact"],
};

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  
  // Filter sections based on current page and update contact path to current page
  const currentPageSections = sections
    .filter((section) =>
      pageSectionsMap[location.pathname]?.includes(section.id)
    )
    .map((section) => {
      // Update contact path to always point to current page's contact section
      if (section.id === "contact") {
        return { ...section, path: `${location.pathname}#contact` };
      }
      return section;
    });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // If near the top, always show first section as active
      if (window.scrollY < 100) {
        setActiveSection(0);
        return;
      }

      // Determine active section based on scroll position (only for sections on current page)
      const scrollPosition = window.scrollY + 200;

      currentPageSections.forEach((section, index) => {
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

    // Set initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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
    // If we're already on the target page, just scroll to the section
    const targetPath = path.split("#")[0];
    if (targetPath === location.pathname || (targetPath === "/" && isHomePage)) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path.startsWith("/") && !path.includes("#")) {
      // Navigate to a different page
      navigate(path);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else if (path.includes("#")) {
      // It's a hash link to a different page
      navigate(path);
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
        sections={currentPageSections}
        activeSection={activeSection}
        onSectionClick={(id, path) => scrollToSection(id, path || `/#${id}`)}
      />
    </>
  );
}
