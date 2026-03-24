import Header from "../components/header";
import Hero from "../components/hero";
import Feature from "../components/features";
import Footer from "../components/footer";

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />
      <main>
        <Hero />
        <Feature />
      </main>
      <Footer />
    </div>
  );
}