import { Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GalleryPreview from "@/components/GalleryPreview";
import ServiceCardsWithScroll from "@/components/ServiceCardsWithScroll";
import FeaturedStories from "@/components/FeaturedStories";
import ReviewCarousel from "@/components/ReviewCarousel";
import MapSection from "@/components/MapSection";
import CTA from "@/components/CTA";
import StructuredData from "@/components/StructuredData";
import { db } from "@/db";
import { siteSettings, galleryImages, stories, reviews, services } from "@/db/schema";

export const dynamic = "force-dynamic";

const baseUrl = "https://dreamlightfilmsbyharish.in";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${baseUrl}/#business`,
  name: "Dreamlight Films",
  url: baseUrl,
  logo: `${baseUrl}/navibar.png`,
  image: `${baseUrl}/og-image.png`,
  email: "dreamlightfilms69@gmail.com",
  telephone: "+919573466266",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Opp: Sai Saroj Mayuri Theatre, Vamsi Complex, Shop No.5",
    addressLocality: "Ongole",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  priceRange: "$$",
  sameAs: ["https://instagram.com/dreamlightfilms_by_harish"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "21:00",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "Dreamlight Films",
  description:
    "Wedding Photography & Videography in Ongole, Guntur, Vijayawada, and Hyderabad. Candid wedding photographer capturing timeless moments.",
  publisher: { "@id": `${baseUrl}/#business` },
};

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
    <>
      <StructuredData data={localBusinessSchema} />
      <StructuredData data={webSiteSchema} />
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
    </>
  );
}
