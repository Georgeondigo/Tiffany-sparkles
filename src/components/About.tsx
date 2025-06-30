
import React, { useEffect, useState } from 'react';
import { Building2, Users, Award, Globe } from 'lucide-react';

const About = () => {
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

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <Building2 className="text-[#D4AF37]" size={28} />,
      number: "15+",
      label: "Years in Business"
    },
    {
      icon: <Users className="text-[#D4AF37]" size={28} />,
      number: "1M+",
      label: "Happy Customers"
    },
    {
      icon: <Award className="text-[#D4AF37]" size={28} />,
      number: "50+",
      label: "Industry Awards"
    },
    {
      icon: <Globe className="text-[#D4AF37]" size={28} />,
      number: "50+",
      label: "Countries Served"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
              Our Story of Excellence
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mb-6"></div>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Tiffany Sparkles represents the pinnacle of microfiber innovation, brought to you by 
              <span className="text-[#D4AF37] font-semibold"> Dinesh Gupta Limited</span>, a trusted name 
              in quality manufacturing for over a decade.
            </p>
            
            <p className="text-base text-foreground/80 mb-6 leading-relaxed">
              Our journey began with a simple vision: to revolutionize the cleaning industry through 
              superior microfiber technology. Today, we're proud to offer products that combine 
              cutting-edge science with elegant design, making cleaning not just effective, but enjoyable.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary mb-4">Our Commitment</h3>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Premium quality materials sourced responsibly</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Innovative manufacturing processes for superior performance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Continuous research and development for product improvement</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Exceptional customer service and satisfaction guarantee</span>
                </li>
              </ul>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 bg-background rounded-lg shadow-md transition-all duration-500 hover:shadow-lg ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative">
              <img 
                src="/image 24.png" 
                alt="Dinesh Gupta Limited manufacturing facility"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl"></div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-xl border-l-4 border-secondary">
                <h4 className="text-lg font-semibold text-primary mb-2">Quality Certified</h4>
                <p className="text-sm text-muted-foreground">
                  ISO 9001:2015 Certified Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
