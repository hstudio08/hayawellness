import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Haya Wellness Centre",
  description: "Privacy policy and data protection guidelines for Haya Wellness Centre.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 w-full pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-8">Privacy Policy</h1>
        
        <div className="prose prose-emerald max-w-none text-text-muted space-y-6">
          <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-serif text-emerald-deep mt-8 mb-4">1. Information We Collect</h2>
          <p>
            At Haya Wellness Centre, we take your privacy seriously. We collect personal information that you provide to us, such as name, address, contact information, passwords and security data, and payment information. We also collect health-related information necessary to provide medical care.
          </p>

          <h2 className="text-2xl font-serif text-emerald-deep mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To deliver services and medical care to the user.</li>
            <li>To respond to user inquiries and offer support.</li>
            <li>To send administrative information to you.</li>
          </ul>

          <h2 className="text-2xl font-serif text-emerald-deep mt-8 mb-4">3. Will Your Information Be Shared?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Your medical records are kept strictly confidential under applicable health data protection laws.
          </p>

          <h2 className="text-2xl font-serif text-emerald-deep mt-8 mb-4">4. How Long Do We Keep Your Information?</h2>
          <p>
            We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law (such as tax, accounting, or medical retention requirements).
          </p>

          <h2 className="text-2xl font-serif text-emerald-deep mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at privacy@hayawellness.com or by post to:
            <br />
            <br />
            Haya Wellness Centre
            <br />
            123 Medical Boulevard
            <br />
            City, State, ZIP Code
          </p>
        </div>
      </div>
    </main>
  );
}
