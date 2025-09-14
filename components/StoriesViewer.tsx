"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX, Maximize, Minimize, Share, RotateCcw } from "lucide-react";

// Typewriter component for animated text
interface TypewriterTextProps {
	text: string;
	cardImage: string;
	className?: string;
	speed?: number;
}

function TypewriterText({ text, cardImage, className = "", speed = 50 }: TypewriterTextProps) {
	const [displayText, setDisplayText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		// Reset when text changes
		setDisplayText("");
		setCurrentIndex(0);
	}, [text]);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(() => {
				setDisplayText(prev => prev + text[currentIndex]);
				setCurrentIndex(prev => prev + 1);
			}, speed);

			return () => clearTimeout(timeout);
		}
	}, [currentIndex, text, speed]);

	// Determine text color based on card image
	const getTextColor = () => {
		if (cardImage.includes('grayCard')) {
			return 'text-black';
		} else if (cardImage.includes('redCard')) {
			return 'text-white';
		} else if (cardImage.includes('pinkCard')) {
			return 'bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent';
		}
		return 'text-white'; // default
	};

	const textColorClass = getTextColor();

	return (
		<p 
			className={`${className} ${textColorClass}`}
			style={{
				animation: 'fadeInUp 0.8s ease-out',
			}}
		>
			{displayText}
			{currentIndex < text.length && (
				<span className="animate-pulse">|</span>
			)}
			<style dangerouslySetInnerHTML={{
				__html: `
					@keyframes fadeInUp {
						from { 
							opacity: 0; 
							transform: translateY(30px); 
						}
						to { 
							opacity: 1; 
							transform: translateY(0); 
						}
					}
				`
			}} />
		</p>
	);
}

interface StoriesViewerProps {
	photos: PhotoRecord[];
	autoAdvanceTime?: number; // in milliseconds
}

interface PhotoRecord {
	id: number | string;
	image_url: string;
	music_url: string;
	created_at?: string;
	card_image?: string;
	image_label_claude?: string;
}

