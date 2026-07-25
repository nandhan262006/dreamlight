"use client";

import { useCallback } from "react";
import ServiceCards3D, { type Service } from "./ServiceCards3D";

export default function ServiceCardsWithScroll({ services }: { services: Service[] }) {
  const handleNext = useCallback(() => {
    document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePrev = useCallback(() => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <ServiceCards3D
      services={services}
      onOverflowNext={handleNext}
      onOverflowPrev={handlePrev}
    />
  );
}
