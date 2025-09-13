"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoriesViewer from "@/components/StoriesViewer";
import { supabase, type DayRecord } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
	const [dayData, setDayData] = useState<DayRecord | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fallback data for demonstration
	const fallbackData: DayRecord = {
		id: 1,
		image_urls: [
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
			"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
			"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
		],
		music_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
	};

	useEffect(() => {
		async function fetchDayData() {
			try {
				setLoading(true);
				const { data, error } = await supabase
					.from("days")
					.select("*")
					.limit(1)
					.single();

				if (error) {
					console.warn("Supabase error, using fallback data:", error.message);
					setDayData(fallbackData);
				} else {
					setDayData(data);
				}
			} catch (err) {
				console.warn("Failed to fetch data, using fallback:", err);
				setDayData(fallbackData);
			} finally {
				setLoading(false);
			}
		}

		fetchDayData();
	}, []);

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
			<Header />

			<main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
						Today's Moments
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Immerse yourself in life's moments through an interactive story-like experience
						with curated visuals and ambient sounds
					</p>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-96">
						<Card className="w-full max-w-md">
							<CardContent className="flex flex-col items-center justify-center p-8">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
								<p className="text-muted-foreground">
									Loading today's moments...
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
				) : dayData ? (
					<StoriesViewer
						images={dayData.image_urls}
						musicUrl={dayData.music_url}
						autoAdvanceTime={4000}
					/>
				) : null}

				<div className="mt-16 text-center">
					<Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="p-8">
							<h2 className="text-2xl font-semibold mb-4 text-foreground">
								Immerse Yourself
							</h2>
							<p className="text-muted-foreground">
								Tap to navigate, hold to pause, and let the ambient music transport you 
								through beautiful imagery. Each story unfolds at your pace, creating 
								moments of peace and reflection.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
}
