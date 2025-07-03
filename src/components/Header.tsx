
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer bg-white/15 rounded-md "
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }}
          >
            <img
              src="/logo4.png"
              alt="Tiffany Sparkles Logo"
              className="w-14 h-14 object-contain"
            />
            <div className="h-0.5 bg-primary mt-1"></div>
            <div>
              <h1 className="text-x font-display text-primary font-semibold">
                Tiffany
                <br />
                Sparkles
              </h1>
              <div className="h-0.5 bg-primary mt-1"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-[#D4AF37] transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-foreground hover:text-[#D4AF37] transition-colors duration-300"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-[#D4AF37] transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("locations")}
              className="text-foreground hover:text-[#D4AF37] transition-colors duration-300"
            >
              Locations
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-background/95 backdrop-blur-md rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-left text-foreground hover:text-[#D4AF37] transition-colors duration-300"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="text-left text-foreground hover:text-[#D4AF37] transition-colors duration-300"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-foreground hover:text-[#D4AF37] transition-colors duration-300"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("locations")}
                className="text-left text-foreground hover:text-[#D4AF37] transition-colors duration-300"
              >
                Locations
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300 w-fit"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
