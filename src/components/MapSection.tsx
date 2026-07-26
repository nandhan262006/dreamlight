export default function MapSection() {
  return (
    <section className="section-gap">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="overline mb-3">Find Us</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-fg mb-4">
            Visit Our Studio
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto">
            Opp: Sai Saroj Mayuri Theatre, Vamsi Complex, Shop No.5, Ongole
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Dreamlightfilms%20By%20Harish%2C%20Ongole&ie=UTF8&t=&z=15&iwloc=B&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dreamlight Films Studio Location"
            className="w-full"
          />
        </div>
        <div className="text-center mt-6">
          <a
            href="https://maps.app.goo.gl/H8vb7WFD8xGrEf737"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.1em] font-semibold text-accent hover:underline"
          >
            Get Directions on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
