
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Save } from 'lucide-react';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
}

const HeroEditor = () => {
  const [content, setContent] = useState<HeroContent>({
    title: '',
    subtitle: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_name', 'hero')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setContent(data.content as unknown as HeroContent);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      toast.error('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(fileName);

      setContent(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // First check if record exists
      const { data: existing } = await supabase
        .from('content_sections')
        .select('id')
        .eq('section_name', 'hero')
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('content_sections')
          .update({
            content: content as any,
            updated_at: new Date().toISOString()
          })
          .eq('section_name', 'hero');

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('content_sections')
          .insert({
            section_name: 'hero',
            content: content as any
          });

        if (error) throw error;
      }

      toast.success('Hero section updated successfully');
    } catch (error) {
      console.error('Error saving hero content:', error);
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Main Title</label>
            <Input
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Tiffany Sparkles"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subtitle</label>
            <Input
              value={content.subtitle}
              onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g., Premium Microfiber Excellence"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Main description text..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Hero Image</label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="w-full"
              >
                <Upload className="mr-2" size={16} />
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Preview</label>
          <Card>
            <CardContent className="p-4">
              {content.image_url && (
                <img
                  src={content.image_url}
                  alt="Hero preview"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{content.title || 'Title'}</h2>
              <h3 className="text-lg text-[#D4AF37] mb-2">{content.subtitle || 'Subtitle'}</h3>
              <p className="text-muted-foreground text-sm">{content.description || 'Description'}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="mr-2" size={16} />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default HeroEditor;
