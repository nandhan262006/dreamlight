"use client";

import Image from "next/image";

interface GalleryPreviewProps {
  images?: { src: string; alt: string }[];
}

export default function GalleryPreview({ images = [] }: GalleryPreviewProps) {
  return (
    <section id="gallery" className="section-gap">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="overline mb-3">Gallery</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
            Recent Work
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-0">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group overflow-hidden aspect-[3/4]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/gallery" className="btn-primary text-xs">
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}
