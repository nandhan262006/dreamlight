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

interface Category {
  id: number;
  name: string;
  type: string;
  order: number;
}

function StoryCard({ story }: { story: Story }) {
  const [imgIndex, setImgIndex] = useState(0);
  const total = story.images.length;

  const prev = () => setImgIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setImgIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-5">
        <Image
          src={story.images[imgIndex]?.src || "/gallery1.png"}
          alt={story.images[imgIndex]?.alt || story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {imgIndex + 1}/{total}
        </div>
      </div>

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

export default function StoriesClient({ initialStories, categories }: { initialStories: Story[]; categories: Category[] }) {
  const [activeCat, setActiveCat] = useState("All");

  const allCategories = ["All", ...categories.map((c) => c.name)];

  const filtered =
    activeCat === "All"
      ? initialStories
      : initialStories.filter((s) => s.category === activeCat);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-12 justify-center px-6">
        {allCategories.map((cat) => (
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

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((story, i) => (
            <StoryCard key={i} story={story} />
          ))}
        </div>
      </div>
    </>
  );
}
