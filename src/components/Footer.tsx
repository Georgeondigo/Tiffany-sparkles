import React from "react";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import SocialMedia from "./SocialMedia";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-14 h-14  rounded-full">
                <img
                  src="/logo4.png"
                  alt="Tiffany Sparkles Logo"
                  className="w-14 h-14 object-contain bg-white/20 rounded-full p-1 shadow"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">
                  TIFFANY
                  <br />
                  SPARKLES
                </h3>
                <div className="h-0.5 bg-secondary mt-1"></div>
              </div>
            </div>

            <p className="text-primary-foreground/90 mb-6 leading-relaxed max-w-md">
              Experience the ultimate in cleaning technology with our premium
              Microfibre cloths. Designed for modern lifestyles, crafted with
              precision, and built to last.
            </p>

            <SocialMedia />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("locations")}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  Store Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-[#D4AF37]" size={18} />
                <div>
                  <p className="text-primary-foreground/90 text-sm">Email</p>
                  <a
                    href="mailto:info@tiffanysparkles.com"
                    className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    info@tiffanysparkles.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-[#D4AF37]" size={18} />
                <div>
                  <p className="text-primary-foreground/90 text-sm">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    +254 718 151 622 || +447933901040
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="text-[#D4AF37] mt-1" size={18} />
                <div>
                  <p className="text-primary-foreground/90 text-sm">Address</p>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    Dinesh Gupta LTD
                    <br />
                    P.O. Box 19365-40123
                    <br />
                    <br />
                    Kisumu, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-primary-foreground/80 text-sm">
              © 2025 Tiffany Sparkles. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-primary-foreground/80 hover:text-secondary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
              >
                Quality Guarantee
              </a>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-primary-foreground/10">
            <a
              href="https://geowebsolutions.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-xs flex items-center justify-center hover:underline"
            >
              <span className="bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                Built by GeoWebSolutions
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
