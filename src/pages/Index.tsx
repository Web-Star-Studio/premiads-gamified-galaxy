
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

  // Handle redirection in a separate effect
  useEffect(() => {
    // Only attempt redirection after authentication is checked and user is authenticated
    if (!isLoading && isAuthenticated && userType) {
      console.log("Index preparing to redirect authenticated user:", { userType });
      
      if (userType === "admin" || userType === "admin-master") {
        setRedirectTo("/admin");
      } else if (userType === "anunciante") {
        setRedirectTo("/anunciante");
      } else if (userType === "participante") {
        setRedirectTo("/cliente");
      } else {
        // Default case if userType is not one of the expected values
        console.warn("Unknown user type:", userType);
        setRedirectTo("/");
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
