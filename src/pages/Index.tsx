
import { useState, useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import MainHeader from "@/components/MainHeader";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import SupportTools from "@/components/client/SupportTools";
import AuthOverlay from "@/components/auth/AuthOverlay";
import LoadingScreen from "@/components/LoadingScreen";

const MainContent = () => {
  const { isOverlayOpen, setIsOverlayOpen, isAuthLoading, authError } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Prevent scrolling when overlay is open
    if (isOverlayOpen || showAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen, showAuth]);

  // Show temporary loading screen while checking auth
  if (isAuthLoading) {
    return <LoadingScreen message="Verificando sessão..." />;
  }

  // If there's an auth error, the app continues normally - errors will be handled by specific components

  return (
    <div className="flex flex-col min-h-screen w-full">
      <MainHeader onLoginClick={() => setShowAuth(true)} />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Faq />
        <CallToAction onGetStartedClick={() => setShowAuth(true)} />
      </main>
      <Footer />
      <SupportTools />
      
      {/* Auth overlay */}
      <AuthOverlay isOpen={showAuth} onClose={() => setShowAuth(false)} />
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
