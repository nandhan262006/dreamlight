"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/#services" },
  { name: "Stories", href: "/stories" },
  { name: "Reviews", href: "/#reviews" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-sm border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="container-max h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/#home" className="flex items-center group">
          <Image
            src="/navibar.png"
            alt="Dreamlight Films"
            width={120}
            height={30}
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-[0.1em] font-semibold transition-colors ${
                scrolled
                  ? "text-fg/70 hover:text-accent"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="/#contact"
            className={`text-xs btn-primary ${
              scrolled ? "" : "!bg-white !text-fg hover:!bg-accent hover:!text-white"
            }`}
          >
            Book Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1.5px] w-5 transition-all duration-300 ${
              mobileOpen
                ? "rotate-45 translate-y-[5px] bg-fg"
                : scrolled
                  ? "bg-fg"
                  : "bg-white"
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 transition-all duration-300 ${
              mobileOpen
                ? "opacity-0"
                : scrolled
                  ? "bg-fg"
                  : "bg-white"
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 transition-all duration-300 ${
              mobileOpen
                ? "-rotate-45 -translate-y-[5px] bg-fg"
                : scrolled
                  ? "bg-fg"
                  : "bg-white"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-bg/95 backdrop-blur-sm border-b border-border/30 px-6 py-6 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-sm uppercase tracking-[0.1em] font-semibold text-fg/70 hover:text-accent transition-colors"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full mt-4 text-xs"
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}
