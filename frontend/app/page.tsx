import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import HowItWorks from "@/app/components/HowItWorks";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
