"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ServiceCards3DProps {
  services: Service[];
}

function getCardStyle(offset: number) {
  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset > 0 ? 1 : -1;
  return {
    x: sign * abs * 120,
    z: abs === 0 ? 200 : abs === 1 ? 50 : -200,
    rotateY: -offset * 25,
    scale: Math.max(0.4, 1 - abs * 0.12),
    opacity: Math.max(0.1, 1 - abs * 0.3),
  };
}

const fallbackGradients = [
  "linear-gradient(135deg, #2c1810, #1a0f0a)",
  "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
  "linear-gradient(135deg, #1e2d1e, #0f1a0f)",
  "linear-gradient(135deg, #2e1a1a, #1a0f0f)",
  "linear-gradient(135deg, #1a2d2e, #0f1a1a)",
];

const serviceList: Service[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    description:
      "Cinematic coverage of your entire wedding day, from preparation to the final dance.",
    imageUrl: "/gallery1.png",
  },
  {
    id: "prewedding",
    title: "Pre-Wedding Shoots",
    description:
      "Romantic storytelling sessions at breathtaking locations before the big day.",
    imageUrl: "/gallery2.png",
  },
  {
    id: "portrait",
    title: "Portrait Sessions",
    description:
      "Professional portraits that capture your personality with artistic lighting.",
    imageUrl: "/gallery3.png",
  },
  {
    id: "events",
    title: "Event Coverage",
    description:
      "Live-event photography for engagements, anniversaries, and celebrations.",
    imageUrl: "/gallery4.png",
  },
  {
    id: "maternity",
    title: "Maternity & Newborn",
    description:
      "Heartwarming maternity and newborn sessions preserving life's earliest moments.",
    imageUrl: "/gallery5.png",
  },
];

function ServiceCards3D({ services }: ServiceCards3DProps) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const dragging = useRef(false);
  const wheelAccum = useRef(0);

  const clamped = useCallback(
    (i: number) => Math.max(0, Math.min(i, services.length - 1)),
    [services.length]
  );

  const goNext = useCallback(
    () => setActive((a) => clamped(a + 1)),
    [clamped]
  );

  const goPrev = useCallback(
    () => setActive((a) => clamped(a - 1)),
    [clamped]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const delta = dragStart.current - e.clientX;
      if (delta > 60) { goNext(); dragging.current = false; }
      else if (delta < -60) { goPrev(); dragging.current = false; }
    },
    [goNext, goPrev]
  );

  const handlePointerUp = useCallback(() => { dragging.current = false; }, []);
  const handlePointerLeave = useCallback(() => { dragging.current = false; }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum.current += e.deltaY;
      if (wheelAccum.current > 80) { goNext(); wheelAccum.current = 0; }
      else if (wheelAccum.current < -80) { goPrev(); wheelAccum.current = 0; }
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <section id="services" className="bg-surface-muted section-gap overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="overline mb-3">Services</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
            What I Offer
          </h2>
        </div>

        <div
          ref={containerRef}
          className="relative h-[420px] sm:h-[500px] md:h-[600px] mx-auto select-none"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            {services.map((service, i) => {
              const offset = i - active;
              const { x, z, rotateY, scale, opacity } = getCardStyle(offset);
              const zIndex = services.length - Math.abs(offset);

              return (
                <div
                  key={service.id}
                  onClick={() => setActive(clamped(i))}
                  className="absolute w-[240px] sm:w-[280px] md:w-[340px] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: "all 500ms ease-out",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.imageUrl})` }}
                  />
                  <div
                    className="absolute inset-0 -z-[1]"
                    style={{ background: fallbackGradients[i % fallbackGradients.length] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                    <h3 className="font-serif text-xl sm:text-2xl text-white">{service.title}</h3>
                    <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(clamped(i))}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? "bg-accent scale-125"
                  : "bg-border hover:bg-muted"
              }`}
              style={{ width: "10px", height: "10px" }}
              aria-label={`Go to service ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { type Service, serviceList };
export default ServiceCards3D;
