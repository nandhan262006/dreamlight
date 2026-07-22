import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamlight Films | Premium Wedding Photography & Cinematic Films",
  description:
    "Ongole's finest wedding photography, travelling across AP, Telangana and worldwide. Wedding photography and cinematic films — capturing authentic emotions, timeless traditions, and memories that last a lifetime.",
  keywords: [
    "wedding photography",
    "cinematic wedding films",
    "wedding videographer",
    "luxury wedding",
    "Dreamlight Films",
  ],
  openGraph: {
    title: "Dreamlight Films | Premium Wedding Photography & Cinematic Films",
    description:
      "Ongole's finest wedding photography, travelling across AP, Telangana and worldwide. Wedding photography and cinematic films — capturing authentic emotions, timeless traditions, and memories that last a lifetime.",
    type: "website",
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
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
