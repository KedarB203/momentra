# Momentra

A modern web application that captures life's beautiful moments through carefully curated images and ambient sounds. Built with Next.js, shadcn/ui, Tailwind CSS, and Supabase.

## Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS with a beautiful pink accent theme
- **Image Carousel**: Auto-playing carousel with smooth transitions and navigation controls
- **Background Music**: Integrated audio player with play/pause and mute controls
- **Supabase Integration**: Fetches data from a Supabase database table called `days`
- **Responsive Design**: Works beautifully on all device sizes
- **Fallback Content**: Displays beautiful placeholder content when Supabase is not configured

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with your Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabase Database Setup

Create a table called `days` in your Supabase database with the following structure:

```sql
CREATE TABLE days (
  id SERIAL PRIMARY KEY,
  image_urls TEXT[],
  music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Example data:

```sql
INSERT INTO days (image_urls, music_url) VALUES
(
  ARRAY[
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ],
  'https://example.com/background-music.mp3'
);
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
- `lib/supabase.ts` - Supabase client configuration
- `app/globals.css` - Global styles with pink accent color theme

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend and database
- **Embla Carousel** - Carousel functionality
- **Lucide React** - Icons

## Notes

- The app includes fallback data with beautiful nature images from Unsplash
- Music autoplay may be blocked by browsers - users will need to manually start playback
- All Supabase data is set to public access as requested
- The design uses a modern gradient background with pink accent colors
