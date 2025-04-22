
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => (
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
);

export default FAQSection;
