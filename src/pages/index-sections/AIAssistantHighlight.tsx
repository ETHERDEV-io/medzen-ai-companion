
import { PlusCircle, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIAssistantHighlight = () => (
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
);

export default AIAssistantHighlight;
