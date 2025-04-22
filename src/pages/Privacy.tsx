
const Privacy = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Collection Practices</h2>
        <p className="mb-4">MedZen is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.</p>
        <p className="mb-4">We collect information you provide directly to us when you create an account, use our features, or communicate with us. This may include health information you choose to share, such as symptoms, medications, and health goals.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Information Usage and Storage</h2>
        <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, including personalizing your experience and providing health insights.</p>
        <p className="mb-4">In the current version, your data is stored locally on your device using localStorage. In future versions with backend integration, we will implement enterprise-grade security measures to protect your data.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Third-Party Data Sharing</h2>
        <p className="mb-4">We do not sell or share your personal information with third parties for their commercial use. In the current version, all data remains on your device.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Rights and Controls</h2>
        <p className="mb-4">You have the right to access, correct, or delete your information at any time. You can manage your data through your account settings.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-4">If you have any questions about our Privacy Policy or practices, please contact us at privacy@medzen.com.</p>
      </section>
      
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default Privacy;
