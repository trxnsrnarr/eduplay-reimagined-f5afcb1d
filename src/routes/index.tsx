import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Features } from "@/components/site/Features";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Personalization } from "@/components/site/Personalization";
import { AITutor } from "@/components/site/AITutor";
import { DashboardPreview } from "@/components/site/DashboardPreview";
import { Gamification } from "@/components/site/Gamification";
import { Games } from "@/components/site/Games";
import { Pricing } from "@/components/site/Pricing";
import { CreatorPlatform } from "@/components/site/CreatorPlatform";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eduverse — Belajar Personal, Gamified, & AI-Powered" },
      { name: "description", content: "Platform belajar modern SD–SMA & UTBK dengan AI Tutor adaptif, Smart Learning Path, game edukasi, dan creator ecosystem. Gratis untuk mulai." },
      { property: "og:title", content: "Eduverse — Platform Belajar Modern Berbasis AI & Gamifikasi" },
      { property: "og:description", content: "Smart Learning Path, AI Tutor, gamifikasi penuh, dan kelas dari Edu Creator. Belajar yang bikin nagih." },
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
        <HowItWorks />
        <Personalization />
        <AITutor />
        <DashboardPreview />
        <Gamification />
        <Games />
        <Pricing />
        <CreatorPlatform />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
