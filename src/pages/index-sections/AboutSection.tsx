
import { Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => (
  <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5" id="about">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="bg-gradient-to-br from-primary/20 via-transparent to-accent/20 p-1 rounded-2xl">
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
);

export default AboutSection;
