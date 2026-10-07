import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqBlock } from "@/components/FaqBlock";
import { glossary } from "@/data/glossary";

export const dynamicParams = true;

export function generateStaticParams() {
  return glossary.map((entry) => ({ slug: entry.slug }));
}

interface LearnPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = glossary.find((item) => item.slug === slug);
  if (!entry) return { title: "Guide not found" };

  return {
    title: `What is ${entry.term}?`,
    description: entry.body,
    alternates: { canonical: `/learn/${entry.slug}` },
    openGraph: {
      title: `What is ${entry.term}?`,
      description: entry.body,
      url: `/learn/${entry.slug}`,
    },
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { slug } = await params;
  const entry = glossary.find((item) => item.slug === slug);
  if (!entry) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `What is ${entry.term}?`,
    description: entry.body,
    url: `https://www.paidintoken.com/learn/${entry.slug}`,
    publisher: {
      "@type": "Organization",
      name: "PaidinToken",
      url: "https://www.paidintoken.com",
    },
  };

  const related = glossary.filter((item) => item.slug !== entry.slug).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Learn", href: "/#learn" }, { label: entry.term }]} />

      <h1 className="text-3xl font-bold">What is {entry.term}?</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">{entry.body}</p>

      <div className="mt-5 space-y-4">
        {entry.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <FaqBlock items={entry.faq} title={`FAQ · ${entry.term}`} />

      <section className="mt-8 rounded-lg border border-line bg-card p-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">
          Keep exploring
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/learn/${item.slug}`}
              className="rounded border border-line px-2.5 py-1 text-xs font-medium transition hover:border-accent hover:text-accent"
            >
              {item.term}
            </Link>
          ))}
          <Link
            href="/faq"
            className="rounded border border-line px-2.5 py-1 text-xs font-medium transition hover:border-accent hover:text-accent"
          >
            All FAQs
          </Link>
        </div>
      </section>
    </main>
  );
}
