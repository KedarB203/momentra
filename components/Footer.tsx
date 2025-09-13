export default function Footer() {
	return (
		<footer className="w-full border-t bg-background">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-3">
						<h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
							Momentra
						</h3>
						<p className="text-sm text-muted-foreground">
							Capturing life's beautiful moments through images and music.
						</p>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Product</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Features
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Gallery
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Pricing
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Company</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									About
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Blog
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Careers
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Support</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Contact
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-foreground transition-colors">
									Privacy
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-border/50">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
						<p className="text-xs text-muted-foreground">
							© 2024 Momentra. All rights reserved.
						</p>
						<div className="flex space-x-4 text-xs text-muted-foreground">
							<a href="#" className="hover:text-foreground transition-colors">
								Terms
							</a>
							<a href="#" className="hover:text-foreground transition-colors">
								Privacy
							</a>
							<a href="#" className="hover:text-foreground transition-colors">
								Cookies
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
