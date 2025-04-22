
import { Pill, Target, Search, Bot } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => (
  <section className="w-full py-20 px-4 sm:px-6 lg:px-8" id="features">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Features</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive tools designed to help you manage and improve your health with ease.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Pill size={28} />}
          title="Medication Management"
          description="Keep track of your medications, dosages, and schedules with smart reminders."
          delay={100}
        />
        <FeatureCard
          icon={<Target size={28} />}
          title="Health Goals"
          description="Set personalized health goals and track your progress with visual metrics."
          delay={200}
        />
        <FeatureCard
          icon={<Search size={28} />}
          title="Symptom Checker"
          description="Select your symptoms and analyze them for potential conditions."
          delay={300}
        />
        <FeatureCard
          icon={<Bot size={28} />}
          title="AI Health Assistant"
          description="Get personalized health insights and answers to your questions using advanced AI."
          delay={400}
        />
      </div>
    </div>
  </section>
);

export default FeaturesSection;
