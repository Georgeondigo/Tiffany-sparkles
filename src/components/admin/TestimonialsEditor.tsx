
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Upload } from 'lucide-react';

interface Testimonial {
  id?: string;
  name: string;
  location: string;
  message: string;
  rating: number;
  avatar_url?: string;
  is_active: boolean;
}

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonial-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(fileName);

      const updated = [...testimonials];
      updated[index].avatar_url = publicUrl;
      setTestimonials(updated);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: '',
      location: '',
      message: '',
      rating: 5,
      avatar_url: '',
      is_active: true
    };
    setTestimonials(prev => [...prev, newTestimonial]);
  };

  const removeTestimonial = async (index: number) => {
    const testimonial = testimonials[index];
    
    if (testimonial.id) {
      try {
        const { error } = await (supabase as any)
          .from('testimonials')
          .delete()
          .eq('id', testimonial.id);

        if (error) throw error;
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
        return;
      }
    }

    setTestimonials(prev => prev.filter((_, i) => i !== index));
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const testimonial of testimonials) {
        if (testimonial.id) {
          // Update existing
          const { error } = await (supabase as any)
            .from('testimonials')
            .update({
              name: testimonial.name,
              location: testimonial.location,
              message: testimonial.message,
              rating: testimonial.rating,
              avatar_url: testimonial.avatar_url,
              is_active: testimonial.is_active,
              updated_at: new Date().toISOString()
            })
            .eq('id', testimonial.id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await (supabase as any)
            .from('testimonials')
            .insert({
              name: testimonial.name,
              location: testimonial.location,
              message: testimonial.message,
              rating: testimonial.rating,
              avatar_url: testimonial.avatar_url,
              is_active: testimonial.is_active
            });

          if (error) throw error;
        }
      }

      toast.success('Testimonials updated successfully');
      fetchTestimonials(); // Refresh to get IDs for new testimonials
    } catch (error) {
      console.error('Error saving testimonials:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Testimonials</h3>
        <Button onClick={addTestimonial} variant="outline">
          <Plus className="mr-2" size={16} />
          Add Testimonial
        </Button>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Testimonial {index + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={testimonial.is_active}
                  onCheckedChange={(checked) => updateTestimonial(index, 'is_active', checked)}
                />
                <span className="text-sm">Active</span>
                <Button
                  onClick={() => removeTestimonial(index)}
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
                  <label className="text-sm font-medium mb-2 block">Customer Name</label>
                  <Input
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={testimonial.location}
                    onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Testimonial Message</label>
                <Textarea
                  value={testimonial.message}
                  onChange={(e) => updateTestimonial(index, 'message', e.target.value)}
                  placeholder="Customer testimonial message"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Avatar Image</label>
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

              {testimonial.avatar_url && (
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.name}
                  className="w-16 h-16 object-cover rounded-full"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="mr-2" size={16} />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default TestimonialsEditor;
