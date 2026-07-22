"use client";

import Link from "next/link";
import Image from "next/image";

const pages = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Services", href: "/#services" },
  { name: "Stories", href: "/#stories" },
  { name: "Reviews", href: "/#reviews" },
  { name: "Contact", href: "/#contact" },
];

const services = [
  "Wedding Photography",
  "Pre-Wedding Shoots",
  "Portrait Sessions",
  "Event Coverage",
  "Maternity & Newborn",
];

export default function Footer() {
  return (
    <footer className="bg-fg text-bg/60">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/navibar.png"
              alt="Dreamlight Films"
              width={120}
              height={30}
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed">
              Capturing authentic emotions, timeless traditions, and cinematic
              memories that last a lifetime.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-bg mb-4">
              Pages
            </h4>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.name}>
                  <Link
                    href={page.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-bg mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-bg mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:dreamlightfilms69@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  dreamlightfilms69@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919573466266"
                  className="hover:text-accent transition-colors"
                >
                  +91 95734 66266
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/dreamlightfilms_by_harish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-bg/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-bg/40">
          <p>&copy; {new Date().getFullYear()} Dreamlight Films. All rights reserved.</p>
          <p>Hyderabad, Telangana &bull; Available Worldwide</p>
        </div>
      </div>
    </footer>
  );
}
