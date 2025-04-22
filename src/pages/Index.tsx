
import HeroSection from "./index-sections/HeroSection";
import FeaturesSection from "./index-sections/FeaturesSection";
import AIAssistantHighlight from "./index-sections/AIAssistantHighlight";
import HowToUseSection from "./index-sections/HowToUseSection";
import HowItWorksSection from "./index-sections/HowItWorksSection";
import AboutSection from "./index-sections/AboutSection";
import FAQSection from "./index-sections/FAQSection";
import CTASection from "./index-sections/CTASection";

const Index = () => {
  return (
    <div className="flex flex-col items-center bg-background">
      <HeroSection />
      <FeaturesSection />
      <AIAssistantHighlight />
      <HowToUseSection />
      <HowItWorksSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Index;
