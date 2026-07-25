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
  metadataBase: new URL("https://dreamlight-nine.vercel.app"),
  title: "Dreamlight Films | Wedding Photography & Videography in Ongole",
  description:
    "Professional wedding photography and videography in Ongole, Guntur, Vijayawada, and Hyderabad. Capturing authentic emotions, timeless traditions, and cinematic memories.",
  keywords: [
    "wedding photography",
    "wedding videography",
    "photographer in Ongole",
    "photographer in Guntur",
    "photographer in Vijayawada",
    "photographer in Hyderabad",
    "Dreamlight Films",
  ],
  openGraph: {
    title: "Dreamlight Films | Wedding Photography & Videography in Ongole",
    description:
      "Professional wedding photography and videography in Ongole, Guntur, Vijayawada, and Hyderabad. Capturing authentic emotions, timeless traditions, and cinematic memories.",
    type: "website",
    siteName: "Dreamlight Films",
    images: [{ url: "/og-image.png", width: 1540, height: 1021 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamlight Films | Wedding Photography & Videography in Ongole",
    description:
      "Professional wedding photography and videography in Ongole, Guntur, Vijayawada, and Hyderabad.",
    images: ["/og-image.png"],
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
