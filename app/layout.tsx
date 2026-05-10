import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroBG | Free Local AI Background Remover",
  description: "Remove image backgrounds instantly and privately directly in your browser. ZeroBG uses local AI processing—no servers, no limits, 100% free. A project by Baroi AI.",
  keywords: [
    "background remover", 
    "remove background free", 
    "local AI image editor", 
    "ZeroBG", 
    "Baroi AI", 
    "private background removal",
    "browser AI",
    "image transparent background"
  ],
  authors: [{ name: "Baroi AI" }],
  creator: "Subhodeep Baroi",
  publisher: "Baroi AI",
  openGraph: {
    title: "ZeroBG - Private & Free Background Remover",
    description: "Instantly remove backgrounds from images using local AI. 100% private, runs entirely in your browser.",
    url: "https://baroi-ai.github.io/zerobg",
    siteName: "ZeroBG",
    images: [
      {
        url: "/logo.png", // Ensure you have your logo.png in the public folder!
        width: 512,
        height: 512,
        alt: "ZeroBG Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}