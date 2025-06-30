import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContactSettings {
  whatsapp_number?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const ContactSection = () => {
  const [contactInfo, setContactInfo] = useState<ContactSettings>({
    whatsapp_number: '+919876543210',
    instagram_url: 'https://instagram.com/tiffanysparkles',
    facebook_url: 'https://facebook.com/tiffanysparkles',
    tiktok_url: 'https://tiktok.com/@tiffanysparkles',
    email: 'info@tiffanysparkles.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, India'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      // Keep fallback content if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = (number?: string) => {
    if (!number) return '#';
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="text-muted-foreground">Loading contact information...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Get in Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow us on our socials and join our clean club for more tips and
            tricks!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Phone */}
          {contactInfo.phone && (
            <div className="bg-muted/30 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Call Us
              </h3>
              <p className="text-muted-foreground mb-4">Mon-Fri 9AM-6PM</p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-[#D4AF37] font-medium hover:underline"
              >
                {contactInfo.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {contactInfo.email && (
            <div className="bg-muted/30 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Email Us
              </h3>
              <p className="text-muted-foreground mb-4">
                Quick response guaranteed
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-[#D4AF37] font-medium hover:underline"
              >
                {contactInfo.email}
              </a>
            </div>
          )}

          {/* WhatsApp */}
          {contactInfo.whatsapp_number && (
            <div className="bg-muted/30 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                WhatsApp
              </h3>
              <p className="text-muted-foreground mb-4">
                Chat with us instantly
              </p>
              <a
                href={getWhatsAppLink(contactInfo.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] font-medium hover:underline"
              >
                Message us on WhatsApp
              </a>
            </div>
          )}

          {/* Social Media */}
          <div className="bg-muted/30 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="text-[#D4AF37]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Follow Us
            </h3>
            <p className="text-muted-foreground mb-4">Stay updated</p>
            <div className="flex justify-center space-x-3">
              {contactInfo.instagram_url && (
                <a
                  href={contactInfo.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {contactInfo.facebook_url && (
                <a
                  href={contactInfo.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {contactInfo.tiktok_url && (
                <a
                  href={contactInfo.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-900 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
