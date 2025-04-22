
import StepCard from "./StepCard";

const HowItWorksSection = () => (
  <section className="w-full py-20 px-4 sm:px-6 lg:px-8" id="how-it-works">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Getting started with MedZen is easy and straightforward.
        </p>
      </div>
      <div className="max-w-3xl mx-auto space-y-12">
        <StepCard
          number={1}
          title="Create Your Health Profile"
          description="Set up your account and enter your basic health information to personalize your experience."
          delay={100}
        />
        <StepCard
          number={2}
          title="Track Your Health Data"
          description="Log your symptoms, medications, and other health information using our intuitive tracking tools."
          delay={200}
        />
        <StepCard
          number={3}
          title="Get AI-Powered Insights"
          description="Receive personalized insights and recommendations based on your health data and goals."
          delay={300}
        />
        <StepCard
          number={4}
          title="Manage Your Health Journey"
          description="Use your dashboard to monitor progress, set new goals, and make informed health decisions."
          delay={400}
        />
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
