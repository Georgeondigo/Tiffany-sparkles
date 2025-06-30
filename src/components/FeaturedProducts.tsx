import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  name: string;
  description: string;
  image: string;
  rating: number;
  price: string;
}

interface ProductsContent {
  title: string;
  description: string;
  products: Product[];
}

const FeaturedProducts = () => {
  const [content, setContent] = useState<ProductsContent>({
    title: "Featured Products",
    description:
      "Discover our bestselling microfiber cloths, trusted by thousands of customers",
    products: [],
  });

  const fetchProductsContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_sections")
        .select("content")
        .eq("section_name", "featured_products")
        .maybeSingle();

      if (!error && data?.content) {
        setContent(data.content as unknown as ProductsContent);
      }
    } catch (error) {
      console.error("Error fetching products content:", error);
    }
  };

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
      <div className="w-full h-80 relative overflow-hidden rounded-2xl bg-background">
        {!loaded && !error && (
          <div
            className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#1f1f1f_25%,#2c2c2c_37%,#1f1f1f_63%)] bg-[length:400%_100%]"
            role="status"
          />
        )}
        {!error ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            Image unavailable
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            {content.title.split(" ").map((word, index) => (
              <span
                key={index}
                className={index === 1 ? "text-[#D4AF37]" : "text-primary"}
              >
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {content.products.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="group relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <ProductImage src={product.image} alt={product.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-sans font-bold text-lg mb-1">
                          {product.name}
                        </h3>
                        <div className="w-12 h-0.5 bg-[#D4AF37] mb-2"></div>
                        <p className="text-sm text-gray-300 font-light italic mb-2">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
        
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
            <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Ultrasonically Cut • Zero Fraying • Premium Results
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
