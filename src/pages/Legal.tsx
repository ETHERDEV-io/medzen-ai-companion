
import { Shield, ShieldOff } from "lucide-react";

const Legal = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Shield className="text-green-500" /> Legal Information
      </h1>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Shield /> Privacy Policy
        </h2>
        <ul className="list-disc pl-6 my-3 space-y-2 text-muted-foreground text-base">
          <li>
            MedZen does not share personal information with third parties for commercial use.
          </li>
          <li>
            Data is stored locally on your device using localStorage.
          </li>
          <li>
            You may request data removal or correction through support.
          </li>
        </ul>
        <a href="/privacy" className="text-blue-500 hover:underline ml-2 text-sm">View Full Privacy Policy</a>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <ShieldOff /> Terms of Service
        </h2>
        <ul className="list-disc pl-6 my-3 space-y-2 text-muted-foreground text-base">
          <li>
            By using this site, you agree to the responsibility for your account.
          </li>
          <li>
            MedZen is not a substitute for professional medical advice.
          </li>
          <li>
            All intellectual property is owned by MedZen.
          </li>
        </ul>
        <a href="/terms" className="text-blue-500 hover:underline ml-2 text-sm">View Full Terms</a>
      </section>
      <p className="mt-4 text-xs text-muted-foreground">
        This summary is for convenience. Please refer to the linked documents for complete details.
      </p>
    </div>
  );
};

export default Legal;
