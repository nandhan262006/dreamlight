import { db } from "@/db";
import { galleryImages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import GalleryClient from "./GalleryClient";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const baseUrl = "https://dreamlightfilmsbyharish.in";

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: `${baseUrl}/gallery`,
      },
    ],
  };

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Wedding Photography Portfolio",
    description:
      "Wedding photography portfolio by Dreamlight Films — candid moments, bridal portraits, and cinematic shots.",
    url: `${baseUrl}/gallery`,
    associatedMedia: galleryData.map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.src,
      name: img.title || img.alt,
      caption: img.alt,
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={imageGallerySchema} />
      <main className="min-h-screen bg-bg">
        <div className="pt-28 pb-12 text-center">
          <p className="overline mb-3">Gallery</p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
            Our Portfolio
          </h1>
        </div>
        <GalleryClient initialImages={images} categories={categoriesData} />
      </main>
    </>
  );
}
