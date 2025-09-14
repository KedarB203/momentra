"use client";

import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Play,
	Pause,
	ChevronLeft,
	ChevronRight,
	Volume2,
	VolumeX,
} from "lucide-react";

interface ImageCarouselProps {
	images: string[];
	musicUrl: string;
	onImageChange?: (index: number) => void;
}

export default function ImageCarousel({
	images,
	musicUrl,
	onImageChange,
}: ImageCarouselProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			duration: 30,
		},
		[Autoplay({ delay: 4000, stopOnInteraction: false })]
	);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.loop = true;
			audioRef.current.volume = 0.6;
		}
	}, []);

	// Track carousel slide changes
	useEffect(() => {
		if (emblaApi && onImageChange) {
			const onSelect = () => {
				const selectedIndex = emblaApi.selectedScrollSnap();
				onImageChange(selectedIndex);
			};
			
			emblaApi.on('select', onSelect);
			
			// Call immediately to set initial index
			onSelect();
			
			return () => {
				emblaApi.off('select', onSelect);
			};
		}
	}, [emblaApi, onImageChange]);

	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const scrollPrev = () => emblaApi?.scrollPrev();
	const scrollNext = () => emblaApi?.scrollNext();

	return (
		<div className="relative w-full max-w-6xl mx-auto">
			<Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background via-background to-accent/5">
				<CardContent className="p-0 relative">
					<div className="embla" ref={emblaRef}>
						<div className="embla__container flex">
							{images.map((image, index) => (
								<div
									key={index}
									className="embla__slide flex-none w-full relative"
								>
									<div className="relative h-[60vh] min-h-[400px] overflow-hidden">
										<img
											src={image}
											alt={`Moment ${index + 1}`}
											className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.src =
													"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
											}}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation Controls */}
					<Button
						variant="ghost"
						size="icon"
						className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-md hover:bg-background/40 text-white border-white/20"
						onClick={scrollPrev}
					>
						<ChevronLeft className="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-md hover:bg-background/40 text-white border-white/20"
						onClick={scrollNext}
					>
						<ChevronRight className="h-6 w-6" />
					</Button>

					{/* Music Controls */}
					<div className="absolute bottom-4 left-4 flex items-center space-x-2">
						<Button
							variant="ghost"
							size="icon"
							className="bg-background/20 backdrop-blur-md hover:bg-background/40 text-white border-white/20"
							onClick={togglePlayPause}
						>
							{isPlaying ? (
								<Pause className="h-5 w-5" />
							) : (
								<Play className="h-5 w-5" />
							)}
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="bg-background/20 backdrop-blur-md hover:bg-background/40 text-white border-white/20"
							onClick={toggleMute}
						>
							{isMuted ? (
								<VolumeX className="h-5 w-5" />
							) : (
								<Volume2 className="h-5 w-5" />
							)}
						</Button>

						<span className="text-white/80 text-sm bg-background/20 backdrop-blur-md px-3 py-1 rounded-full">
							Background Music
						</span>
					</div>

					{/* Progress Dots */}
					<div className="absolute bottom-4 right-4 flex space-x-2">
						{images.map((_, index) => (
							<button
								key={index}
								className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
								onClick={() => emblaApi?.scrollTo(index)}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Hidden Audio Element */}
			<audio
				ref={audioRef}
				src={musicUrl}
				onLoadedData={() => {
					// Auto-play when loaded (Note: many browsers block autoplay)
					if (audioRef.current) {
						audioRef.current.play().catch(() => {
							// Autoplay blocked, user will need to manually start
							setIsPlaying(false);
						});
					}
				}}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
			/>
		</div>
	);
}
