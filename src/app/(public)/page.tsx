import { Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GalleryPreview from "@/components/GalleryPreview";
import ServiceCardsWithScroll from "@/components/ServiceCardsWithScroll";
import FeaturedStories from "@/components/FeaturedStories";
import ReviewCarousel from "@/components/ReviewCarousel";
import MapSection from "@/components/MapSection";
import CTA from "@/components/CTA";
import { db } from "@/db";
import { siteSettings, galleryImages, stories, reviews, services } from "@/db/schema";

export const dynamic = "force-dynamic";

function SectionSkeleton() {
  return (
    <div className="section-gap">
      <div className="container-max">
        <div className="h-8 w-32 bg-surface-muted rounded mb-4 mx-auto" />
        <div className="h-12 w-64 bg-surface-muted rounded mx-auto" />
      </div>
    </div>
  );
}

export default async function Home() {
  const [settingsRows, galleryData, storiesData, reviewData, serviceData] = await Promise.all([
    db.select().from(siteSettings),
    db.select().from(galleryImages).orderBy(galleryImages.order),
    db.select().from(stories).orderBy(stories.order),
    db.select().from(reviews).orderBy(reviews.order),
    db.select().from(services).orderBy(services.order),
  ]);

  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }
  const featuredGallery = galleryData.filter((img) => img.featured);
  const featuredStories = storiesData.filter((s) => s.featured);

  return (
    <main>
      <Hero
        desktopImage={settings.homeImage || "/home.png"}
        mobileImage={settings.homeMobileImage || "/homemobile.png"}
      />
      <About
        image={settings.aboutImage || "/about.png"}
        title={settings.aboutTitle || "Capturing Moments That Last Forever"}
        description={settings.aboutDescription || "[]"}
        name={settings.aboutName || "Harish Gudipudi"}
        role={settings.aboutRole || "CEO & Lead Photographer"}
        location={settings.aboutLocation || "Hyderabad, Telangana • Available Worldwide"}
      />
      <Suspense fallback={<SectionSkeleton />}>
        <GalleryPreview images={featuredGallery.map((img) => ({ src: img.src, alt: img.alt }))} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ServiceCardsWithScroll
          services={serviceData.map((s) => ({
            id: String(s.id),
            title: s.title,
            description: s.description,
            imageUrl: s.imageUrl,
            category: s.category,
          }))}
        />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedStories
          stories={featuredStories.map((s) => {
            let images: string[] = [];
            try { images = JSON.parse(s.images).map((i: { src: string }) => i.src); } catch { console.error("Failed to parse story images for story", s.id); }
            return {
              date: s.date,
              location: s.location,
              title: s.title,
              excerpt: s.excerpt,
              images,
            };
          })}
        />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ReviewCarousel
          reviews={reviewData.map((r) => ({
            name: r.name,
            text: r.text,
            rating: r.rating,
            date: r.date,
          }))}
        />
      </Suspense>
      <MapSection />
      <CTA />
    </main>
  );
}
