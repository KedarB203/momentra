"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoriesViewer from "@/components/StoriesViewer";
import { supabase, type PhotoRecord, getRandomCardImage } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
	const [photos, setPhotos] = useState<PhotoRecord[]>([]);
	const [loading, setLoading] = useState(true);

	// Function to process photos and add card images before each photo
	const processPhotosWithCards = useCallback((
		originalPhotos: PhotoRecord[]
	): PhotoRecord[] => {
		const processedPhotos: PhotoRecord[] = [];

		originalPhotos.forEach((photo) => {
			// Add a card image before each photo
			const cardPhoto: PhotoRecord = {
				id: `card-${photo.id}`,
				image_url: getRandomCardImage(),
				music_url: photo.music_url, // Use the same music as the following photo
				card_image: getRandomCardImage(),
				created_at: photo.created_at,
				image_label_claude: photo.image_label_claude, // Pass the label from the photo it precedes
			};

			processedPhotos.push(cardPhoto);
			processedPhotos.push(photo);
		});

		return processedPhotos;
	}, []);

	// Fallback data for demonstration
	const fallbackData = useMemo<PhotoRecord[]>(() => [
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
	], []);

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
					setPhotos(processPhotosWithCards(fallbackData));
				} else {
					setPhotos(processPhotosWithCards(data || fallbackData));
				}
			} catch (err) {
				console.warn("Failed to fetch data, using fallback:", err);
				setPhotos(processPhotosWithCards(fallbackData));
			} finally {
				setLoading(false);
			}
		}

		fetchPhotos();
	}, [fallbackData, processPhotosWithCards]);

	return (
		<div className="min-h-screen flex flex-col relative">
			{/* Top half background */}
			<div className="absolute top-0 left-0 right-0 h-1/2 bg-white"></div>
			{/* Bottom half background */}
			<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-br from-background via-background to-accent/5"></div>
			{/* Content wrapper */}
			<div className="relative z-10 flex flex-col min-h-screen">
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
					) : photos.length > 0 ? (
						<>
							{/* Gleeful header text */}
							<div className="text-center mb-8">
								<h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
									Tinu&apos;s Daily Chronicles :p
								</h1>
								<p className="text-sm md:text-base text-muted-foreground mt-2 italic">
									Warning: May contain excessive amounts of awesomeness and
									spontaneous smiling 😄
								</p>
							</div>
							<StoriesViewer photos={photos} autoAdvanceTime={4000} />
						</>
					) : null}
				</main>

				<Footer />
			</div>
		</div>
	);
}
