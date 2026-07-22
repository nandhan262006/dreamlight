import Hero from "@/components/Hero";
import About from "@/components/About";
import GalleryPreview from "@/components/GalleryPreview";
import ServiceCards3D, { serviceList } from "@/components/ServiceCards3D";
import FeaturedStories from "@/components/FeaturedStories";
import ReviewCarousel, { reviewList } from "@/components/ReviewCarousel";
import CTA from "@/components/CTA";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <GalleryPreview />
      <ServiceCards3D services={serviceList} />
      <FeaturedStories />
      <ReviewCarousel reviews={reviewList} />
      <CTA />
      <WhatsAppButton />
    </main>
  );
}
