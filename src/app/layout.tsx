import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: "%s | Priyanka Fashionvilla",
    default: "Priyanka Fashionvilla | Luxury Women's Fashion"
  },
  description: "Dresses that move with grace and speak with style. Discover our timeless collection of luxury women's fashion including dresses, kurtis, tops, and more.",
  keywords: ["women fashion", "luxury dresses", "ethnic wear", "kurtis", "designer fashion", "online shopping india"],
  openGraph: {
    title: "Priyanka Fashionvilla | Luxury Women's Fashion",
    description: "Discover our timeless collection of luxury women's fashion.",
    url: '/',
    siteName: 'Priyanka Fashionvilla',
    images: [
      {
        url: '/images/hero-bg.jpg', // Assuming a hero image exists, or uses standard OpenGraph image
        width: 1200,
        height: 630,
        alt: 'Priyanka Fashionvilla Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Priyanka Fashionvilla',
    description: 'Luxury Women\'s Fashion',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-black text-white`}
      >
        {children}
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