export default function StoriesViewer({
	photos,
	autoAdvanceTime = 5000,
}: StoriesViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isFinished, setIsFinished] = useState(false);

	const audioRef = useRef<HTMLAudioElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(0);

	// Initialize audio and start playing by default
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.loop = true;
			audioRef.current.volume = 0.6;
			audioRef.current.muted = false;
			// Try to start playing audio unmuted
			audioRef.current.play().catch((error) => {
				console.log("Unmuted autoplay prevented, trying muted:", error);
				// If unmuted autoplay fails, try with muted
				if (audioRef.current) {
					audioRef.current.muted = true;
					audioRef.current.play().catch((mutedError) => {
						console.log("All autoplay prevented:", mutedError);
						setIsMuted(true);
					});
				}
			});
		}
	}, []);

	// Update music when photo changes
	useEffect(() => {
		if (photos.length > 0 && audioRef.current) {
			const currentPhoto = photos[currentIndex];
			const newMusicUrl = currentPhoto.music_url;
			
			// Only change music source if it's different from current
			if (audioRef.current.src !== newMusicUrl) {
				audioRef.current.src = newMusicUrl;
			audioRef.current.load();

				// Start playing music for both cards and photos
			if (!isMuted) {
				audioRef.current.play().catch((error) => {
						console.log("Failed to play track:", error);
					});
				}
			} else {
				// Same music source, just ensure it's playing if not muted
				if (!isMuted && audioRef.current.paused) {
					audioRef.current.play().catch((error) => {
						console.log("Failed to resume track:", error);
					});
				}
			}
		}
	}, [currentIndex, photos, isMuted]);


	// Progress tracking
	const startProgress = useCallback(() => {
		if (isPaused) return;

		// Determine if current photo is a card (5 seconds) or regular photo (default time)
		const isCard = photos[currentIndex]?.id?.toString().startsWith('card-');
		const duration = isCard ? 5000 : autoAdvanceTime;

		startTimeRef.current = Date.now();
		setProgress(0);

		progressIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTimeRef.current;
			const newProgress = Math.min((elapsed / duration) * 100, 100);
			setProgress(newProgress);
		}, 50);

		autoAdvanceTimeoutRef.current = setTimeout(() => {
			goToNext();
		}, duration);
	}, [autoAdvanceTime, isPaused, photos, currentIndex]);

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

		// Determine if current photo is a card (5 seconds) or regular photo (default time)
		const isCard = photos[currentIndex]?.id?.toString().startsWith('card-');
		const duration = isCard ? 5000 : autoAdvanceTime;

		const remainingTime = duration * (1 - progress / 100);
		startTimeRef.current = Date.now() - duration * (progress / 100);

		progressIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTimeRef.current;
			const newProgress = Math.min((elapsed / duration) * 100, 100);
			setProgress(newProgress);
		}, 50);

		autoAdvanceTimeoutRef.current = setTimeout(() => {
			goToNext();
		}, remainingTime);
	}, [autoAdvanceTime, progress, isPaused, photos, currentIndex]);

	// Navigation functions
	const goToNext = useCallback(() => {
		if (isTransitioning) return;

		// Check if we're at the last photo
		if (currentIndex === photos.length - 1) {
			setIsFinished(true);
			setIsPaused(true);
			stopProgress();
			return;
		}

		setIsTransitioning(true);
		stopProgress();

		setTimeout(() => {
			setCurrentIndex((prev) => prev + 1);
			setIsTransitioning(false);
		}, 150);
	}, [photos.length, isTransitioning, stopProgress, currentIndex]);

	const goToPrevious = useCallback(() => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		stopProgress();

		setTimeout(() => {
			// If on first story (index 0), stay on first story
			if (currentIndex === 0) {
				setCurrentIndex(0);
			} else {
				setCurrentIndex((prev) => prev - 1);
			}
			setIsTransitioning(false);
		}, 150);
	}, [currentIndex, isTransitioning, stopProgress]);

	const goToStory = useCallback(
		(index: number) => {
			if (isTransitioning || index === currentIndex) return;

			setIsTransitioning(true);
			stopProgress();

			setTimeout(() => {
				setCurrentIndex(index);
				setIsTransitioning(false);
			}, 150);
		},
		[currentIndex, isTransitioning, stopProgress]
	);

	// Auto-advance logic
	useEffect(() => {
		if (!isPaused && !isTransitioning && !isFinished) {
			startProgress();
		}

		return () => {
			stopProgress();
		};
	}, [currentIndex, isPaused, isTransitioning, isFinished, startProgress, stopProgress]);

	const toggleMute = () => {
		if (audioRef.current) {
			if (isMuted) {
				// Unmute and play
				audioRef.current.muted = false;
				audioRef.current.play().catch((error) => {
					console.log("Play failed:", error);
				});
				setIsMuted(false);
			} else {
				// Mute and pause
				audioRef.current.pause();
				audioRef.current.muted = true;
				setIsMuted(true);
			}
		}
	};

	const toggleFullscreen = async () => {
		if (!containerRef.current) return;

		try {
			if (!isFullscreen) {
				// Enter fullscreen - try different APIs for mobile compatibility
				const element = containerRef.current as any;
				
				if (element.requestFullscreen) {
					await element.requestFullscreen();
				} else if (element.webkitRequestFullscreen) {
					// Safari
						await element.webkitRequestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					// Older Safari (capital S)
					await element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					// Firefox
					await element.mozRequestFullScreen();
					} else if (element.msRequestFullscreen) {
					// IE/Edge
						await element.msRequestFullscreen();
				} else {
					// Fallback for mobile browsers that don't support fullscreen API
					console.log("Fullscreen API not supported, using viewport fullscreen");
					setIsFullscreen(true);
					
					// Hide address bar on mobile by scrolling
					if (window.innerHeight < window.outerHeight) {
						setTimeout(() => {
							window.scrollTo(0, 1);
						}, 100);
					}
				}
			} else {
				// Exit fullscreen
				const doc = document as any;
				
				if (doc.exitFullscreen) {
					await doc.exitFullscreen();
				} else if (doc.webkitExitFullscreen) {
						await doc.webkitExitFullscreen();
				} else if (doc.webkitCancelFullScreen) {
					// Older Safari
					await doc.webkitCancelFullScreen();
				} else if (doc.mozCancelFullScreen) {
					// Firefox
					await doc.mozCancelFullScreen();
					} else if (doc.msExitFullscreen) {
					// IE/Edge
						await doc.msExitFullscreen();
				} else {
					// Fallback for browsers without fullscreen API
					setIsFullscreen(false);
				}
			}
		} catch (error) {
			console.log("Fullscreen toggle failed:", error);
			// Fallback: toggle fullscreen state manually
			setIsFullscreen(!isFullscreen);
		}
	};

	// Listen for fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			const doc = document as any;

			const isCurrentlyFullscreen = !!(
				doc.fullscreenElement ||
				doc.webkitFullscreenElement ||
				doc.webkitCurrentFullScreenElement ||
				doc.mozFullScreenElement ||
				doc.msFullscreenElement
			);
			setIsFullscreen(isCurrentlyFullscreen);
		};

		// Add event listeners for all browser variants
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
		document.addEventListener("mozfullscreenchange", handleFullscreenChange);
		document.addEventListener("msfullscreenchange", handleFullscreenChange);

		// Handle orientation changes on mobile
		const handleOrientationChange = () => {
			// Small delay to let orientation change complete
			setTimeout(() => {
				if (isFullscreen) {
					// Ensure we maintain fullscreen-like behavior
					window.scrollTo(0, 1);
				}
			}, 500);
		};

		window.addEventListener("orientationchange", handleOrientationChange);
		window.addEventListener("resize", handleOrientationChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
			document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
			document.removeEventListener("msfullscreenchange", handleFullscreenChange);
			window.removeEventListener("orientationchange", handleOrientationChange);
			window.removeEventListener("resize", handleOrientationChange);
		};
	}, [isFullscreen]);

	const togglePause = () => {
		setIsPaused(!isPaused);
		if (isPaused) {
			resumeProgress();
		} else {
			pauseProgress();
		}
	};

	const handleReplay = () => {
		setCurrentIndex(0);
		setIsFinished(false);
		setIsPaused(false);
		setProgress(0);
	};

	const handleShare = () => {
		// Purely visual for now - no functionality
		console.log("Share button clicked (visual only)");
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
		<div
			ref={containerRef}
			className={`relative ${
				isFullscreen ? "w-screen h-screen fixed inset-0 z-50" : "w-full max-w-md mx-auto"
			}`}
			style={{
				...(isFullscreen && {
					minHeight: '100dvh', // Dynamic viewport height for mobile (fallback to 100vh)
					height: '100dvh',
				})
			}}
		>
			<div
				className={`overflow-hidden border-0 ${
					isFullscreen
						? "rounded-none h-full"
						: "rounded-lg shadow-2xl border-2 border-primary/20"
				}`}
				style={{
					boxShadow: isFullscreen
						? "none"
						: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
				}}
			>
				<div className="relative">
					{/* Progress indicators */}
					<div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-4">
						{photos.map((photo, index) => (
							<div
								key={photo.id}
								className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
								onClick={() => goToStory(index)}
							>
								<div
									className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
									style={{
										width:
											index === currentIndex
												? `${progress}%`
												: index < currentIndex
												? "100%"
												: "0%",
									}}
								/>
							</div>
						))}
					</div>

					{/* Main story content */}
					<div
						className={`relative ${
							isFullscreen ? "h-screen" : "h-[80vh] min-h-[600px]"
						} overflow-hidden cursor-pointer select-none`}
						onClick={handleClick}
						onTouchStart={handleTouchStart}
					>
						{/* Background image with transition */}
						<div
							className={`absolute inset-0 transition-opacity duration-300 ${
								isTransitioning ? "opacity-0" : "opacity-100"
							}`}
						>
							<img
								src={photos[currentIndex]?.image_url}
								alt={`Photo ${photos[currentIndex]?.id}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src =
										"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
							
							{/* Display label on card images with typing animation */}
							{photos[currentIndex]?.id?.toString().startsWith('card-') && photos[currentIndex]?.image_label_claude && (
								<div className="absolute inset-0 flex items-center justify-center z-10">
									<TypewriterText 
										text={photos[currentIndex]?.image_label_claude || ''} 
										cardImage={photos[currentIndex]?.image_url || ''}
										className="text-4xl font-bold text-center max-w-md mx-4 drop-shadow-lg"
									/>
								</div>
							)}
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
						{isPaused && !isFinished && (
							<div className="absolute inset-0 flex items-center justify-center z-15 bg-black/20">
								<div className="bg-black/60 rounded-full p-4">
									<Play className="h-8 w-8 text-white ml-1" />
								</div>
							</div>
						)}

						{/* Finished state - Share and Replay buttons */}
						{isFinished && (
							<div className="absolute inset-0 flex items-center justify-center z-15 bg-black/40 backdrop-blur-sm">
								<div className="flex flex-col items-center space-y-4">
									<div className="text-white text-4xl font-bold mb-4">
										That's a wrap! 🎬
									</div>
									<div className="flex space-x-4">
										<Button
											onClick={handleReplay}
											className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-full flex items-center space-x-2"
										>
											<RotateCcw className="h-5 w-5" />
											<span>Replay</span>
										</Button>
										<Button
											onClick={handleShare}
											className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-full flex items-center space-x-2"
										>
											<Share className="h-5 w-5" />
											<span>Share</span>
										</Button>
									</div>
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
							onClick={toggleMute}
						>
							{isMuted ? (
								<VolumeX className="h-5 w-5" />
							) : (
								<Volume2 className="h-5 w-5" />
							)}
						</Button>
					</div>

					{/* Fullscreen button */}
					<div className="absolute bottom-4 right-4 z-20">
						<Button
							variant="ghost"
							size="icon"
							className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-0 h-10 w-10"
							onClick={toggleFullscreen}
						>
							{isFullscreen ? (
								<Minimize className="h-5 w-5" />
							) : (
								<Maximize className="h-5 w-5" />
							)}
						</Button>
					</div>

					{/* Audio element */}
					<audio ref={audioRef} />
				</div>
			</div>
		</div>
	);
}
