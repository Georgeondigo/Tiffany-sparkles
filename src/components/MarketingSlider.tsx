
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketingItem {
  id?: string;
  type: 'image' | 'video';
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
  const [content, setContent] = useState<MarketingContent>({
    title: 'Marketing Showcase',
    description: 'Discover our latest campaigns and see why customers choose Tiffany Sparkles',
    items: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2000',
        title: 'Revolutionary Cleaning Technology',
        subtitle: 'Experience the future of microfiber',
        overlay: true
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000',
        title: 'Trusted by Professionals',
        subtitle: 'Used in premium hotels and restaurants worldwide',
        overlay: true
      },
      {
        type: 'video',
        src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000',
        title: 'See the Difference',
        subtitle: 'Watch our microfiber technology in action',
        overlay: true
      }
    ]
  });

  useEffect(() => {
    fetchMarketingContent();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || content.items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, content.items.length]);

  const fetchMarketingContent = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('content_sections')
        .select('content')
        .eq('section_name', 'marketing_section')
        .single();

      if (!error && data?.content && data.content.items?.length > 0) {
        setContent(data.content as MarketingContent);
      }
    } catch (error) {
      console.error('Error fetching marketing content:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % content.items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + content.items.length) % content.items.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            {content.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {content.items.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-x-0' 
                    : index < currentSlide 
                      ? 'opacity-0 transform -translate-x-full' 
                      : 'opacity-0 transform translate-x-full'
                }`}
              >
                {slide.type === 'video' ? (
                  <video
                    src={slide.src}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Video Play Button Overlay for image placeholders */}
                {slide.type === 'video' && slide.src.includes('unsplash') && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-background/90 text-primary p-4 rounded-full shadow-lg hover:bg-background hover:scale-110 transition-all duration-300">
                      <Play size={32} />
                    </button>
                  </div>
                )}

                {/* Content Overlay */}
                {slide.overlay && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent">
                    <div className="absolute bottom-8 left-8 right-8 text-background">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                        {slide.title}
                      </h3>
                      <p className="text-lg opacity-90">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
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

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {content.items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-secondary transform scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-[#D4AF37] mb-2">1M+</div>
            <div className="text-primary font-medium">Satisfied Customers</div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-[#D4AF37] mb-2">50+</div>
            <div className="text-primary font-medium">Countries Served</div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-[#D4AF37] mb-2">15+</div>
            <div className="text-primary font-medium">Years of Excellence</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSlider;
