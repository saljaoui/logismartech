import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Ecosystem } from "@/components/Ecosystem";
import { Demo } from "@/components/Demo";
import { Port } from "@/components/Port";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ecosystem />
      <Demo />
      <Port />
      <Footer />
    </main>
  );
};

export default Index;
