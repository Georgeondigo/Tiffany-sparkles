# Tiffany Sparkles - Local Development Setup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd tiffany-sparkles
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🗄️ Supabase Setup

### Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create content_sections table
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create store_locations table
CREATE TABLE IF NOT EXISTS public.store_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  store_type TEXT DEFAULT 'Retail Partner',
  latitude NUMERIC,
  longitude NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_settings table
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  location TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Storage Buckets

```sql
-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables (optional for public content)
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all content (since it's a public website)
CREATE POLICY "Allow public read access" ON public.content_sections FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access" ON public.store_locations FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access" ON public.contact_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.faqs FOR SELECT TO anon USING (is_active = true);

-- Storage policies for public access
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'cms-images');
```

### Sample Data (Optional)

```sql
-- Sample contact settings
INSERT INTO public.contact_settings (
  whatsapp_number,
  instagram_url,
  facebook_url,
  tiktok_url,
  email,
  phone,
  address
) VALUES (
  '+919876543210',
  'https://instagram.com/tiffanysparkles',
  'https://facebook.com/tiffanysparkles',
  'https://tiktok.com/@tiffanysparkles',
  'info@tiffanysparkles.com',
  '+91 98765 43210',
  'Mumbai, India'
);

-- Sample store locations
INSERT INTO public.store_locations (name, address, phone, store_type, latitude, longitude) VALUES
('Premium Homeware Mumbai', '123 Shopping Mall, Bandra West, Mumbai 400050', '+91 98765 43210', 'Retail Partner', 19.0596, 72.8295),
('Quality Essentials Delhi', '456 Market Street, Connaught Place, New Delhi 110001', '+91 98765 43211', 'Authorized Dealer', 28.6139, 77.2090),
('Home Solutions Bangalore', '789 Commercial Complex, MG Road, Bangalore 560001', '+91 98765 43212', 'Retail Partner', 12.9716, 77.5946);

-- Sample FAQs
INSERT INTO public.faqs (question, answer, order_index) VALUES
('What makes Tiffany Sparkles Microfibre cloths special?', 'Our Microfibre cloths are made with premium materials that provide superior cleaning power while being gentle on all surfaces.', 1),
('How do I care for my Microfibre cloths?', 'Simply machine wash in warm water without fabric softener. Air dry or tumble dry on low heat.', 2),
('Do you offer bulk discounts?', 'Yes! Contact us for special pricing on bulk orders for businesses and institutions.', 3);
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # CMS admin components
│   ├── ui/              # Shadcn UI components
│   └── ...              # Main site components
├── integrations/
│   └── supabase/        # Supabase client & types
├── pages/               # Page components
└── lib/                 # Utility functions
```

## 🔑 Admin Access

1. Create an admin user in Supabase Auth
2. Update the user's role in the profiles table:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

3. Access the CMS at `/admin`

## 🚀 Deployment

The app can be deployed to:

- Vercel (recommended)
- Netlify
- Any platform supporting React/Vite

Make sure to set the environment variables in your deployment platform.

## 📞 Support

For questions or issues:

- Check the console for error messages
- Verify Supabase connection
- Ensure all environment variables are set correctly
