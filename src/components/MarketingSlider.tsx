import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Gem,
  Monitor,
  Coffee,
  Wrench,
  Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MarketingItem {
  id?: string;
  type: "image" | "video";
  src: string;
  title: string;
  subtitle: string;
  overlay: boolean;
}

interface MarketingContent {
  title: string;
  description: string;
  items: MarketingItem[];
}

const MarketingSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [content, setContent] = useState<MarketingContent>({
    title: "Marketing Showcase",
    description:
      "Discover our latest campaigns and see why customers choose Tiffany Sparkles",
    items: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2000",
        title: "Revolutionary Cleaning Technology",
        subtitle: "Experience the future of microfiber",
        overlay: true,
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000",
        title: "Trusted by Professionals",
        subtitle: "Used in premium hotels and restaurants worldwide",
        overlay: true,
      },
      {
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        title: "See the Difference",
        subtitle: "Watch our microfiber technology in action",
        overlay: true,
      },
    ],
  });

  useEffect(() => {
    fetchMarketingContent();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || isVideoPlaying || content.items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVideoPlaying, content.items.length]);

  const fetchMarketingContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_sections")
        .select("content")
        .eq("section_name", "marketing_section")
        .single();

      if (!error && data?.content && data.content.items?.length > 0) {
        setContent(data.content as MarketingContent);
      }
    } catch (error) {
      console.error("Error fetching marketing content:", error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % content.items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + content.items.length) % content.items.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const useCases = [
    {
      icon: Car,
      title: "Car Detailing",
      description: "Professional-grade cleaning for automotive surfaces",
    },
    {
      icon: Gem,
      title: "Jewellery & Fine Items",
      description: "Gentle care for your precious metals and gems",
    },
    {
      icon: Monitor,
      title: "Electronics & Screens",
      description: "Safe cleaning for phones, tablets, and monitors",
    },
    {
      icon: Coffee,
      title: "Mirrors & Glassware",
      description: "Crystal-clear results on all glass surfaces",
    },
    {
      icon: Wrench,
      title: "Chrome & Stainless Steel",
      description: "Restore shine to metal fixtures and appliances",
    },
    {
      icon: Trophy,
      title: "Golf Clubs & Fine Shoes",
      description: "Maintain your premium sports and luxury items",
    },
  ];

  if (content.items.length === 0) return null;

  return (
    <>
      {/* Marketing Slider */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              {content.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.description}
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {content.items.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  {slide.type === "video" ? (
                    <video
                      src={slide.src}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      onPlay={() => setIsVideoPlaying(true)}
                      onEnded={() => {
                        setIsVideoPlaying(false);
                        setCurrentSlide(
                          (prev) => (prev + 1) % content.items.length
                        );
                      }}
                      controls={false}
                    />
                  ) : (
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {slide.overlay && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent">
                      <div className="absolute bottom-8 left-8 right-8 text-background">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                          {slide.title}
                        </h3>
                        <p className="text-md opacity-90">{slide.subtitle}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 text-primary p-3 rounded-full shadow-lg hover:bg-background hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/90 text-primary p-3 rounded-full shadow-lg hover:bg-background hover:scale-110 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <div className="flex justify-center mt-8 space-x-3">
              {content.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-secondary transform scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-black mb-6">
              Versatile <span className="text-[#D4AF37]">Applications</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One premium cloth, endless possibilities. Exceptional results
              across all surfaces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group p-8 bg-gray-50 rounded-2xl hover:bg-[#D4AF37]/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-300">
                  <useCase.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketingSlider;
