import { HelpCircle, Target, Droplet, Activity, Pill, Bot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: <Target className="text-purple-500 w-6 h-6" />,
    title: "Set Your Health Goals",
    desc: "Track your personal health goals or use built-in trackers for steps and water intake."
  },
  {
    icon: <Activity className="text-blue-500 w-6 h-6" />,
    title: "Step Tracker",
    desc: "Record your steps daily and track your progress toward recommended targets."
  },
  {
    icon: <Droplet className="text-teal-500 w-6 h-6" />,
    title: "Water Tracker",
    desc: "Log your water intake easily with a tap to stay hydrated all day."
  },
  {
    icon: <Pill className="text-pink-500 w-6 h-6" />,
    title: "Manage Medications",
    desc: "Add, update, or remove medications. Get reminders for refills and visualize your medication schedule."
  },
  {
    icon: <Bot className="text-yellow-500 w-6 h-6" />,
    title: "AI Health Assistant",
    desc: "Ask health-related questions, get explanations for medical terms, and manage your health data securely."
  },
];

const faqs = [
  {
    q: "Is my data secure?",
    a: "All your data is stored locally on your device. No data is shared or uploaded.",
  },
  {
    q: "How do I switch themes?",
    a: "Use the theme toggle at the top right to easily switch between dark and light mode.",
  },
  {
    q: "Can I use MedZen on my phone or tablet?",
    a: "Absolutely! The app is fully responsive."
  },
  {
    q: "How do I reset my progress?",
    a: "You can clear data from your browser's storage, or reset from within each section."
  }
];

export default function HowToUse() {
  return (
    <div className="container mx-auto py-8 px-2 md:px-4 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-7 h-7 text-indigo-500" />
        <h1 className="text-3xl font-bold">How to Use MedZen</h1>
      </div>
      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Get Started in 4 Easy Steps</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <Card key={i} className="shadow-sm hover-scale bg-gradient-to-br from-background to-muted/70">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                {s.icon}
                <CardTitle className="text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-semibold text-xl mb-2">FAQ</h2>
        <div className="divide-y border rounded-md bg-muted/40">
          {faqs.map((faq, i) => (
            <details key={i} className="p-4 group">
              <summary className="font-medium cursor-pointer flex items-center">
                <HelpCircle className="w-4 h-4 text-primary mr-2" /> {faq.q}
                <span className="ml-auto transition-transform group-open:rotate-180">&#9660;</span>
              </summary>
              <div className="mt-2 text-muted-foreground">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
