
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => (
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
);

export default CTASection;
