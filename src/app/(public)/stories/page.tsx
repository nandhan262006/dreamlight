import { db } from "@/db";
import { stories, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import StoriesClient from "./StoriesClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Love Stories | Real Wedding Stories",
  description:
    "Read real wedding love stories captured by Dreamlight Films. From royal weddings to beachside romances — see how we tell each couple's unique story.",
  openGraph: {
    title: "Love Stories | Dreamlight Films Real Wedding Stories",
    description:
      "Read real wedding love stories captured by Dreamlight Films. See how we tell each couple's unique story through our lens.",
  },
};

export default async function StoriesPage() {
  const [storiesData, categoriesData] = await Promise.all([
    db.select().from(stories).orderBy(stories.order),
    db.select().from(categories).where(eq(categories.type, "stories")).orderBy(categories.order),
  ]);

  const parsedStories = storiesData.map((s) => {
    let images: { src: string; alt: string }[] = [];
    try { images = JSON.parse(s.images); } catch { console.error("Failed to parse images for story", s.id); }
    return {
      date: s.date,
      location: s.location,
      title: s.title,
      excerpt: s.excerpt,
      images,
      category: s.category,
    };
  });

  return (
    <main className="min-h-screen bg-bg">
      <div className="pt-28 pb-12 text-center">
        <p className="overline mb-3">Stories</p>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
          Love Stories We&apos;ve Told
        </h1>
      </div>
      <StoriesClient initialStories={parsedStories} categories={categoriesData} />
    </main>
  );
}
