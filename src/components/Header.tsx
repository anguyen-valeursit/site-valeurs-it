import { useState, useEffect } from "react";
import { Menu, X, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SITE_CONTENT } from "../constants";
import { cn } from "../lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Histoire", href: "#histoire" },
    { name: "Bio", href: "#bio" },
    { name: "Services", href: "#services" },
    { name: "Actualités", href: "#actualites" },
    { name: "Livre Blanc", href: "#temoignage" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-primary/95 backdrop-blur-md shadow-lg py-3 text-white" : "bg-primary text-white"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center">
          {SITE_CONTENT.company.logo ? (
            <img 
              src={SITE_CONTENT.company.logo} 
              alt={SITE_CONTENT.company.name} 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="font-serif text-2xl font-bold tracking-tighter">
              {SITE_CONTENT.company.name}
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={SITE_CONTENT.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-primary border-t border-white/10 shadow-xl md:hidden text-white"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-2 border-b border-white/5 last:border-0 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex justify-center pt-4">
                <a
                  href={SITE_CONTENT.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  Suivre sur LinkedIn
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
