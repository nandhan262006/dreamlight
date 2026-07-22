"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: "easeOut" as const },
  },
});

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background - Desktop */}
      <Image
        src="/home.png"
        alt="Wedding photography hero"
        fill
        preload
        className="object-cover hidden md:block"
        sizes="100vw"
      />
      {/* Background - Mobile */}
      <Image
        src="/homemobile.png"
        alt="Wedding photography hero"
        fill
        className="object-cover block md:hidden"
        sizes="100vw"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Decorative frame corners - hidden on small mobile */}
      <div className="hidden sm:block absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/20 z-10" />
      <div className="hidden sm:block absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/20 z-10" />
      <div className="hidden sm:block absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/20 z-10" />
      <div className="hidden sm:block absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/20 z-10" />

      {/* Floating gold diamond */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-1/4 right-[15%] z-10"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="text-accent/40 animate-pulse"
        >
          <polygon
            points="20,2 38,20 20,38 2,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 lg:px-16 -mt-16">
        {/* Overline */}
        <motion.div
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-6 sm:w-8 bg-accent/60" />
          <span className="text-accent text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
            Wedding Photography &amp; Cinematic Films
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={fadeUp(0.4)}
          initial="hidden"
          animate="visible"
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight"
        >
          Every Love Story
          <br />
          <span className="text-accent">Deserves to Be Told</span>
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-3 my-6 origin-left"
        >
          <span className="h-px w-10 sm:w-12 bg-white/20" />
          <svg width="16" height="16" viewBox="0 0 40 40" className="text-accent">
            <polygon points="20,4 36,20 20,36 4,20" fill="currentColor" />
          </svg>
          <span className="h-px w-10 sm:w-12 bg-white/20" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(0.8)}
          initial="hidden"
          animate="visible"
          className="text-white/70 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8"
        >
          Capturing authentic emotions, timeless traditions, and cinematic
          memories — from Hyderabad to destinations worldwide.
        </motion.p>

        {/* Location */}
        <motion.p
          variants={fadeUp(1.0)}
          initial="hidden"
          animate="visible"
          className="text-white/60 text-xs uppercase tracking-[0.25em] mb-8"
        >
          Hyderabad &bull; Telangana &bull; Worldwide
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp(1.2)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <a
            href="/#gallery"
            className="btn-primary !bg-accent !text-white hover:!bg-accent-light border-0 text-xs px-8 py-3.5 rounded-none"
          >
            View Gallery
          </a>
          <a
            href="/#contact"
            className="btn-outline !border-white/40 !text-white hover:!bg-white hover:!text-fg text-xs px-8 py-3.5 rounded-none"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ y: [-8, 40] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-2 bg-accent/80 rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
