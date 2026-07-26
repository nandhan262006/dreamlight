import { db } from "./index";
import { siteSettings, galleryImages, stories, reviews, services, categories } from "./schema";

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(reviews);
  await db.delete(stories);
  await db.delete(services);
  await db.delete(galleryImages);
  await db.delete(categories);
  await db.delete(siteSettings);

  console.log("Seeding database...");

  const defaultCategories = [
    { name: "Wedding", type: "gallery", order: 0 },
    { name: "Portrait", type: "gallery", order: 1 },
    { name: "Couple", type: "gallery", order: 2 },
    { name: "Details", type: "gallery", order: 3 },
    { name: "Wedding", type: "stories", order: 0 },
    { name: "Destination", type: "stories", order: 1 },
    { name: "Intimate", type: "stories", order: 2 },
    { name: "Photography", type: "services", order: 0 },
    { name: "Videography", type: "services", order: 1 },
    { name: "Editing", type: "services", order: 2 },
  ];

  for (const cat of defaultCategories) {
    await db.insert(categories).values(cat);
  }

  const settings = [
    { key: "homeImage", value: "/home.png" },
    { key: "homeMobileImage", value: "/homemobile.png" },
    { key: "aboutImage", value: "/about.png" },
    { key: "aboutTitle", value: "Capturing Moments That Last Forever" },
    { key: "aboutDescription", value: JSON.stringify([
      "At Dreamlight Films, we believe every wedding tells a unique story. Our passion lies in documenting those authentic, unscripted moments that make your love story truly yours.",
      "With over 8 years of experience and 500+ weddings captured, we've honed our craft to blend cinematic storytelling with genuine emotion. Every frame is thoughtfully composed, every edit carefully crafted.",
      "Based in Hyderabad, we travel worldwide to capture love stories in the most breathtaking locations. Our approach is unobtrusive yet intentional — we don't just document your day, we create art that you'll cherish for generations.",
      "From intimate elopements to grand celebrations, every wedding deserves to be remembered. Let us tell your story."
    ])},
    { key: "aboutName", value: "Harish Gudipudi" },
    { key: "aboutRole", value: "CEO & Lead Photographer" },
    { key: "aboutLocation", value: "Hyderabad, Telangana • Available Worldwide" },
  ];

  for (const s of settings) {
    await db.insert(siteSettings).values(s).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: s.value },
    });
  }

  const galleryData = [
    { src: "/gallery1.png", alt: "Wedding ceremony portrait", category: "Wedding", title: "Sacred Union", featured: true, order: 0 },
    { src: "/gallery2.png", alt: "Bride closeup", category: "Portrait", title: "Radiant Smile", featured: true, order: 1 },
    { src: "/gallery3.png", alt: "Couple embrace", category: "Couple", title: "Eternal Bond", featured: true, order: 2 },
    { src: "/gallery4.png", alt: "Wedding decor details", category: "Details", title: "Golden Elegance", featured: false, order: 3 },
    { src: "/gallery5.png", alt: "Reception celebration", category: "Wedding", title: "Celebration", featured: true, order: 4 },
    { src: "/gallery6.png", alt: "First dance moment", category: "Couple", title: "First Dance", featured: true, order: 5 },
    { src: "/gallery7.png", alt: "Bridal jewelry details", category: "Details", title: "Heirloom", featured: false, order: 6 },
    { src: "/gallery1.png", alt: "Ceremony highlights", category: "Wedding", title: "Sacred Vows", featured: true, order: 7 },
    { src: "/gallery3.png", alt: "Golden hour portrait", category: "Portrait", title: "Golden Hour", featured: false, order: 8 },
  ];

  for (const img of galleryData) {
    await db.insert(galleryImages).values(img);
  }

  const storiesData = [
    {
      date: "Mar 15, 2026", location: "Hyderabad", title: "Ananya & Vikram's Royal Wedding",
      excerpt: "A three-day celebration blending tradition and modernity at the iconic Ramoji Film City, capturing every intricate detail from the mehendi to the vidai.",
      category: "Wedding", featured: true, order: 0,
      images: JSON.stringify([{ src: "/gallery1.png", alt: "Wedding ceremony" }, { src: "/gallery2.png", alt: "Bride portrait" }, { src: "/gallery3.png", alt: "Mandap decor" }]),
    },
    {
      date: "Feb 8, 2026", location: "Goa", title: "Priya & Arjun's Beachside Romance",
      excerpt: "An intimate sunset ceremony on the beaches of South Goa, where the Arabian Sea provided a stunning backdrop for this love-filled celebration.",
      category: "Destination", featured: true, order: 1,
      images: JSON.stringify([{ src: "/gallery4.png", alt: "Beach ceremony" }, { src: "/gallery5.png", alt: "Couple on beach" }, { src: "/gallery6.png", alt: "Sunset portrait" }]),
    },
    {
      date: "Jan 20, 2026", location: "Hyderabad", title: "Neha & Rahul's Traditional Elegance",
      excerpt: "A beautifully curated traditional wedding filled with vibrant colors, rich fabrics, and heartfelt rituals.",
      category: "Wedding", featured: false, order: 2,
      images: JSON.stringify([{ src: "/gallery7.png", alt: "Traditional ceremony" }, { src: "/gallery1.png", alt: "Bridal portrait" }, { src: "/gallery2.png", alt: "Decor details" }]),
    },
    {
      date: "Dec 5, 2025", location: "Udaipur", title: "Kavita & Rohan's Palace Affair",
      excerpt: "A fairytale wedding at a lakeside palace in Udaipur, where royal architecture met modern romance.",
      category: "Destination", featured: false, order: 3,
      images: JSON.stringify([{ src: "/gallery3.png", alt: "Palace venue" }, { src: "/gallery4.png", alt: "Couple portrait" }, { src: "/gallery5.png", alt: "Evening celebration" }]),
    },
    {
      date: "Nov 18, 2025", location: "Hyderabad", title: "Deepa & Suresh's Intimate Gathering",
      excerpt: "An intimate backyard wedding that proved love needs no grand stage — just the right people and authentic emotions.",
      category: "Intimate", featured: false, order: 4,
      images: JSON.stringify([{ src: "/gallery6.png", alt: "Intimate ceremony" }, { src: "/gallery7.png", alt: "Family portrait" }, { src: "/gallery1.png", alt: "Candid moments" }]),
    },
    {
      date: "Oct 22, 2025", location: "Kerala", title: "Meera & Aravind's Backwaters Story",
      excerpt: "A serene wedding set against the tranquil backwaters of Kerala, with houseboats and lush greenery framing every moment.",
      category: "Destination", featured: false, order: 5,
      images: JSON.stringify([{ src: "/gallery1.png", alt: "Backwaters setup" }, { src: "/gallery3.png", alt: "Boat portrait" }, { src: "/gallery6.png", alt: "Nature backdrop" }]),
    },
  ];

  for (const story of storiesData) {
    await db.insert(stories).values(story);
  }

  const reviewsData = [
    { name: "Priya Sharma", text: "Dreamlight Films captured our wedding absolutely perfectly. Every time we watch our film, we relive the emotions of that day. Harish and his team were professional, unobtrusive, and genuinely cared about getting every detail right.", rating: 5, date: "2 months ago", order: 0 },
    { name: "Ananya Reddy", text: "The cinematic quality of our wedding film is beyond what we imagined. The drone shots, the editing, the music — everything came together beautifully. Thank you for preserving our memories so artfully.", rating: 5, date: "1 month ago", order: 1 },
    { name: "Neha Patel", text: "From the first consultation to the final delivery, the experience was seamless. Harish has an incredible eye for detail and a gift for capturing genuine emotions. Our family still watches the film every weekend!", rating: 5, date: "3 months ago", order: 2 },
    { name: "Kavita Singh", text: "We chose Dreamlight Films for our destination wedding and it was the best decision. They traveled with us, understood our vision, and delivered a film that takes our breath away every single time.", rating: 5, date: "2 weeks ago", order: 3 },
    { name: "Ritu Verma", text: "The pre-wedding shoot was an experience in itself! Harish made us feel so comfortable in front of the camera, and the results were stunning. Our wedding film was equally magical. Highly recommended!", rating: 5, date: "1 month ago", order: 4 },
    { name: "Deepa Iyer", text: "I cannot recommend Dreamlight Films enough. The team's dedication to their craft is evident in every frame. They didn't just document our wedding — they created a work of art that our family will treasure forever.", rating: 5, date: "2 months ago", order: 5 },
  ];

  for (const review of reviewsData) {
    await db.insert(reviews).values(review);
  }

  const servicesData = [
    { title: "Wedding Photography", description: "Cinematic coverage of your entire wedding day, from preparation to the final dance.", imageUrl: "/gallery1.png", category: "Photography", order: 0 },
    { title: "Pre-Wedding Shoots", description: "Romantic storytelling sessions at breathtaking locations before the big day.", imageUrl: "/gallery2.png", category: "Photography", order: 1 },
    { title: "Portrait Sessions", description: "Professional portraits that capture your personality with artistic lighting.", imageUrl: "/gallery3.png", category: "Photography", order: 2 },
    { title: "Event Coverage", description: "Live-event photography for engagements, anniversaries, and celebrations.", imageUrl: "/gallery4.png", category: "Photography", order: 3 },
    { title: "Maternity & Newborn", description: "Heartwarming maternity and newborn sessions preserving life's earliest moments.", imageUrl: "/gallery7.png", category: "Photography", order: 4 },
  ];

  for (const service of servicesData) {
    await db.insert(services).values(service);
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
