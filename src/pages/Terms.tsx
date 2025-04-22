
import { ShieldOff } from "lucide-react";

const Terms = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShieldOff className="text-blue-500" /> Terms of Service
      </h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
        <p className="mb-4">By using MedZen, you agree to use our services in accordance with these Terms and all applicable laws and regulations.</p>
        <p className="mb-4">You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
        <p className="mb-4">You agree not to use our services for any illegal or unauthorized purpose. You must not attempt to breach any security or authentication measures of the service.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Platform Limitations</h2>
        <p className="mb-4">MedZen is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        <p className="mb-4">Our AI features provide general information and suggestions based on the information you provide, but should not be considered as medical advice.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Requirements</h2>
        <p className="mb-4">To use certain features of our service, you may be required to create an account. You must provide accurate, current, and complete information during the registration process.</p>
        <p className="mb-4">We reserve the right to disable any user account at our discretion if we believe you have violated these Terms.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Intellectual Property Rights</h2>
        <p className="mb-4">The service and its original content, features, and functionality are owned by MedZen and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dispute Resolution Process</h2>
        <p className="mb-4">Any disputes arising from or relating to these Terms or your use of MedZen shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
      </section>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default Terms;
