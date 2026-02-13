import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { MobileMenu } from "./navigation/MobileMenu";
import { ProgressIndicator } from "./navigation/ProgressIndicator";

// Top-level navigation menu items
const menuItems = [
  { name: "Home", id: "hero", path: "/" },
  { name: "About", id: "about", path: "/about" },
  // { name: "Experience", id: "experience", path: "/#experience" },
  { name: "Services", id: "services", path: "/services" },
  { name: "Insights", id: "insights", path: "/insights" },
  { name: "Contact", id: "contact", path: "/#contact" },
];

// All sections including homepage variants (for progress indicator)
const sections = [
  { name: "Home", id: "hero", path: "/" },
  { name: "Experience", id: "experience", path: "/#experience" },
  { name: "About", id: "about-us", path: "/#about-us" },
  { name: "Services", id: "services", path: "/#services" },
  { name: "Insights", id: "insights", path: "/#insights" },
  { name: "Contact", id: "contact", path: "/#contact" },
  { name: "About", id: "about", path: "/about" },
];

// Map routes to their sections (for progress indicator)
const pageSectionsMap: Record<string, string[]> = {
  "/": ["hero", "experience", "about-us", "services", "insights", "contact"],
  "/home": ["hero", "experience", "about-us", "services", "insights", "contact"],
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
    .filter((section) => pageSectionsMap[location.pathname]?.includes(section.id))
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
    const targetPath = path.split("#")[0];
    const isCurrentPage = targetPath === location.pathname || (targetPath === "/" && isHomePage);
    
    // If clicking on current page route (not a hash link), scroll to top
    if (isCurrentPage && !path.includes("#")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // If we're already on the target page and it's a hash link, scroll to the section
    else if (isCurrentPage && path.includes("#")) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } 
    // Navigate to a different page without hash
    else if (path.startsWith("/") && !path.includes("#")) {
      navigate(path);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } 
    // Navigate to a different page with hash
    else if (path.includes("#")) {
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
          isScrolled ? "bg-[var(--bg-base)]/90 backdrop-blur-lg border-white/10" : "lg:border-transparent border-white/10 bg-[var(--bg-base)]/90 backdrop-blur-lg lg:bg-transparent lg:backdrop-blur-none"
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
            {menuItems.map((item) => {
              // Check if this menu item corresponds to the currently active section
              const isActive =
                location.pathname === item.path ||
                (isHomePage && currentPageSections[activeSection]?.id === item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id, item.path)}
                  className={`text-sm tracking-wider uppercase transition-colors ${
                    isActive ? "text-[var(--accent-primary)]" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
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
        sections={menuItems}
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
