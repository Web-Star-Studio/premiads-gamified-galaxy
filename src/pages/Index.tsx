
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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

  // Show loading screen while checking auth, but with a simplified approach
  if (isLoading) {
    return <LoadingScreen message="Carregando..." />;
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && userType) {
    switch(userType) {
      case "anunciante":
        return <Navigate to="/anunciante" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/cliente" replace />;
    }
  }

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

export default Index;
