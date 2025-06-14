
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Save, Trash2, MoveUp, MoveDown } from 'lucide-react';

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

const MarketingEditor = () => {
  const [content, setContent] = useState<MarketingContent>({
    title: 'Marketing Showcase',
    description: 'Discover our latest campaigns and see why customers choose Tiffany Sparkles',
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMarketingContent();
  }, []);

  const fetchMarketingContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_name', 'marketing_section')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setContent(data.content as unknown as MarketingContent);
      }
    } catch (error) {
      console.error('Error fetching marketing content:', error);
      toast.error('Failed to load marketing content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `marketing-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(fileName);

      const updatedItems = [...content.items];
      updatedItems[index].src = publicUrl;
      
      // Auto-detect file type based on extension
      const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExt?.toLowerCase() || '');
      updatedItems[index].type = isVideo ? 'video' : 'image';
      
      setContent(prev => ({ ...prev, items: updatedItems }));
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const addItem = () => {
    const newItem: MarketingItem = {
      type: 'image',
      src: '',
      title: '',
      subtitle: '',
      overlay: true
    };
    setContent(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setContent(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof MarketingItem, value: any) => {
    const updatedItems = [...content.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setContent(prev => ({ ...prev, items: updatedItems }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.items.length) return;

    const updatedItems = [...content.items];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    setContent(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // First check if record exists
      const { data: existing } = await supabase
        .from('content_sections')
        .select('id')
        .eq('section_name', 'marketing_section')
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('content_sections')
          .update({
            content: content as any,
            updated_at: new Date().toISOString()
          })
          .eq('section_name', 'marketing_section');

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('content_sections')
          .insert({
            section_name: 'marketing_section',
            content: content as any
          });

        if (error) throw error;
      }

      toast.success('Marketing section updated successfully');
    } catch (error) {
      console.error('Error saving marketing content:', error);
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
          <label className="text-sm font-medium mb-2 block">Section Title</label>
          <Input
            value={content.title}
            onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Marketing Showcase"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Section Description</label>
          <Input
            value={content.description}
            onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description for the marketing section"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Marketing Items</h3>
          <Button onClick={addItem} variant="outline">
            <Plus className="mr-2" size={16} />
            Add Item
          </Button>
        </div>

        {content.items.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Item {index + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => moveItem(index, 'up')}
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                >
                  <MoveUp size={16} />
                </Button>
                <Button
                  onClick={() => moveItem(index, 'down')}
                  variant="outline"
                  size="sm"
                  disabled={index === content.items.length - 1}
                >
                  <MoveDown size={16} />
                </Button>
                <Button
                  onClick={() => removeItem(index)}
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
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder="Item title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subtitle</label>
                  <Input
                    value={item.subtitle}
                    onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                    placeholder="Item subtitle"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Media Type</label>
                  <Select
                    value={item.type}
                    onValueChange={(value: 'image' | 'video') => updateItem(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Media</label>
                  <Input
                    type="file"
                    accept={item.type === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    checked={item.overlay}
                    onCheckedChange={(checked) => updateItem(index, 'overlay', checked)}
                  />
                  <span className="text-sm">Show overlay</span>
                </div>
              </div>

              {item.src && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Preview</label>
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className="w-32 h-24 object-cover rounded-lg"
                      controls
                      muted
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
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

export default MarketingEditor;
