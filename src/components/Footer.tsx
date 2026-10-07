import Link from "next/link";

interface FooterProps {
  showOgLink?: boolean;
}

export function Footer({ showOgLink = true }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 w-full border-t border-line bg-card px-2 py-3">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-2">
        <h4 className="text-sm font-medium">PaidinToken ™ {year}</h4>
        <div className="flex flex-wrap items-center gap-4">
          {showOgLink && (
            <Link href="/og" className="text-sm font-medium hover:text-accent">
              See the OG site →
            </Link>
          )}
          <a
            href="mailto:admin@paidintoken.com"
            className="contact-email text-sm font-medium hover:text-accent"
          >
            admin@paidintoken.com
          </a>
        </div>
      </div>
    </footer>
  );
}
