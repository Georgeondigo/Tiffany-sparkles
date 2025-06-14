// components/FeaturedProducts.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import OrderNowButton from './OrderNowButton';
import { supabase } from '@/integrations/supabase/client';

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
    products: [
      {
        name: "Premium Multi-Surface Cloth",
        description:
          "Perfect for glass, electronics, and delicate surfaces. Ultra-soft microfiber.",
        image:
          "https://cdn.pixabay.com/photo/2017/05/01/08/56/microfiber-2279763_1280.jpg",
        rating: 4.9,
        price: "₹299",
      },
      {
        name: "Kitchen Pro Cleaning Set",
        description:
          "Heavy-duty microfiber for kitchen counters, appliances, and tough stains.",
        image:
          "https://cdn.pixabay.com/photo/2016/12/06/09/31/cleaning-1880367_1280.jpg",
        rating: 4.8,
        price: "₹499",
      },
      {
        name: "Car Care Collection",
        description:
          "Specially designed for automotive surfaces. Scratch-free and lint-free.",
        image:
          "https://cdn.pixabay.com/photo/2016/03/27/17/40/auto-1283631_1280.jpg",
        rating: 4.9,
        price: "₹699",
      },
    ],
  });

  const fetchProductsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_name', 'featured_products')
        .maybeSingle();

      if (!error && data?.content) {
        setContent(data.content as unknown as ProductsContent);
      }
    } catch (error) {
      console.error('Error fetching products content:', error);
    }
  };

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
      <div className="aspect-square w-full relative overflow-hidden bg-muted">
        {!loaded && !error && (
          <div
            className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#f3f3f3_25%,#e0e0e0_37%,#f3f3f3_63%)] bg-[length:400%_100%]"
            role="status"
          />
        )}
        {!error ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
            Image unavailable
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="featured-products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.products.map((product, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <ProductImage src={product.image} alt={product.name} />
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-[#D4AF37] fill-current"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.rating})
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {product.price}
                  </span>
                  <OrderNowButton
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <OrderNowButton
            size="lg"
            className="bg-[#D4AF37] text-[#D4AF37]-foreground hover:bg-secondary/90"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
