import { Link } from "react-router-dom";
import { 
  Activity, 
  Bot, 
  Brain, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Lightbulb, 
  Pill, 
  PlusCircle, 
  Search, 
  Target, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

// Animation helper for scroll reveal
const useScrollReveal = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  return [ref, isIntersecting] as const;
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const [ref, isIntersecting] = useScrollReveal();
  
  return (
    <div 
      ref={ref}
      className={cn(
        "bg-card text-card-foreground rounded-xl p-6 shadow-md border border-border/50 transition-all duration-500 transform",
        isIntersecting 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Step Card Component
interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
}

const StepCard = ({ number, title, description, delay = 0 }: StepCardProps) => {
  const [ref, isIntersecting] = useScrollReveal();
  
  return (
    <div 
      ref={ref}
      className={cn(
        "flex gap-5 items-start transition-all duration-500 transform",
        isIntersecting 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 -translate-x-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0 rounded-full bg-accent/20 w-10 h-10 flex items-center justify-center font-bold text-accent-foreground">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="flex flex-col items-center bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, rgba(42, 157, 143, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 70%, rgba(155, 135, 245, 0.15) 0%, transparent 30%)"
          }}
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Personal Health Companion
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            MedZen combines AI-powered insights with easy-to-use tools for tracking symptoms, 
            managing medications, and reaching your health goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg py-6 px-8">
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8 group">
              <Link to="/ai-assistant">
                Try AI Assistant
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 max-w-4xl w-full bg-card border border-border/50 rounded-2xl shadow-xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
          <div className="p-4 relative z-10">
            <div className="bg-card rounded-xl p-3 border border-border/50 shadow-sm" style={{ minHeight: "400px" }}>
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-muted-foreground">MedZen Dashboard</div>
                <div></div>
              </div>
              <div className="space-y-3 p-4">
                <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                    <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                    <div className="h-12 bg-muted/20 rounded"></div>
                  </div>
                  <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                    <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                    <div className="h-12 bg-muted/20 rounded"></div>
                  </div>
                  <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                    <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                    <div className="h-12 bg-muted/20 rounded"></div>
                  </div>
                </div>
                <div className="h-56 bg-muted/30 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              icon={<Activity size={28} />}
              title="Symptom Tracker"
              description="Log and monitor your symptoms over time to identify patterns and triggers."
              delay={100}
            />
            
            <FeatureCard
              icon={<Pill size={28} />}
              title="Medication Management"
              description="Keep track of your medications, dosages, and schedules with smart reminders."
              delay={200}
            />
            
            <FeatureCard
              icon={<Target size={28} />}
              title="Health Goals"
              description="Set personalized health goals and track your progress with visual metrics."
              delay={300}
            />
            
            <FeatureCard
              icon={<Search size={28} />}
              title="Symptom Checker"
              description="Identify potential conditions based on your symptoms with our AI-powered tool."
              delay={400}
            />
            
            <FeatureCard
              icon={<Calendar size={28} />}
              title="Health Timeline"
              description="Visualize your health journey with an interactive timeline of events and milestones."
              delay={500}
            />
            
            <FeatureCard
              icon={<Bot size={28} />}
              title="AI Health Assistant"
              description="Get personalized health insights and answers to your questions using advanced AI."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Highlight */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet Your AI Health Assistant
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Our AI-powered health assistant helps you understand medical information, analyze your health data, and get personalized recommendations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Chat naturally about health topics and concerns",
                  "Upload and analyze medical documents and test results",
                  "Get plain-language explanations of complex medical terms",
                  "Receive personalized nutrition and exercise guidance",
                  "Save and export important conversations"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <PlusCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg">
                <Link to="/ai-assistant">Try AI Assistant Now</Link>
              </Button>
            </div>
            
            <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">AI Health Assistant</h3>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-2xl p-4">
                      <p className="text-sm">What does my cholesterol reading of 210 mg/dL mean?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 bg-primary/5 rounded-2xl p-4">
                      <p className="text-sm mb-2">A total cholesterol reading of 210 mg/dL is considered borderline high. Here's what this means:</p>
                      <ul className="text-sm space-y-2 list-disc pl-5">
                        <li>Desirable: Less than 200 mg/dL</li>
                        <li>Borderline high: 200-239 mg/dL</li>
                        <li>High: 240 mg/dL and above</li>
                      </ul>
                      <p className="text-sm mt-2">Would you like suggestions on how to improve your cholesterol levels?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-2xl p-4">
                      <p className="text-sm">Yes, please suggest some ways to lower my cholesterol.</p>
                    </div>
                  </div>
                  
                  <div className="h-6 bg-muted/20 rounded-full w-12 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
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
      
      {/* About Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="bg-gradient-to-br from-primary/20 via-transparent to-accent/20 p-1 rounded-2xl"
            >
              <div className="bg-background rounded-xl overflow-hidden h-full p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Brain size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    At MedZen, we're committed to making health management easier, more informed, and more personalized through technology.
                  </p>
                </div>
                
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                    <Lightbulb size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Our Approach</h3>
                  <p className="text-muted-foreground">
                    We combine cutting-edge AI technology with intuitive design to create tools that empower you to take control of your health journey.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About MedZen
              </h2>
              <p className="text-xl mb-6">
                MedZen was created to bridge the gap between complex health information and everyday health management.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that everyone should have access to tools that make managing their health easier and more informed. Our platform combines medical knowledge with advanced technology to provide personalized health insights and management tools.
              </p>
              <p className="text-muted-foreground mb-8">
                Whether you're managing a chronic condition, working toward specific health goals, or simply wanting to stay on top of your overall wellness, MedZen provides the tools and insights you need.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">Start Your Health Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about MedZen.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is MedZen a substitute for professional medical advice?</AccordionTrigger>
              <AccordionContent>
                No, MedZen is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How is my health data stored and protected?</AccordionTrigger>
              <AccordionContent>
                In the current version, your data is stored locally on your device using localStorage. In future versions with backend integration, we will implement enterprise-grade security measures to protect your data with encryption and strict access controls.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I export my health data from MedZen?</AccordionTrigger>
              <AccordionContent>
                Yes, MedZen allows you to export your health data in various formats including PDF and CSV. This makes it easy to share information with healthcare providers or keep personal backups.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How accurate is the AI Health Assistant?</AccordionTrigger>
              <AccordionContent>
                Our AI Health Assistant provides information based on current medical knowledge and the information you provide. It's designed to be informative and helpful, but should not be considered as definitive medical advice. The AI is continuously improved based on the latest medical research and user feedback.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
              <AccordionContent>
                MedZen is currently available as a responsive web application that works well on both desktop and mobile devices. A dedicated mobile app is on our roadmap for future development.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I get started with MedZen?</AccordionTrigger>
              <AccordionContent>
                Getting started is easy! Simply create an account, set up your health profile, and begin using the tools that are most relevant to your needs. Our dashboard provides quick access to all features, and each tool includes guidance to help you get the most out of it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join MedZen today and discover a smarter way to manage your health with AI-powered insights and easy-to-use tools.
          </p>
          <Button asChild size="lg" className="text-lg py-6 px-8">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
