import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold sm:text-xl"
        >
          Paidin<span className="text-accent">Token</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-5">
          <Link href="/#markets" className="hidden hover:text-accent sm:inline">
            Prices
          </Link>
          <Link href="/#news" className="hidden hover:text-accent sm:inline">
            News
          </Link>
          <Link href="/#learn" className="hidden hover:text-accent sm:inline">
            Learn
          </Link>
          <Link href="/og" className="hover:text-accent">
            OG Tracker
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
