import type { Metadata } from "next";
import { Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	display: "swap",
});

const crimsonText = Crimson_Text({
	variable: "--font-crimson",
	subsets: ["latin"],
	weight: ["400", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Momentra - Capturing Life's Beautiful Moments",
	description:
		"Experience the beauty of life through carefully curated images and ambient sounds",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${playfairDisplay.variable} ${crimsonText.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
