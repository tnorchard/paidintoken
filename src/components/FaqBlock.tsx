export interface FaqItem {
  q: string;
  a: string;
}

function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqBlock({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="mt-10 border-t border-line pt-6">
      <FaqJsonLd items={items} />
      <h2 className="text-lg font-bold uppercase tracking-wider">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-lg border border-line bg-card p-4 transition hover:border-accent"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="text-lg font-normal text-accent transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
