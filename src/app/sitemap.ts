import type { MetadataRoute } from "next";
import { db } from "@/db";
import { galleryImages, stories } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dreamlightfilmsbyharish.in";

  const [galleryData, storiesData] = await Promise.all([
    db.select({ src: galleryImages.src }).from(galleryImages),
    db.select({ id: stories.id, images: stories.images }).from(stories),
  ]);

  const galleryImageUrls = galleryData.map((img) => img.src);

  const storyImageUrls: string[] = [];
  for (const s of storiesData) {
    try {
      const parsed: { src: string }[] = JSON.parse(s.images);
      for (const img of parsed) {
        storyImageUrls.push(img.src);
      }
    } catch {
      // skip unparseable images
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: galleryImageUrls,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: storyImageUrls,
    },
  ];
}
