
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import AIAssistantHighlight from "./AIAssistantHighlight";
import HowToUseSection from "./HowToUseSection";
import HowItWorksSection from "./HowItWorksSection";
import AboutSection from "./AboutSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";

// Main landing page container (split for clarity)
const LandingPageContainer = () => {
  return (
    <div className="flex flex-col items-center bg-background">
      <HeroSection />
      <FeaturesSection />
      <AIAssistantHighlight />
      {/* The HowToUseSection is present here */}
      <HowToUseSection />
      <HowItWorksSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default LandingPageContainer;

