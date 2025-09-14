# Momentra

A modern web application that captures life's beautiful moments through carefully curated images and ambient sounds. Built with Next.js, shadcn/ui, Tailwind CSS, and Supabase.

## Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS with a beautiful pink accent theme
- **Image Carousel**: Auto-playing carousel with smooth transitions and navigation controls
- **Background Music**: Integrated audio player with play/pause and mute controls
- **AI Image Analysis**: Powered by Claude API to analyze images with detailed descriptions, object detection, mood analysis, and music suggestions
- **Supabase Integration**: Fetches data from a Supabase database table called `days`
- **Responsive Design**: Works beautifully on all device sizes
- **Fallback Content**: Displays beautiful placeholder content when Supabase is not configured

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Anthropic Claude API Configuration (Server-side only)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Note**: 
- You'll need to get your Anthropic API key from [Anthropic's console](https://console.anthropic.com/) to enable image analysis features
- The API key is stored server-side only for security (not prefixed with `NEXT_PUBLIC_`)
- See `API_KEY_SETUP.md` for detailed setup instructions

### 3. Supabase Database Setup

Create a table called `days` in your Supabase database. See `SUPABASE_SETUP.md` for detailed instructions.

**Quick Setup:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS public.days (
  id SERIAL PRIMARY KEY,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample data
INSERT INTO public.days (image_urls, music_url) VALUES
(
  ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
  ],
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
);

-- Allow public access (for development)
ALTER TABLE public.days DISABLE ROW LEVEL SECURITY;
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx` - Main page component with carousel and data fetching
- `components/Header.tsx` - Modern header with navigation
- `components/Footer.tsx` - Footer with links and company info
- `components/ImageCarousel.tsx` - Interactive image carousel with music controls
- `components/ImagaAnalyzer.tsx` - AI-powered image analysis component using Claude API
- `lib/supabase.ts` - Supabase client configuration
- `app/globals.css` - Global styles with pink accent color theme

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend and database
- **Anthropic Claude API** - AI image analysis
- **Embla Carousel** - Carousel functionality
- **Lucide React** - Icons

## Notes

- The app includes fallback data with beautiful nature images from Unsplash
- Music autoplay may be blocked by browsers - users will need to manually start playback
- All Supabase data is set to public access as requested
- The design uses a modern gradient background with pink accent colors
