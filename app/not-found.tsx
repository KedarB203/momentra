import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-primary mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
				<p className="text-muted-foreground mb-8">
					The page you&apos;re looking for doesn&apos;t exist.
				</p>
				<Link
					href="/"
					className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
				>
					Go Back Home
				</Link>
			</div>
		</div>
	);
}
