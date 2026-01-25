import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { RecommendedSection } from "@/components/RecommendedSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FEFBF0]">
      <Header />
      <main>
        <HeroSection />
        <div className="relative z-10 -mt-10 lg:-mt-20">
          <CategorySection />
        </div>
        <RecommendedSection />
      </main>
      <Footer />
    </div>
  );
}
