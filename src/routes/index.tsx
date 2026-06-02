import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Features } from "@/components/site/Features";
import { Games } from "@/components/site/Games";
import { Benefits } from "@/components/site/Benefits";
import { Testimonials } from "@/components/site/Testimonials";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eduverse — Platform Edukasi Interaktif #1 di Indonesia" },
      { name: "description", content: "Video learning, tryout UTBK, game edukatif, dan AI tutor dalam satu platform. Belajar jadi lebih seru dan efektif!" },
      { property: "og:title", content: "Eduverse — Jelajahi Universe Pembelajaran dengan Cara Baru" },
      { property: "og:description", content: "Platform belajar SD–SMA & UTBK dengan AI tutor, gamifikasi, dan game edukatif." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Games />
        <Benefits />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
