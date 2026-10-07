import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: {
    default: "PaidinToken — Live Crypto Prices & News",
    template: "%s | PaidinToken",
  },
  description:
    "Live cryptocurrency prices, 24hr market data, and the latest crypto news — plus transparent stats on celebrity and athlete Bitcoin payments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pit-theme");document.documentElement.dataset.theme=t||"dark";}catch(e){document.documentElement.dataset.theme="dark";}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
