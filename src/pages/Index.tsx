
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductHighlights from '../components/ProductHighlights';
import MarketingSlider from '../components/MarketingSlider';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import LocationsMap from '../components/LocationsMap';
import ContactSection from '../components/ContactSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <ProductHighlights />
        <MarketingSlider />
        <LocationsMap />
        <About />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <ContactSection />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
