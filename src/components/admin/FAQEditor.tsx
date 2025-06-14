
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Save, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
}

const FAQEditor = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = () => {
    const newFAQ: FAQ = {
      question: '',
      answer: '',
      order_index: faqs.length + 1,
      is_active: true
    };
    setFaqs(prev => [...prev, newFAQ]);
  };

  const removeFAQ = async (index: number) => {
    const faq = faqs[index];
    
    if (faq.id) {
      try {
        const { error } = await (supabase as any)
          .from('faqs')
          .delete()
          .eq('id', faq.id);

        if (error) throw error;
        toast.success('FAQ deleted successfully');
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('Failed to delete FAQ');
        return;
      }
    }

    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: any) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const moveFAQ = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const updated = [...faqs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order indices
    updated.forEach((faq, i) => {
      faq.order_index = i + 1;
    });
    
    setFaqs(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const faq of faqs) {
        if (faq.id) {
          // Update existing
          const { error } = await (supabase as any)
            .from('faqs')
            .update({
              question: faq.question,
              answer: faq.answer,
              order_index: faq.order_index,
              is_active: faq.is_active,
              updated_at: new Date().toISOString()
            })
            .eq('id', faq.id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await (supabase as any)
            .from('faqs')
            .insert({
              question: faq.question,
              answer: faq.answer,
              order_index: faq.order_index,
              is_active: faq.is_active
            });

          if (error) throw error;
        }
      }

      toast.success('FAQs updated successfully');
      fetchFAQs(); // Refresh to get IDs for new FAQs
    } catch (error) {
      console.error('Error saving FAQs:', error);
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
        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
        <Button onClick={addFAQ} variant="outline">
          <Plus className="mr-2" size={16} />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">FAQ {index + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => moveFAQ(index, 'up')}
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                >
                  <ArrowUp size={16} />
                </Button>
                <Button
                  onClick={() => moveFAQ(index, 'down')}
                  variant="outline"
                  size="sm"
                  disabled={index === faqs.length - 1}
                >
                  <ArrowDown size={16} />
                </Button>
                <Switch
                  checked={faq.is_active}
                  onCheckedChange={(checked) => updateFAQ(index, 'is_active', checked)}
                />
                <span className="text-sm">Active</span>
                <Button
                  onClick={() => removeFAQ(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  placeholder="Frequently asked question"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Answer</label>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  placeholder="Answer to the question"
                  rows={3}
                />
              </div>
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

export default FAQEditor;
