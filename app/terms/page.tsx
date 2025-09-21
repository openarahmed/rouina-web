export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-600">Last updated: September 21, 2025</p>
        </div>

        <div className="mt-12 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">1. Agreement to Terms</h2>
          <p className="mt-4">
            By accessing or using our application, Routina, and any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. User Accounts</h2>
          <p className="mt-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. User Content</h2>
          <p className="mt-4">
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness. You retain any and all of your rights to any Content you submit.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Prohibited Activities</h2>
          <p className="mt-4">
            You agree not to use the Service for any purpose that is illegal or prohibited by these Terms. You may not:
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2">
            <li>Use the Service in any way that could damage, disable, overburden, or impair the Service.</li>
            <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems.</li>
            <li>Use any automated system, including "robots," "spiders," or "offline readers," to access the Service.</li>
            <li>Introduce any viruses, trojan horses, worms, or other material that is malicious or technologically harmful.</li>
            <li>Reverse engineer or attempt to extract the source code of our software.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Termination</h2>
          <p className="mt-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
          
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Disclaimer of Warranties</h2>
          <p className="mt-4">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation or availability of the Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Limitation of Liability</h2>
          <p className="mt-4">
            In no event shall Routina, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Changes to Terms</h2>
          <p className="mt-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-gray-900">9. Contact Us</h2>
          <p className="mt-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:support@routina.com" className="text-purple-600 hover:underline">support@routina.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}