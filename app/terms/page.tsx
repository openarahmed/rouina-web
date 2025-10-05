export default function TermsOfServicePage() {
    return (
        // ★★★ 1. Updated background to match your dark theme ★★★
        <div className="bg-[#0D0915] text-white">
            <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
                <div className="text-center">
                    {/* ★★★ 2. Updated H1 with brand color ★★★ */}
                    <h1 className="text-4xl font-bold tracking-tight text-[#F3F4F6] sm:text-5xl">
                        Terms of <span className="text-[#6D46C1]">Service</span>
                    </h1>
                    {/* ★★★ 3. Updated date and text color ★★★ */}
                    <p className="mt-4 text-sm text-slate-400">Last updated: October 5, 2025</p>
                </div>

                {/* ★★★ 4. Using Tailwind 'prose' for beautiful, readable text with improved spacing ★★★ */}
                <div className="mt-16 prose prose-invert prose-lg max-w-none text-slate-300
                    prose-h2:mt-12 prose-h2:mb-4 
                    prose-p:mt-6 
                    prose-ul:mt-6
                    prose-strong:text-white
                ">
                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our application, Routina, and any related services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.
                    </p>

                    <h2>2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                    </p>

                    <h2>3. User Content</h2>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material (&quot;Content&quot;). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness. You retain any and all of your rights to any Content you submit.
                    </p>

                    <h2>4. Prohibited Activities</h2>
                    <p>
                        You agree not to use the Service for any purpose that is illegal or prohibited by these Terms. You may not:
                    </p>
                    <ul>
                        <li>Use the Service in any way that could damage, disable, overburden, or impair the Service.</li>
                        <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems.</li>
                        <li>Use any automated system, including &quot;robots,&quot; &quot;spiders,&quot; or &quot;offline readers,&quot; to access the Service.</li>
                        <li>Introduce any viruses, trojan horses, worms, or other material that is malicious or technologically harmful.</li>
                        <li>Reverse engineer or attempt to extract the source code of our software.</li>
                    </ul>

                    <h2>5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                    
                    <h2>6. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no warranties, expressed or implied, regarding the operation or availability of the Service.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        In no event shall Routina, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                    
                    <h2>8. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days&apos; notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>

                    <h2>9. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us:
                    </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:support@routina.com">support@routina.com</a>
                    </p>
                </div>
            </main>
        </div>
    );
}
