
import React from 'react';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import SocialMedia from './SocialMedia';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-gold-light rounded-full"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold">Tiffany Sparkles</h3>
                <p className="text-sm text-primary-foreground/80">by Dinesh Gupta Limited</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 mb-6 leading-relaxed max-w-md">
              Experience the ultimate in cleaning technology with our premium microfiber cloths. 
              Designed for modern lifestyles, crafted with precision, and built to last.
            </p>
            
            <SocialMedia />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('locations')}
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
                    +91 98765 43210
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="text-[#D4AF37] mt-1" size={18} />
                <div>
                  <p className="text-primary-foreground/90 text-sm">Address</p>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    Dinesh Gupta Limited<br />
                    Manufacturing Complex<br />
                    Mumbai, Maharashtra 400001
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
              © 2024 Tiffany Sparkles by Dinesh Gupta Limited. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-[#D4AF37] transition-colors duration-300">
                Quality Guarantee
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-primary-foreground/10">
            <p className="text-primary-foreground/60 text-xs flex items-center justify-center">
              Made with <Heart className="mx-1 text-[#D4AF37]" size={12} /> for a cleaner world
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
