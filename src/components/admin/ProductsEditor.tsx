import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Save, Trash2, MoveUp, MoveDown } from "lucide-react";

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

const convertImageToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context error");

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject("WebP conversion failed")),
          "image/webp",
          0.9
        );
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ProductsEditor = () => {
  const [content, setContent] = useState<ProductsContent>({
    title: "Featured Products",
    description:
      "Discover our bestselling Microfibre cloths, trusted by thousands of customers",
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const fetchProductsContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_sections")
        .select("content")
        .eq("section_name", "featured_products")
        .maybeSingle();
      if (error) throw error;
      if (data?.content) setContent(data.content as ProductsContent);
    } catch {
      toast.error("Failed to load products content");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      toast.info("Converting image to WebP...");
      const webpBlob = await convertImageToWebP(file);
      toast.success("Converted to WebP");

      const fileName = `product-${index}-${Date.now()}.webp`;
      const { data: signed, error: signError } = await supabase.storage
        .from("cms-images")
        .createSignedUploadUrl(fileName);
      if (signError || !signed) throw signError;

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress((prev) => ({ ...prev, [index]: percent }));
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("cms-images").getPublicUrl(fileName);
          const updated = [...content.products];
          updated[index].image = publicUrl;
          setContent((prev) => ({ ...prev, products: updated }));
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));
          toast.success("Image uploaded");
        } else {
          toast.error(`Upload failed: ${xhr.status}`);
        }
      };
      xhr.onerror = () => toast.error("Upload error");
      xhr.open("PUT", signed.signedUrl, true);
      xhr.setRequestHeader("Content-Type", "image/webp");
      xhr.send(webpBlob);
    } catch (err: any) {
      console.error(err);
      toast.error("Image upload failed: " + err.message);
    }
  };

  const addProduct = () =>
    setContent((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { name: "", description: "", image: "", rating: 5, price: "" },
      ],
    }));

  const removeProduct = (i: number) =>
    setContent((prev) => ({
      ...prev,
      products: prev.products.filter((_, idx) => idx !== i),
    }));

  const updateProduct = (i: number, field: keyof Product, value: any) => {
    const arr = [...content.products];
    arr[i] = { ...arr[i], [field]: value };
    setContent((prev) => ({ ...prev, products: arr }));
  };

  const moveProduct = (i: number, dir: "up" | "down") => {
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= content.products.length) return;
    const arr = [...content.products];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setContent((prev) => ({ ...prev, products: arr }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("content_sections")
        .select("id")
        .eq("section_name", "featured_products")
        .maybeSingle();

      const payload = {
        content: content as any,
        updated_at: new Date().toISOString(),
      };
      const action = existing
        ? supabase
            .from("content_sections")
            .update(payload)
            .eq("section_name", "featured_products")
        : supabase
            .from("content_sections")
            .insert({
              section_name: "featured_products",
              content: content as any,
            });

      const { error } = await action;
      if (error) throw error;
      toast.success("Products updated");
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Section Title"
          value={content.title}
          onChange={(e) =>
            setContent((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          label="Section Description"
          value={content.description}
          onChange={(e) =>
            setContent((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Products</h3>
          <Button onClick={addProduct} variant="outline">
            <Plus className="mr-2" /> Add Product
          </Button>
        </div>

        {content.products.map((prod, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Product {i + 1}</CardTitle>
              <div className="space-x-2 flex">
                <Button
                  onClick={() => moveProduct(i, "up")}
                  disabled={i === 0}
                  variant="outline"
                  size="sm"
                >
                  <MoveUp size={16} />
                </Button>
                <Button
                  onClick={() => moveProduct(i, "down")}
                  disabled={i === content.products.length - 1}
                  variant="outline"
                  size="sm"
                >
                  <MoveDown size={16} />
                </Button>
                <Button
                  onClick={() => removeProduct(i)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Name"
                value={prod.name}
                onChange={(e) => updateProduct(i, "name", e.target.value)}
              />
              <Textarea
                label="Description"
                value={prod.description}
                onChange={(e) =>
                  updateProduct(i, "description", e.target.value)
                }
                rows={3}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Upload Image
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(i, file);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  {uploadProgress[i] != null && uploadProgress[i] < 100 && (
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                      <div
                        className="bg-primary h-2 rounded"
                        style={{ width: `${uploadProgress[i]}%` }}
                      />
                    </div>
                  )}
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="mt-2 w-full max-w-xs object-contain rounded-lg bg-muted"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="mr-2" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default ProductsEditor;
