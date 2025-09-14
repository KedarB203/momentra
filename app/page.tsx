"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoriesViewer from "@/components/StoriesViewer";
import { supabase, type PhotoRecord } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
	const [photos, setPhotos] = useState<PhotoRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fallback data for demonstration
	const fallbackData: PhotoRecord[] = [
		{
			id: 1,
			image_url:
				"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
			music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
		},
		{
			id: 2,
			image_url:
				"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
			music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
		},
		{
			id: 3,
			image_url:
				"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
			music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
		},
		{
			id: 4,
			image_url:
				"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
			music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
		},
		{
			id: 5,
			image_url:
				"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
			music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
		},
	];

	useEffect(() => {
		async function fetchPhotos() {
			try {
				setLoading(true);
				const { data, error } = await supabase
					.from("photos")
					.select("*")
					.order("created_at", { ascending: true });

				if (error) {
					console.warn("Supabase error, using fallback data:", error.message);
					setPhotos(fallbackData);
				} else {
					setPhotos(data || fallbackData);
				}
			} catch (err) {
				console.warn("Failed to fetch data, using fallback:", err);
				setPhotos(fallbackData);
			} finally {
				setLoading(false);
			}
		}

		fetchPhotos();
	}, []);

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
			<Header />

			<main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{loading ? (
					<div className="flex justify-center items-center h-96">
						<Card className="w-full max-w-md">
							<CardContent className="flex flex-col items-center justify-center p-8">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
								<p className="text-muted-foreground">
									Loading today&apos;s moments...
								</p>
							</CardContent>
						</Card>
					</div>
				) : error ? (
					<div className="flex justify-center items-center h-96">
						<Card className="w-full max-w-md border-destructive/50">
							<CardContent className="flex flex-col items-center justify-center p-8">
								<p className="text-destructive text-center">{error}</p>
							</CardContent>
						</Card>
					</div>
				) : photos.length > 0 ? (
					<StoriesViewer photos={photos} autoAdvanceTime={4000} />
				) : null}
			</main>

			<Footer />
		</div>
	);
}
