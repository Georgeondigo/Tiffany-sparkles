import React, { useEffect, useState } from "react";
import { ArrowDown, Award, Globe, MapPin, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
}

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<HeroContent>({
    title: "Tiffany Sparkles",
    subtitle: "Premium Microfiber Excellence",
    description:
      "Experience the ultimate in cleaning technology with our superior microfiber cloths. Designed for modern lifestyles, crafted with precision, and built to last.",
    image_url: "",
  });

  useEffect(() => {
    setIsVisible(true);
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_sections")
        .select("content")
        .eq("section_name", "hero")
        .maybeSingle();

      if (!error && data?.content) {
        setContent(data.content as unknown as HeroContent);
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    }
  };

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLocations = () => {
    document
      .getElementById("locations")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 md:pt-0"
    >
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-24 opacity-50 wave-decoration"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto pt-1 md:pt-36 px-4 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
            {content.title.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  index === 1
                    ? "block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
                    : ""
                }
              >
                {word}
                {index === 0 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="text-lg md:text-xl font-sans text-muted-foreground mb-4 max-w-2xl mx-auto">
            {content.subtitle}
          </p>

          <p className="text-base md:text-lg font-sans text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14 md:mb-6">
            <Button
              onClick={scrollToProducts}
              variant="outline"
              size="lg"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
            >
              View Collection
            </Button>
            <Button
              onClick={scrollToLocations}
              size="lg"
              className="bg-black text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-md"
            >
              <MapPin className="mr-2" size={18} />
              Find a Store
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8   mb-16">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Crafted with precision using cutting-edge ultrasonic technology,
                ensuring no frayed edges and superior performance.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                Global Standards
              </h3>
              <p className="text-gray-600">
                Originally made in the EU, now proudly manufactured in East
                Africa, maintaining the highest international quality standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#D4AF37]  rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary]" />
              </div>
              <h3 className="text-xl font-semibold font-sans text-black mb-3">
                Trusted Excellence
              </h3>
              <p className="text-gray-600">
                Chosen by professionals and enthusiasts across Africa for its
                unmatched cleaning performance and durability.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="animate-slide-in-left text-left">
                <h2 className="text-3xl lg:text-4xl font-serif font-extrabold text-primary mb-4 tracking-tight">
                  Why <span className="text-[#D4AF37]">Edgeless</span> Matters
                </h2>
                <p className="text-gray-700 mb-4 text-lg lg:text-xl leading-relaxed font-light">
                  Microfibre cloths, first developed in Japan and perfected by
                  Korean and German makers, transformed car care with their
                  softness and cleaning power. But even the best cloth needs
                  flawless design to prevent damage.
                </p>
                <p className="text-gray-700 text-lg lg:text-xl leading-relaxed font-light">
                  That’s why{" "}
                  <span className="font-semibold text-[#D4AF37]">edgeless</span>{" "}
                  matters. Over time, stitched edges or labels can cause swirls
                  and scratches. Our ultrasonically cut cloths ensure a
                  seamless, gentle clean every time.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/image 28.png"
                  alt="Premium manufacturing facility"
                  className="rounded-xl shadow-lg w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bars */}
      <div className="absolute top-1/4 left-10 w-2 h-16 bg-gradient-to-b from-secondary to-transparent opacity-60 hidden lg:block"></div>
      <div className="absolute top-1/3 right-10 w-2 h-24 bg-gradient-to-b from-secondary to-transparent opacity-60 hidden lg:block"></div>
    </section>
  );
};

export default Hero;
