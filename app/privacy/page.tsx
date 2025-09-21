export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-600">Last updated: September 21, 2025</p>
        </div>

        <div className="mt-12 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">1. Introduction</h2>
          {/* FIXED " here */}
          <p className="mt-4">
            Welcome to Routina (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. This policy applies to all information collected through our web application and any related services (collectively, the &quot;Services&quot;).
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. Information We Collect</h2>
          <p className="mt-4">
            We collect personal information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2">
            <li><strong>Personal Identification Information:</strong> Name, email address, and authentication credentials.</li>
            <li><strong>User-Generated Content:</strong> Any tasks, habits, goals, notes, or other content you create and store within our Services.</li>
            <li><strong>Usage Data:</strong> We may automatically collect information about how you access and use the Services, such as your IP address, browser type, device information, pages visited, and the dates/times of your visits.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. How We Use Your Information</h2>
          <p className="mt-4">
            We use the information we collect for various purposes, including to:
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2">
            <li>Provide, operate, and maintain our Services.</li>
            <li>Improve, personalize, and expand our Services.</li>
            <li>Understand and analyze how you use our Services.</li>
            <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the Service.</li>
            <li>Process your transactions and manage your account.</li>
            <li>Find and prevent fraud.</li>
          </ul>
          <p className="mt-4">
            <strong>We do not sell your personal information to third parties.</strong>
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Data Security</h2>
          <p className="mt-4">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Your Data Protection Rights</h2>
          <p className="mt-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Children&apos;s Privacy</h2>
          <p className="mt-4">
            Our Services are not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Changes to This Privacy Policy</h2>
          <p className="mt-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Contact Us</h2>
          <p className="mt-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:privacy@routina.com" className="text-purple-600 hover:underline">privacy@routina.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}