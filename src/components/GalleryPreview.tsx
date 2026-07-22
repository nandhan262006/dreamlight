"use client";

import Image from "next/image";

const galleryImages = [
  { src: "/gallery1.png", alt: "Wedding ceremony portrait", category: "Wedding", title: "Sacred Union" },
  { src: "/gallery2.png", alt: "Bride closeup", category: "Portrait", title: "Radiant Smile" },
  { src: "/gallery3.png", alt: "Couple embrace", category: "Couple", title: "Eternal Bond" },
  { src: "/gallery4.png", alt: "Wedding decor details", category: "Details", title: "Golden Elegance" },
  { src: "/gallery5.png", alt: "Reception celebration", category: "Wedding", title: "Celebration" },
  { src: "/gallery6.png", alt: "First dance moment", category: "Couple", title: "First Dance" },
  { src: "/gallery7.png", alt: "Bridal jewelry details", category: "Details", title: "Heirloom" },
  { src: "/gallery.png", alt: "Ceremony highlights", category: "Wedding", title: "Sacred Vows" },
  { src: "/gallery3.png", alt: "Golden hour portrait", category: "Portrait", title: "Golden Hour" },
];

export default function GalleryPreview() {
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
          {galleryImages.map((img, i) => (
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
