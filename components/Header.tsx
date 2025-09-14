import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
	return (
		<header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center space-x-4">
						<Image
							src="/logo.png"
							alt="Momentra Logo"
							width={40}
							height={40}
							className="rounded-md"
							quality={100}
							priority
						/>
						<h1 className="text-2xl font-bold text-primary">Momentra</h1>
					</div>

					<nav className="hidden md:flex items-center space-x-6">
						<a
							href="#"
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							Home
						</a>
						<a
							href="#"
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							Gallery
						</a>
						<a
							href="#"
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							About
						</a>
					</nav>

					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="sm">
							Sign In
						</Button>
						<Button size="sm" className="bg-primary hover:bg-primary/90">
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
