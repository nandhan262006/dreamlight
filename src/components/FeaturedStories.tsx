"use client";

import { useState } from "react";
import Image from "next/image";

const stories = [
  {
    date: "Mar 15, 2026",
    location: "Hyderabad",
    title: "Ananya &amp; Vikram's Royal Wedding",
    excerpt:
      "A three-day celebration blending tradition and modernity at the iconic Ramoji Film City, capturing every intricate detail from the mehendi to the vidai.",
    images: ["/gallery1.png", "/gallery2.png", "/gallery3.png"],
  },
  {
    date: "Feb 8, 2026",
    location: "Goa",
    title: "Priya &amp; Arjun's Beachside Romance",
    excerpt:
      "An intimate sunset ceremony on the beaches of South Goa, where the Arabian Sea provided a stunning backdrop for this love-filled celebration.",
    images: ["/gallery4.png", "/gallery5.png", "/gallery6.png"],
  },
];

function StoryCard({
  story,
}: {
  story: { date: string; location: string; title: string; excerpt: string; images: string[] };
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const total = story.images.length;

  const prev = () => setImgIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setImgIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-5">
        <Image
          src={story.images[imgIndex]}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
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

        {/* Counter */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {imgIndex + 1}/{total}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] mb-2">
        <span className="text-accent font-semibold">{story.date}</span>
        <span className="text-muted">/</span>
        <span className="text-muted">{story.location}</span>
      </div>
      <h3 className="font-serif text-xl sm:text-2xl text-fg group-hover:text-accent transition-colors mb-2">
        {story.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-2">
        {story.excerpt}
      </p>
    </div>
  );
}

export default function FeaturedStories() {
  return (
    <section id="stories" className="section-gap">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="overline mb-3">Featured Stories</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
            Love Stories We&apos;ve Told
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <StoryCard key={i} story={story} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/stories" className="btn-primary text-xs">
            View All Stories
          </a>
        </div>
      </div>
    </section>
  );
}
