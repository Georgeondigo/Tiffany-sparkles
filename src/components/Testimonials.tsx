import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  avatar_url?: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [animatingStars, setAnimatingStars] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data?.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials(fallbackTestimonials);
    }
  };

  const fallbackTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      message:
        "These Microfibre cloths are amazing! They clean my glass surfaces without any streaks. Best purchase I've made for my home.",
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      message:
        "I use Tiffany Sparkles cloths for my car detailing business. Customers always ask what makes the finish so perfect!",
    },
    {
      id: "3",
      name: "Sneha Patel",
      location: "Bangalore",
      rating: 5,
      message:
        "Finally found cloths that don't leave lint on my electronics. The quality is outstanding and they last so long.",
    },
    {
      id: "4",
      name: "Modern Home Store",
      location: "Pune",
      rating: 5,
      message:
        "Our customers love these products. We've been stocking Tiffany Sparkles for 2 years now - excellent quality and reliability.",
    },
  ];

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    triggerStarAnimation();
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    triggerStarAnimation();
  };

  const triggerStarAnimation = () => {
    setAnimatingStars(true);
    setTimeout(() => setAnimatingStars(false), 1000);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < rating
            ? `text-[#D4AF37] fill-[#D4AF37] ${
                animatingStars ? "animate-star-fill" : ""
              }`
            : "text-muted-foreground"
        }`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ));

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section className="py-20 bg-muted text-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            What Our <span className="text-[#D4AF37]">Customers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Tiffany Sparkles for
            their premium cleaning needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background rounded-2xl p-8 lg:p-12 shadow-lg border border-[#D4AF37]/30">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {renderStars(t.rating)}
              </div>
              <blockquote className="text-xl lg:text-2xl text-foreground mb-8 leading-relaxed">
                "{t.message}"
              </blockquote>
              <div className="text-lg font-semibold text-[#D4AF37]">
                {t.name}
              </div>
              <div className="text-muted-foreground">{t.location}</div>
            </div>

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-[#D4AF37] hover:bg-[#c49f27] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-[#D4AF37] hover:bg-[#c49f27] transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  triggerStarAnimation();
                }}
                className={`w-3 h-3 rounded-full ${
                  index === current ? "bg-[#D4AF37]" : "bg-muted-foreground/50"
                } transition-colors`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
