
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Upload, MoveUp, MoveDown } from 'lucide-react';

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

const ProductsEditor = () => {
  const [content, setContent] = useState<ProductsContent>({
    title: 'Featured Products',
    description: 'Discover our bestselling microfiber cloths, trusted by thousands of customers',
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const fetchProductsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_name', 'featured_products')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setContent(data.content as unknown as ProductsContent);
      }
    } catch (error) {
      console.error('Error fetching products content:', error);
      toast.error('Failed to load products content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(fileName);

      const updatedProducts = [...content.products];
      updatedProducts[index].image = publicUrl;
      setContent(prev => ({ ...prev, products: updatedProducts }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const addProduct = () => {
    const newProduct: Product = {
      name: '',
      description: '',
      image: '',
      rating: 5,
      price: ''
    };
    setContent(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const removeProduct = (index: number) => {
    setContent(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updatedProducts = [...content.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setContent(prev => ({ ...prev, products: updatedProducts }));
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.products.length) return;

    const updatedProducts = [...content.products];
    [updatedProducts[index], updatedProducts[newIndex]] = [updatedProducts[newIndex], updatedProducts[index]];
    setContent(prev => ({ ...prev, products: updatedProducts }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // First check if record exists
      const { data: existing } = await supabase
        .from('content_sections')
        .select('id')
        .eq('section_name', 'featured_products')
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('content_sections')
          .update({
            content: content as any,
            updated_at: new Date().toISOString()
          })
          .eq('section_name', 'featured_products');

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('content_sections')
          .insert({
            section_name: 'featured_products',
            content: content as any
          });

        if (error) throw error;
      }

      toast.success('Products section updated successfully');
    } catch (error) {
      console.error('Error saving products:', error);
      toast.error('Failed to save changes: ' + (error as any).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Section Title
          </label>
          <Input
            value={content.title}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Featured Products"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Section Description
          </label>
          <Input
            value={content.description}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description for the products section"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
          <Button onClick={addProduct} variant="outline">
            <Plus className="mr-2" size={16} />
            Add Product
          </Button>
        </div>

        {content.products.map((product, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Product {index + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => moveProduct(index, "up")}
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                >
                  <MoveUp size={16} />
                </Button>
                <Button
                  onClick={() => moveProduct(index, "down")}
                  variant="outline"
                  size="sm"
                  disabled={index === content.products.length - 1}
                >
                  <MoveDown size={16} />
                </Button>
                <Button
                  onClick={() => removeProduct(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Product Name
                  </label>
                  <Input
                    value={product.name}
                    onChange={(e) =>
                      updateProduct(index, "name", e.target.value)
                    }
                    placeholder="Product name"
                  />
                </div>
                {/*<div>
                  <label className="text-sm font-medium mb-2 block">
                    Price
                  </label>
                  <Input
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(index, "price", e.target.value)
                    }
                    placeholder="e.g., ₹299"
                  />
                </div>*/}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  value={product.description}
                  onChange={(e) =>
                    updateProduct(index, "description", e.target.value)
                  }
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
              { /* <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={product.rating}
                    onChange={(e) =>
                      updateProduct(index, "rating", parseFloat(e.target.value))
                    }
                  />
                </div>*/}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Upload Image
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                  />
                </div>
              </div>

              {product.image && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">
                    Preview
                  </label>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-w-xs h-auto object-contain rounded-lg bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="mr-2" size={16} />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default ProductsEditor;
