import { db } from "@/db";
import { galleryImages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | Wedding Photography Portfolio",
  description:
    "Browse our wedding photography portfolio — candid moments, bridal portraits, decor details, and cinematic shots from real weddings across Ongole, Guntur, and Hyderabad.",
  openGraph: {
    title: "Gallery | Dreamlight Films Wedding Photography Portfolio",
    description:
      "Browse our wedding photography portfolio — candid moments, bridal portraits, decor details, and cinematic shots from real weddings.",
  },
};

export default async function GalleryPage() {
  const [galleryData, categoriesData] = await Promise.all([
    db.select().from(galleryImages).orderBy(galleryImages.order),
    db.select().from(categories).where(eq(categories.type, "gallery")).orderBy(categories.order),
  ]);

  const images = galleryData.map((img) => ({
    src: img.src,
    alt: img.alt,
    category: img.category,
    title: img.title,
  }));

  return (
    <main className="min-h-screen bg-bg">
      <div className="pt-28 pb-12 text-center">
        <p className="overline mb-3">Gallery</p>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
          Our Portfolio
        </h1>
      </div>
      <GalleryClient initialImages={images} categories={categoriesData} />
    </main>
  );
}
