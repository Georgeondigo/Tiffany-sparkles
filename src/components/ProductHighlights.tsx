
import React, { useEffect, useState } from 'react';
import { Sparkles, Shield, Zap, Award } from 'lucide-react';

const ProductHighlights = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('products');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Sparkles className="text-[#D4AF37]" size={32} />,
      title: "Superior Cleaning Power",
      description: "Advanced microfiber technology that captures dirt and dust with unmatched efficiency, leaving surfaces spotless and streak-free."
    },
    {
      icon: <Shield className="text-[#D4AF37]" size={32} />,
      title: "Durable & Long-lasting",
      description: "Premium quality construction ensures our cloths maintain their effectiveness through hundreds of washes, providing exceptional value."
    },
    {
      icon: <Zap className="text-[#D4AF37]" size={32} />,
      title: "Quick-Dry Technology",
      description: "Innovative fiber weave allows for rapid drying, preventing odors and maintaining hygiene between uses."
    },
    {
      icon: <Award className="text-[#D4AF37]" size={32} />,
      title: "Multi-Surface Safe",
      description: "Gentle yet effective on all surfaces - from delicate screens to kitchen counters, without scratching or damage."
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Why Choose <span className="text-[#D4AF37]">Tiffany Sparkles</span>?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tiffany Sparkles is proud to be the exclusive distributor of the
            latest Edgeless Microfibre cloth technology in East Africa.
          </p>
        </div>

        {/* Product Image */}
        <div
          className={`mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto relative">
            <img
              src="/image 24.png"
              alt="Tiffany Sparkles microfiber cloths in elegant packaging"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-0 left-0 right-0  backdrop-blur-sm p-2 rounded-b-2xl">
              <h3 className="text-2xl font-serif font-semibold text-background mb-2">
                Premium Microfiber Collection
              </h3>
              <p className="text-background/90">
                Available in multiple sizes and colors to suit every cleaning
                need
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:transform hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Product Specifications */}
        <div
          className={`mt-16 bg-background rounded-2xl p-8 shadow-lg transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-2xl font-serif font-semibold text-primary mb-6 text-center">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">300+</div>
              <div className="text-primary font-medium">GSM Density</div>
              <div className="text-sm text-muted-foreground">
                Ultra-absorbent
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">500+</div>
              <div className="text-primary font-medium">Wash Cycles</div>
              <div className="text-sm text-muted-foreground">
                Guaranteed durability
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                99.9%
              </div>
              <div className="text-primary font-medium">Dirt Removal</div>
              <div className="text-sm text-muted-foreground">
                Proven effectiveness
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
