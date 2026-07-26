import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamlightfilmsbyharish.in"),
  title: {
    default: "Dreamlight Films | Wedding Photography & Videography in Ongole",
    template: "%s | Dreamlight Films",
  },
  description:
    "Professional wedding photography and videography by Dreamlight Films. Serving Ongole, Guntur, Vijayawada, and Hyderabad. Cinematic storytelling, authentic emotions, timeless memories.",
  keywords: [
    "wedding photography",
    "wedding videography",
    "candid wedding photographer",
    "pre-wedding shoot",
    "photographer in Ongole",
    "photographer in Guntur",
    "photographer in Vijayawada",
    "photographer in Hyderabad",
    "Dreamlight Films",
    "best wedding photographer Ongole",
    "wedding cinematography",
  ],
  creator: "Dreamlight Films",
  publisher: "Dreamlight Films",
  category: "Photography",
  alternates: {
    canonical: "https://dreamlightfilmsbyharish.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Dreamlight Films | Wedding Photography & Videography in Ongole",
    description:
      "Professional wedding photography and videography by Dreamlight Films. Cinematic storytelling, authentic emotions, timeless memories.",
    url: "https://dreamlightfilmsbyharish.in",
    siteName: "Dreamlight Films",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1540,
        height: 1021,
        alt: "Dreamlight Films - Wedding Photography & Videography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamlight Films | Wedding Photography & Videography",
    description:
      "Professional wedding photography and videography by Dreamlight Films. Capturing authentic emotions and timeless memories.",
    images: ["/og-image.png"],
    creator: "@dreamlightfilms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} antialiased`}>
      <body className="bg-bg text-fg font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
