
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import ProfileOverlay from "@/components/ProfileOverlay";
import MainHeader from "@/components/MainHeader";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import SupportTools from "@/components/client/SupportTools";
import CookieConsent from "@/components/CookieConsent";

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
    <div className="flex flex-col min-h-screen w-full">
      {isOverlayOpen && <ProfileOverlay />}
      <MainHeader />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
      <SupportTools />
      <CookieConsent />
    </div>
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
