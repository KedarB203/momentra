"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	SkipForward,
	SkipBack,
	X,
} from "lucide-react";

interface StoriesViewerProps {
	images: string[];
	musicUrl: string;
	autoAdvanceTime?: number; // in milliseconds
}

export default function StoriesViewer({
	images,
	musicUrl,
	autoAdvanceTime = 5000,
}: StoriesViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const audioRef = useRef<HTMLAudioElement>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(0);

	// Initialize audio
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.loop = true;
			audioRef.current.volume = 0.6;
		}
	}, []);

	// Progress tracking
	const startProgress = useCallback(() => {
		if (isPaused) return;
		
		startTimeRef.current = Date.now();
		setProgress(0);
		
		progressIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTimeRef.current;
			const newProgress = Math.min((elapsed / autoAdvanceTime) * 100, 100);
			setProgress(newProgress);
		}, 50);

		autoAdvanceTimeoutRef.current = setTimeout(() => {
			goToNext();
		}, autoAdvanceTime);
	}, [autoAdvanceTime, isPaused]);

	const stopProgress = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
			progressIntervalRef.current = null;
		}
		if (autoAdvanceTimeoutRef.current) {
			clearTimeout(autoAdvanceTimeoutRef.current);
			autoAdvanceTimeoutRef.current = null;
		}
	}, []);

	const pauseProgress = useCallback(() => {
		stopProgress();
	}, [stopProgress]);

	const resumeProgress = useCallback(() => {
		if (isPaused) return;
		
		const remainingTime = autoAdvanceTime * (1 - progress / 100);
		startTimeRef.current = Date.now() - (autoAdvanceTime * (progress / 100));
		
		progressIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTimeRef.current;
			const newProgress = Math.min((elapsed / autoAdvanceTime) * 100, 100);
			setProgress(newProgress);
		}, 50);

		autoAdvanceTimeoutRef.current = setTimeout(() => {
			goToNext();
		}, remainingTime);
	}, [autoAdvanceTime, progress, isPaused]);

	// Navigation functions
	const goToNext = useCallback(() => {
		if (isTransitioning) return;
		
		setIsTransitioning(true);
		stopProgress();
		
		setTimeout(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length);
			setIsTransitioning(false);
		}, 150);
	}, [images.length, isTransitioning, stopProgress]);

	const goToPrevious = useCallback(() => {
		if (isTransitioning) return;
		
		setIsTransitioning(true);
		stopProgress();
		
		setTimeout(() => {
			setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
			setIsTransitioning(false);
		}, 150);
	}, [images.length, isTransitioning, stopProgress]);

	const goToStory = useCallback((index: number) => {
		if (isTransitioning || index === currentIndex) return;
		
		setIsTransitioning(true);
		stopProgress();
		
		setTimeout(() => {
			setCurrentIndex(index);
			setIsTransitioning(false);
		}, 150);
	}, [currentIndex, isTransitioning, stopProgress]);

	// Auto-advance logic
	useEffect(() => {
		if (!isPaused && !isTransitioning) {
			startProgress();
		}
		
		return () => {
			stopProgress();
		};
	}, [currentIndex, isPaused, isTransitioning, startProgress, stopProgress]);

	// Audio controls
	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
				setIsPaused(true);
				pauseProgress();
			} else {
				audioRef.current.play();
				setIsPaused(false);
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

	const togglePause = () => {
		setIsPaused(!isPaused);
		if (isPaused) {
			resumeProgress();
		} else {
			pauseProgress();
		}
	};

	// Touch/click handlers
	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault();
	};

	const handleClick = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = rect.width;
		
		if (x < width * 0.3) {
			goToPrevious();
		} else if (x > width * 0.7) {
			goToNext();
		} else {
			togglePause();
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopProgress();
		};
	}, [stopProgress]);

	return (
		<div className="relative w-full max-w-md mx-auto">
			<Card className="overflow-hidden border-0 shadow-2xl bg-black">
				<CardContent className="p-0 relative">
					{/* Progress indicators */}
					<div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-4">
						{images.map((_, index) => (
							<div
								key={index}
								className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
								onClick={() => goToStory(index)}
							>
								<div
									className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
									style={{
										width: index === currentIndex 
											? `${progress}%` 
											: index < currentIndex 
												? '100%' 
												: '0%'
									}}
								/>
							</div>
						))}
					</div>

					{/* Main story content */}
					<div 
						className="relative h-[80vh] min-h-[600px] overflow-hidden cursor-pointer select-none"
						onClick={handleClick}
						onTouchStart={handleTouchStart}
					>
						{/* Background image with transition */}
						<div 
							className={`absolute inset-0 transition-opacity duration-300 ${
								isTransitioning ? 'opacity-0' : 'opacity-100'
							}`}
						>
							<img
								src={images[currentIndex]}
								alt={`Story ${currentIndex + 1}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
						</div>

						{/* Touch zones for navigation (invisible) */}
						<div className="absolute inset-0 flex">
							<div 
								className="flex-1 z-10"
								onClick={(e) => {
									e.stopPropagation();
									goToPrevious();
								}}
							/>
							<div 
								className="flex-1 z-10"
								onClick={(e) => {
									e.stopPropagation();
									togglePause();
								}}
							/>
							<div 
								className="flex-1 z-10"
								onClick={(e) => {
									e.stopPropagation();
									goToNext();
								}}
							/>
						</div>

						{/* Pause indicator */}
						{isPaused && (
							<div className="absolute inset-0 flex items-center justify-center z-15 bg-black/20">
								<div className="bg-black/60 rounded-full p-4">
									<Play className="h-8 w-8 text-white ml-1" />
								</div>
							</div>
						)}
					</div>

					{/* Control buttons */}
					<div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
						<Button
							variant="ghost"
							size="icon"
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
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
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
							onClick={toggleMute}
						>
							{isMuted ? (
								<VolumeX className="h-5 w-5" />
							) : (
								<Volume2 className="h-5 w-5" />
							)}
						</Button>
					</div>

					{/* Navigation controls */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
							onClick={goToPrevious}
						>
							<SkipBack className="h-5 w-5" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
							onClick={togglePause}
						>
							{isPaused ? (
								<Play className="h-5 w-5" />
							) : (
								<Pause className="h-5 w-5" />
							)}
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
							onClick={goToNext}
						>
							<SkipForward className="h-5 w-5" />
						</Button>
					</div>

					{/* Story counter */}
					<div className="absolute bottom-4 right-4 z-20">
						<div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
							{currentIndex + 1} / {images.length}
						</div>
					</div>

					{/* Audio element */}
					<audio ref={audioRef} src={musicUrl} />
				</CardContent>
			</Card>
		</div>
	);
}
