import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";
import LiveChatWidget from "@/components/chat/LiveChatWidget";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify([
               {
                 "@context": "https://schema.org",
                 "@type": "Organization",
                 "name": "Priyanka Fashionvilla",
                 "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com',
                 "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com'}/images/brand-icon.png`
               },
               {
                 "@context": "https://schema.org",
                 "@type": "ClothingStore",
                 "name": "Priyanka Fashionvilla",
                 "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com'}/images/brand-icon.png`,
                 "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com'}#store`,
                 "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://priyanka-fashionvilla.com',
                 "telephone": "+91 99999 99999",
                 "priceRange": "$$$$",
                 "address": {
                   "@type": "PostalAddress",
                   "streetAddress": "Boring Road Crossing",
                   "addressLocality": "Patna",
                   "addressRegion": "Bihar",
                   "postalCode": "800001",
                   "addressCountry": "IN"
                 },
                 "geo": {
                   "@type": "GeoCoordinates",
                   "latitude": "25.5941",
                   "longitude": "85.1376"
                 },
                 "openingHoursSpecification": {
                   "@type": "OpeningHoursSpecification",
                   "dayOfWeek": [
                     "Monday",
                     "Tuesday",
                     "Wednesday",
                     "Thursday",
                     "Friday",
                     "Saturday",
                     "Sunday"
                   ],
                   "opens": "10:00",
                   "closes": "21:00"
                 }
               }
             ])
          }}
        />
        <CartDrawer />
        <Footer />
        <LiveChatWidget />
      </body>
    </html>
  );
}
