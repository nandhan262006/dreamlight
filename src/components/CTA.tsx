"use client";

export default function CTA() {
  return (
    <section id="contact" className="bg-fg section-gap">
      <div className="container-max text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-bg mb-4">
          Let&apos;s Create Something Beautiful
        </h2>
        <p className="text-sm text-bg/50 leading-relaxed mb-8">
          Ready to capture your love story? Reach out and let&apos;s discuss your
          vision over a cup of coffee.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="https://wa.me/919573466266"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline !border-accent !text-accent hover:!bg-accent hover:!text-white text-xs"
          >
            WhatsApp Me
          </a>
          <a href="#contact" className="btn-outline !border-bg !text-bg hover:!bg-bg hover:!text-fg text-xs">
            Send a Message
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-bg/70 text-sm">
          <a
            href="https://instagram.com/dreamlightfilms_by_harish"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            &#64;dreamlightfilms_by_harish
          </a>
          <a href="tel:+919573466266" className="hover:text-accent transition-colors">
            &#9742; +91 95734 66266
          </a>
          <span>
            &#9993; dreamlightfilms69@gmail.com
          </span>
        </div>
      </div>
    </section>
  );
}
