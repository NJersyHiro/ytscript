'use client'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>YouTube video URLs that you submit for transcript extraction</li>
                <li>Account information (email address) if you create an account</li>
                <li>Payment information when you subscribe to premium features</li>
                <li>Communications you send to us (support emails, feedback)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">1.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Usage data (features used, API calls made)</li>
                <li>Technical data (IP address, browser type, device information)</li>
                <li>Performance data (response times, error rates)</li>
                <li>Cookies and similar technologies for authentication and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Service Provision:</strong> Processing YouTube URLs and generating transcripts</li>
                <li><strong>Account Management:</strong> Creating and managing user accounts</li>
                <li><strong>Payment Processing:</strong> Handling subscriptions and billing</li>
                <li><strong>Usage Monitoring:</strong> Enforcing rate limits and usage quotas</li>
                <li><strong>Service Improvement:</strong> Analyzing usage patterns to improve features</li>
                <li><strong>Customer Support:</strong> Responding to inquiries and providing assistance</li>
                <li><strong>Legal Compliance:</strong> Meeting legal obligations and protecting rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Service Providers:</strong> Third-party services that help us operate (payment processing, hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">Third-Party Services</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Stripe:</strong> Payment processing (see <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline">Stripe&apos;s Privacy Policy</a>)</li>
                <li><strong>YouTube API:</strong> Transcript data retrieval (see <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google&apos;s Privacy Policy</a>)</li>
                <li><strong>OpenAI:</strong> AI-powered summaries (see <a href="https://openai.com/privacy" className="text-blue-600 hover:underline">OpenAI&apos;s Privacy Policy</a>)</li>
                <li><strong>Railway:</strong> Hosting and infrastructure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">4.1 Data Storage</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Data is stored on secure servers in the United States</li>
                <li>Transcript data may be cached for up to 7 days to improve performance</li>
                <li>Account data is retained until account deletion</li>
                <li>Usage logs are retained for up to 12 months for analytics and compliance</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">4.2 Security Measures</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>HTTPS encryption for all data transmission</li>
                <li>API key authentication for premium features</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training</li>
                <li>Automated backup and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">5.1 Account Data</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Access:</strong> View your account information and usage data</li>
                <li><strong>Correction:</strong> Update incorrect personal information</li>
                <li><strong>Deletion:</strong> Request account deletion and data removal</li>
                <li><strong>Export:</strong> Download your personal data in a portable format</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">5.2 Marketing Communications</h3>
              <p className="text-gray-700 mb-4">
                We do not send marketing emails. All communications are service-related (account notifications, security alerts, billing).
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">5.3 Cookies and Tracking</h3>
              <p className="text-gray-700 mb-4">
                You can manage cookie preferences through your browser settings. Note that disabling cookies may affect service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. International Users and GDPR</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">6.1 Legal Basis for Processing (EU Users)</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Contractual Necessity:</strong> Processing necessary to provide services</li>
                <li><strong>Legitimate Interests:</strong> Service improvement, fraud prevention, security</li>
                <li><strong>Consent:</strong> Analytics, optional features (where applicable)</li>
                <li><strong>Legal Obligation:</strong> Compliance with applicable laws</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">6.2 EU/UK Rights</h3>
              <p className="text-gray-700 mb-4">
                If you are located in the EU or UK, you have additional rights under GDPR/UK GDPR:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Right to object to processing based on legitimate interests</li>
                <li>Right to restrict processing in certain circumstances</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent (where processing is based on consent)</li>
                <li>Right to lodge a complaint with your local data protection authority</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not directed to children under 13 (or 16 in the EU). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy periodically. We will notify users of material changes via:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>In-app notification (for significant changes)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For privacy-related questions, requests, or concerns, please contact us:
              </p>
              <ul className="list-none mb-4 text-gray-700">
                <li><strong>Email:</strong> privacy@ytscript.app</li>
                <li><strong>Subject Line:</strong> Privacy Request - [Your Request Type]</li>
                <li><strong>Response Time:</strong> We aim to respond within 30 days</li>
              </ul>
              
              <p className="text-gray-700 mb-4">
                For EU/UK users, our representative contact:
              </p>
              <ul className="list-none mb-4 text-gray-700">
                <li><strong>Email:</strong> gdpr@ytscript.app</li>
                <li><strong>Response Time:</strong> Within 30 days (72 hours for data breaches)</li>
              </ul>
            </section>

            <div className="mt-12 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                This Privacy Policy was last updated on {new Date().toLocaleDateString()}. 
                Previous versions are available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}