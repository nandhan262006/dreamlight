"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  title: string;
}

interface Category {
  id: number;
  name: string;
  type: string;
  order: number;
}

export default function GalleryClient({ initialImages, categories }: { initialImages: GalleryImage[]; categories: Category[] }) {
  const [activeCat, setActiveCat] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const allCategories = ["All", ...categories.map((c) => c.name)];

  const filtered =
    activeCat === "All"
      ? initialImages
      : initialImages.filter((img) => img.category === activeCat);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-10 justify-center px-6">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <p className="text-accent text-xs uppercase tracking-[0.1em] font-semibold">
                {img.category}
              </p>
              <p className="text-white font-serif text-lg">{img.title}</p>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-accent transition-colors cursor-pointer z-10"
          >
            &times;
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={1600}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-accent text-xs uppercase tracking-[0.1em] font-semibold">
                {filtered[lightbox].category}
              </p>
              <p className="text-white font-serif text-xl">
                {filtered[lightbox].title}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox > 0 ? lightbox - 1 : filtered.length - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-accent text-4xl transition-colors cursor-pointer"
          >
            &#8249;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox < filtered.length - 1 ? lightbox + 1 : 0
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-accent text-4xl transition-colors cursor-pointer"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
