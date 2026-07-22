"use client";

import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="section-gap">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/about.png"
              alt="About Dreamlight Films"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Name overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-16">
              <p className="font-serif text-2xl text-white">Harish Gudipudi</p>
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                CEO &amp; Lead Photographer
              </p>
            </div>
          </div>

          {/* Right - content */}
          <div>
            <p className="overline mb-3">About</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg mb-6">
              Capturing Moments That Last Forever
            </h2>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                At Dreamlight Films, we believe every wedding tells a unique
                story. Our passion lies in documenting those authentic,
                unscripted moments that make your love story truly yours.
              </p>
              <p>
                With over 8 years of experience and 500+ weddings captured,
                we&apos;ve honed our craft to blend cinematic storytelling with
                genuine emotion. Every frame is thoughtfully composed, every
                edit carefully crafted.
              </p>
              <p>
                Based in Hyderabad, we travel worldwide to capture love stories
                in the most breathtaking locations. Our approach is
                unobtrusive yet intentional — we don&apos;t just document your
                day, we create art that you&apos;ll cherish for generations.
              </p>
              <p>
                From intimate elopements to grand celebrations, every wedding
                deserves to be remembered. Let us tell your story.
              </p>
            </div>
            <p className="text-sm uppercase tracking-[0.15em] font-semibold text-accent mt-6 mb-6">
              Hyderabad, Telangana &bull; Available Worldwide
            </p>
            <a href="#gallery" className="btn-primary text-xs">
              More About Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
