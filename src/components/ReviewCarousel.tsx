"use client";

import { useRef, useEffect } from "react";

interface Review {
  name: string;
  text: string;
  rating: number;
  date: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={star <= rating ? "#b8860b" : "none"}
          stroke="#b8860b"
          strokeWidth="1"
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

const reviewList: Review[] = [
  {
    name: "Priya Sharma",
    text: "Dreamlight Films captured our wedding absolutely perfectly. Every time we watch our film, we relive the emotions of that day. Harish and his team were professional, unobtrusive, and genuinely cared about getting every detail right.",
    rating: 5,
    date: "2 months ago",
  },
  {
    name: "Ananya Reddy",
    text: "The cinematic quality of our wedding film is beyond what we imagined. The drone shots, the editing, the music — everything came together beautifully. Thank you for preserving our memories so artfully.",
    rating: 5,
    date: "1 month ago",
  },
  {
    name: "Neha Patel",
    text: "From the first consultation to the final delivery, the experience was seamless. Harish has an incredible eye for detail and a gift for capturing genuine emotions. Our family still watches the film every weekend!",
    rating: 5,
    date: "3 months ago",
  },
  {
    name: "Kavita Singh",
    text: "We chose Dreamlight Films for our destination wedding and it was the best decision. They traveled with us, understood our vision, and delivered a film that takes our breath away every single time.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    name: "Ritu Verma",
    text: "The pre-wedding shoot was an experience in itself! Harish made us feel so comfortable in front of the camera, and the results were stunning. Our wedding film was equally magical. Highly recommended!",
    rating: 5,
    date: "1 month ago",
  },
  {
    name: "Deepa Iyer",
    text: "I cannot recommend Dreamlight Films enough. The team's dedication to their craft is evident in every frame. They didn't just document our wedding — they created a work of art that our family will treasure forever.",
    rating: 5,
    date: "2 months ago",
  },
];

function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const doubled = [...reviews, ...reviews];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let id = 0;
    function tick() {
      if (!paused.current && el) {
        el.scrollLeft += 0.4;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      id = requestAnimationFrame(tick);
    }
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="reviews" className="bg-surface-muted section-gap">
      <div className="container-max">
        {/* Google Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          <span className="font-serif text-xl text-fg">4.9</span>
          <span className="text-xs text-muted">127 reviews</span>
        </div>

        <div className="text-center mb-12">
          <p className="overline mb-3">Reviews</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg">
            What Couples Say
          </h2>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
          className="flex gap-4 overflow-x-scroll py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {doubled.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="flex-shrink-0 bg-surface p-6 flex flex-col gap-3 rounded-2xl"
              style={{ width: "min(320px, 80vw)" }}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center font-semibold text-accent text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-fg">{review.name}</p>
                  <p className="text-xs text-muted">{review.date}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-sm text-muted leading-relaxed line-clamp-4">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { type Review, reviewList };
export default ReviewCarousel;
