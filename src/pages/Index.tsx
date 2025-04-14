import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import ProfileOverlay from "@/components/ProfileOverlay";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const MainContent = () => {
  const { isOverlayOpen } = useUser();

  useEffect(() => {
    // Prevent scrolling when overlay is open
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen]);

  return (
    <>
      {isOverlayOpen && <ProfileOverlay />}
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

const Index = () => {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
};

export default Index;
