
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
  const { isOverlayOpen, setIsOverlayOpen, isAuthLoading, authError, initialCheckDone } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Prevent scrolling when overlay is open
    if (isOverlayOpen || showAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Add a timeout to show a message if loading takes too long
    const timeoutId = setTimeout(() => {
      if (isAuthLoading) {
        setLoadingTimeout(true);
        console.log("Loading timeout triggered");
      }
    }, 7000);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timeoutId);
    };
  }, [isOverlayOpen, showAuth, isAuthLoading]);

  // Show temporary loading screen while checking auth with timeout option
  if (isAuthLoading && !loadingTimeout) {
    return <LoadingScreen message="Verificando sessão..." />;
  }

  // Show loading timeout screen with retry option
  if (isAuthLoading && loadingTimeout) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-galaxy-dark p-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-neon-cyan">Verificação está demorando</h2>
          <p className="text-gray-300">Estamos tendo problemas para carregar a aplicação. Isso pode ser devido a problemas de conexão ou serviço.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neon-cyan text-galaxy-dark rounded-md hover:bg-neon-cyan/80 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // If auth error and we're done checking, show the error
  if (authError && initialCheckDone) {
    console.error("Auth error:", authError);
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

const Index = () => {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
};

export default Index;
