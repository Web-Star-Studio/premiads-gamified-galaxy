
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AboutHero,
  MissionSection,
  ValuesSection,
  VisionSection,
  AudienceSection,
  TechnologySection,
  TeamSection
} from "@/components/about";

const About = () => {
  return (
    <div className="min-h-screen bg-galaxy-dark flex flex-col">
      <Header />

      <main className="flex-grow">
        <AboutHero />
        <MissionSection />
        <ValuesSection />
        <VisionSection />
        <AudienceSection />
        <TechnologySection />
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
};

export default About;
