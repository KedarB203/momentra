# 🗄️ Supabase Database Setup Guide

## Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (or create a new one if needed)

## Step 2: Create the `days` Table

### Option A: Using SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Create the days table
CREATE TABLE IF NOT EXISTS public.days (
  id SERIAL PRIMARY KEY,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data
INSERT INTO public.days (image_urls, music_url) VALUES
(
  ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  ],
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
);

-- Verify the table was created
SELECT * FROM public.days;
```

4. Click **Run** to execute the SQL

### Option B: Using Table Editor

1. Go to **Table Editor** in your Supabase dashboard
2. Click **New Table**
3. Set table name to `days`
4. Add these columns:
   - `id` (int8, Primary Key, Auto-increment)
   - `image_urls` (text[], Array)
   - `music_url` (text)
   - `created_at` (timestamptz, Default: now())

## Step 3: Set Up Row Level Security (RLS)

### Option A: Make Table Public (Quick Setup)

```sql
-- Disable RLS for public access (for development)
ALTER TABLE public.days DISABLE ROW LEVEL SECURITY;
```

### Option B: Enable RLS with Public Policy (Recommended)

```sql
-- Enable RLS
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access
CREATE POLICY "Allow public read access" ON public.days
  FOR SELECT USING (true);

-- Create a policy that allows public insert access
CREATE POLICY "Allow public insert access" ON public.days
  FOR INSERT WITH CHECK (true);
```

## Step 4: Verify Your Setup

### Check Table Structure
```sql
-- View table structure
\d public.days;

-- Or use this query
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'days' AND table_schema = 'public';
```

### Test Data Access
```sql
-- Test reading data
SELECT * FROM public.days LIMIT 5;

-- Test inserting data
INSERT INTO public.days (image_urls, music_url) VALUES
(
  ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  'https://example.com/music.mp3'
);
```

## Step 5: Update Your Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic Claude API Configuration (Server-side only)
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

## 🚨 Troubleshooting

### Error: "Could not find the table 'public.days'"
- Make sure you created the table in the correct schema (`public`)
- Check that the table name is exactly `days` (lowercase)
- Verify you're connected to the right Supabase project

### Error: "permission denied for table days"
- Run the RLS setup SQL above
- Or disable RLS temporarily for testing

### Error: "relation 'days' does not exist"
- The table wasn't created successfully
- Check the SQL Editor for any error messages
- Try creating the table again

## 📋 Quick Test

After setup, your app should:
1. Load without 404 errors
2. Display images from the `days` table
3. Show the image carousel with your data

## 🔗 Useful Links

- [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
- [Supabase Table Editor](https://supabase.com/dashboard/project/_/editor)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
