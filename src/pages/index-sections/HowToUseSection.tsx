
import { Target, Pill, Bot, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowToUseSection = () => (
  <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Use MedZen</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Getting started with MedZen is simple and intuitive. Here's a quick guide to help you make the most of our app.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center text-primary">
            <Target size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Set Health Goals</h3>
          <p className="text-muted-foreground">
            Track your personal health goals, including steps, water intake, and more.
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center text-primary">
            <Pill size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Manage Medications</h3>
          <p className="text-muted-foreground">
            Add, track, and get reminders for your medications easily.
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center text-primary">
            <Bot size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
          <p className="text-muted-foreground">
            Get personalized health insights and answers to your medical questions.
          </p>
        </div>
      </div>
      <div className="text-center mt-12">
        <Button asChild size="lg" className="text-lg py-6 px-8">
          <Link to="/how-to-use" className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5" />
            Full Guide
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default HowToUseSection;
