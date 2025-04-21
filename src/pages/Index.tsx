
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
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Control overflow for body when overlay is open
  useEffect(() => {
    if (isOverlayOpen || showAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen, showAuth]);

  // Handle authentication redirects in a separate effect
  useEffect(() => {
    // Only calculate the redirect destination after authentication is checked
    if (!isLoading && isAuthenticated && userType) {
      console.log("Index preparing to redirect authenticated user:", { userType });
      
      let destination = "/";
      
      if (userType === "admin" || userType === "admin-master") {
        destination = "/admin";
      } else if (userType === "anunciante") {
        destination = "/anunciante";
      } else if (userType === "participante") {
        destination = "/cliente";
      }
      
      // Only set redirect if a valid destination was determined
      if (destination !== "/") {
        setRedirectTo(destination);
      }
    }
  }, [isAuthenticated, userType, isLoading]);

  if (isLoading) {
    return <LoadingScreen message="Carregando..." />;
  }

  // Redirect authenticated users to their dashboard
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
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
