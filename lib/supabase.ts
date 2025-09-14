import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL || "your_supabase_url_here";
const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your_supabase_anon_key_here";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PhotoRecord {
	id: number | string;
	image_url: string;
	music_url: string;
	created_at?: string;
	card_image?: string;
	image_label_claude?: string;
}

// Available card images in the public directory
const cardImages = ['/grayCard.png', '/pinkCard.png', '/redCard.jpg'];

// Utility function to get a random card image
export function getRandomCardImage(): string {
	return cardImages[Math.floor(Math.random() * cardImages.length)];
}
