import Hero from "@/components/Hero";
import About from "@/components/About";
import GalleryPreview from "@/components/GalleryPreview";
import ServiceCardsWithScroll from "@/components/ServiceCardsWithScroll";
import FeaturedStories from "@/components/FeaturedStories";
import ReviewCarousel from "@/components/ReviewCarousel";
import CTA from "@/components/CTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import { db } from "@/db";
import { siteSettings, galleryImages, stories, reviews, services } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settingsRows = await db.select().from(siteSettings);
  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  const galleryData = await db.select().from(galleryImages).orderBy(galleryImages.order);
  const featuredGallery = galleryData.filter((img) => img.featured);

  const storiesData = await db.select().from(stories).orderBy(stories.order);
  const featuredStories = storiesData.filter((s) => s.featured);

  const reviewData = await db.select().from(reviews).orderBy(reviews.order);

  const serviceData = await db.select().from(services).orderBy(services.order);

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
      <GalleryPreview images={featuredGallery.map((img) => ({ src: img.src, alt: img.alt }))} />
      <ServiceCardsWithScroll
        services={serviceData.map((s) => ({
          id: String(s.id),
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl,
          category: s.category,
        }))}
      />
      <FeaturedStories
        stories={featuredStories.map((s) => {
          let images: string[] = [];
          try { images = JSON.parse(s.images).map((i: { src: string }) => i.src); } catch {}
          return {
            date: s.date,
            location: s.location,
            title: s.title,
            excerpt: s.excerpt,
            images,
          };
        })}
      />
      <ReviewCarousel
        reviews={reviewData.map((r) => ({
          name: r.name,
          text: r.text,
          rating: r.rating,
          date: r.date,
        }))}
      />
      <CTA />
      <WhatsAppButton />
    </main>
  );
}
