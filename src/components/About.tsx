import Image from "next/image";

interface AboutProps {
  image?: string;
  title?: string;
  description?: string;
  name?: string;
  role?: string;
  location?: string;
}

export default function About({
  image = "/about.png",
  title = "Capturing Moments That Last Forever",
  description = "[]",
  name = "Harish Gudipudi",
  role = "CEO & Lead Photographer",
  location = "Hyderabad, Telangana • Available Worldwide",
}: AboutProps) {
  let paragraphs: string[] = [];
  try {
    const parsed = JSON.parse(description);
    if (Array.isArray(parsed)) paragraphs = parsed;
  } catch {
    paragraphs = [description];
  }

  return (
    <section id="about" className="section-gap">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt="About Dreamlight Films"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-16">
              <p className="font-serif text-2xl text-white">{name}</p>
              <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                {role}
              </p>
            </div>
          </div>

          <div>
            <p className="overline mb-3">About</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg mb-6">
              {title}
            </h2>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="text-sm uppercase tracking-[0.15em] font-semibold text-accent mt-6 mb-6">
              {location}
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
