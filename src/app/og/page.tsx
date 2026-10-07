import type { Metadata } from "next";
import { PaidinTokenHome } from "@/components/PaidinTokenHome";

export const metadata: Metadata = {
  title: "Celebrity Bitcoin Tracker",
  description:
    "The original PaidinToken tracker — transparent stats on celebrity and athlete cryptocurrency payments.",
};

export default function OgPage() {
  return (
    <div className="og-scope">
      <PaidinTokenHome />
    </div>
  );
}
