"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Counts {
  gallery: number;
  stories: number;
  reviews: number;
  services: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ gallery: 0, stories: 0, reviews: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/gallery", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/stories", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/reviews", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/services", { cache: "no-store" }).then((r) => r.json()),
    ]).then(([gallery, stories, reviews, services]) => {
      setCounts({
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        stories: Array.isArray(stories) ? stories.length : 0,
        reviews: Array.isArray(reviews) ? reviews.length : 0,
        services: Array.isArray(services) ? services.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Gallery Images", count: counts.gallery, href: "/admin/gallery", color: "bg-blue-50 text-blue-600" },
    { label: "Stories", count: counts.stories, href: "/admin/stories", color: "bg-purple-50 text-purple-600" },
    { label: "Reviews", count: counts.reviews, href: "/admin/reviews", color: "bg-amber-50 text-amber-600" },
    { label: "Services", count: counts.services, href: "/admin/services", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-fg mb-2">Dashboard</h1>
        <p className="text-sm text-muted">Manage your Dreamlight Films website content</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-surface rounded-2xl p-6 border border-border hover:border-accent transition-colors group"
            >
              <div className={`inline-flex p-3 rounded-xl ${card.color} mb-4`}>
                <span className="text-2xl font-bold">{card.count}</span>
              </div>
              <p className="text-sm font-semibold text-fg group-hover:text-accent transition-colors">
                {card.label}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 bg-surface rounded-2xl p-6 border border-border">
        <h2 className="font-serif text-xl text-fg mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/admin/homepage" className="text-sm text-accent hover:underline">Edit Homepage Images</Link>
          <Link href="/admin/about" className="text-sm text-accent hover:underline">Edit About Section</Link>
          <Link href="/admin/gallery" className="text-sm text-accent hover:underline">Manage Gallery</Link>
          <Link href="/admin/stories" className="text-sm text-accent hover:underline">Manage Stories</Link>
          <Link href="/admin/reviews" className="text-sm text-accent hover:underline">Manage Reviews</Link>
          <Link href="/admin/services" className="text-sm text-accent hover:underline">Manage Services</Link>
        </div>
      </div>
    </div>
  );
}
