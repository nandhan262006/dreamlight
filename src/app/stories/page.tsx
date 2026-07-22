"use client";

import { useState } from "react";
import Image from "next/image";

interface StoryImage {
  src: string;
  alt: string;
}

interface Story {
  date: string;
  location: string;
  title: string;
  excerpt: string;
  images: StoryImage[];
  category: string;
}

const allStories: Story[] = [
  {
    date: "Mar 15, 2026",
    location: "Hyderabad",
    title: "Ananya & Vikram's Royal Wedding",
    excerpt:
      "A three-day celebration blending tradition and modernity at the iconic Ramoji Film City, capturing every intricate detail from the mehendi to the vidai.",
    images: [
      { src: "/gallery1.png", alt: "Wedding ceremony" },
      { src: "/gallery2.png", alt: "Bride portrait" },
      { src: "/gallery3.png", alt: "Mandap decor" },
    ],
    category: "Wedding",
  },
  {
    date: "Feb 8, 2026",
    location: "Goa",
    title: "Priya & Arjun's Beachside Romance",
    excerpt:
      "An intimate sunset ceremony on the beaches of South Goa, where the Arabian Sea provided a stunning backdrop for this love-filled celebration.",
    images: [
      { src: "/gallery4.png", alt: "Beach ceremony" },
      { src: "/gallery5.png", alt: "Couple on beach" },
      { src: "/gallery6.png", alt: "Sunset portrait" },
    ],
    category: "Destination",
  },
  {
    date: "Jan 20, 2026",
    location: "Hyderabad",
    title: "Neha & Rahul's Traditional Elegance",
    excerpt:
      "A beautifully curated traditional wedding filled with vibrant colors, rich fabrics, and heartfelt rituals.",
    images: [
      { src: "/gallery7.png", alt: "Traditional ceremony" },
      { src: "/gallery.png", alt: "Bridal portrait" },
      { src: "/gallery2.png", alt: "Decor details" },
    ],
    category: "Wedding",
  },
  {
    date: "Dec 5, 2025",
    location: "Udaipur",
    title: "Kavita & Rohan's Palace Affair",
    excerpt:
      "A fairytale wedding at a lakeside palace in Udaipur, where royal architecture met modern romance.",
    images: [
      { src: "/gallery3.png", alt: "Palace venue" },
      { src: "/gallery4.png", alt: "Couple portrait" },
      { src: "/gallery5.png", alt: "Evening celebration" },
    ],
    category: "Destination",
  },
  {
    date: "Nov 18, 2025",
    location: "Hyderabad",
    title: "Deepa & Suresh's Intimate Gathering",
    excerpt:
      "An intimate backyard wedding that proved love needs no grand stage — just the right people and authentic emotions.",
    images: [
      { src: "/gallery6.png", alt: "Intimate ceremony" },
      { src: "/gallery7.png", alt: "Family portrait" },
      { src: "/gallery1.png", alt: "Candid moments" },
    ],
    category: "Intimate",
  },
  {
    date: "Oct 22, 2025",
    location: "Kerala",
    title: "Meera & Aravind's Backwaters Story",
    excerpt:
      "A serene wedding set against the tranquil backwaters of Kerala, with houseboats and lush greenery framing every moment.",
    images: [
      { src: "/gallery.png", alt: "Backwaters setup" },
      { src: "/gallery3.png", alt: "Boat portrait" },
      { src: "/gallery6.png", alt: "Nature backdrop" },
    ],
    category: "Destination",
  },
];

const categories = ["All", "Wedding", "Destination", "Intimate"];

function StoryCard({ story, index }: { story: Story; index: number }) {
  const [imgIndex, setImgIndex] = useState(0);
  const total = story.images.length;

  const prev = () => setImgIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setImgIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div key={index} className="group">
      {/* Image slider */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-5">
        <Image
          src={story.images[imgIndex].src}
          alt={story.images[imgIndex].alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Nav arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {story.images.map((_, di) => (
            <button
              key={di}
              onClick={(e) => { e.stopPropagation(); setImgIndex(di); }}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                di === imgIndex ? "bg-white scale-110" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Image counter */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {imgIndex + 1}/{total}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] mb-2">
        <span className="text-accent font-semibold">{story.date}</span>
        <span className="text-muted">/</span>
        <span className="text-muted">{story.location}</span>
      </div>
      <h3 className="font-serif text-xl text-fg group-hover:text-accent transition-colors mb-2">
        {story.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-3">
        {story.excerpt}
      </p>
    </div>
  );
}

export default function StoriesPage() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered =
    activeCat === "All"
      ? allStories
      : allStories.filter((s) => s.category === activeCat);

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <div className="pt-28 pb-12 text-center">
        <p className="overline mb-3">Stories</p>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
          Love Stories We&apos;ve Told
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.1em] font-semibold rounded-full border transition-all cursor-pointer ${
              activeCat === cat
                ? "bg-accent text-white border-accent"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((story, i) => (
            <StoryCard key={i} story={story} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
