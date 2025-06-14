
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';

interface ContactSettings {
  id?: string;
  whatsapp_number?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const ContactEditor = () => {
  const [settings, setSettings] = useState<ContactSettings>({
    whatsapp_number: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('contact_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      toast.error('Failed to load contact settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (field: keyof ContactSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await (supabase as any)
        .from('contact_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing?.id) {
        // Update existing
        const { error } = await (supabase as any)
          .from('contact_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await (supabase as any)
          .from('contact_settings')
          .insert(settings);

        if (error) throw error;
      }

      toast.success('Contact settings updated successfully');
    } catch (error) {
      console.error('Error saving contact settings:', error);
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
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2" size={20} />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">WhatsApp Number</label>
              <Input
                value={settings.whatsapp_number || ''}
                onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                placeholder="+919876543210"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Email</label>
              <Input
                type="email"
                value={settings.email || ''}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder="info@tiffanysparkles.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Phone</label>
              <Input
                value={settings.phone || ''}
                onChange={(e) => updateSetting('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Address</label>
              <Textarea
                value={settings.address || ''}
                onChange={(e) => updateSetting('address', e.target.value)}
                placeholder="Company address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Instagram className="mr-2" size={20} />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Instagram URL</label>
              <Input
                value={settings.instagram_url || ''}
                onChange={(e) => updateSetting('instagram_url', e.target.value)}
                placeholder="https://instagram.com/tiffanysparkles"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Facebook URL</label>
              <Input
                value={settings.facebook_url || ''}
                onChange={(e) => updateSetting('facebook_url', e.target.value)}
                placeholder="https://facebook.com/tiffanysparkles"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">TikTok URL</label>
              <Input
                value={settings.tiktok_url || ''}
                onChange={(e) => updateSetting('tiktok_url', e.target.value)}
                placeholder="https://tiktok.com/@tiffanysparkles"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-2 text-sm">
                {settings.whatsapp_number && (
                  <div className="flex items-center">
                    <MessageCircle className="mr-2" size={14} />
                    {settings.whatsapp_number}
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center">
                    <Mail className="mr-2" size={14} />
                    {settings.email}
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center">
                    <Phone className="mr-2" size={14} />
                    {settings.phone}
                  </div>
                )}
                {settings.address && (
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5" size={14} />
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="mr-2" size={16} />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default ContactEditor;
