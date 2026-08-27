import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "PaidinToken",
  description:
    "Transparent stats on celebrity and athlete cryptocurrency payments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${robotoMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
