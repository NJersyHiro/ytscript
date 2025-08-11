'use client'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using YTScript (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
                If you do not agree to these terms, do not use the Service.
              </p>
              <p className="text-gray-700 mb-4">
                These Terms constitute a legal agreement between you and YTScript. We reserve the right to modify 
                these Terms at any time with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                YTScript provides YouTube transcript extraction and processing services, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Transcript extraction from YouTube videos</li>
                <li>Multiple output formats (TXT, SRT, VTT, ASS, PDF, DOCX, XLSX)</li>
                <li>AI-powered summaries and analysis (premium feature)</li>
                <li>Batch processing capabilities (premium feature)</li>
                <li>API access for developers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">3.1 Account Creation</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 13 years old (16 in EU) to create an account</li>
                <li>One person may not create multiple accounts</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">3.2 Account Security</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Keep your API keys confidential and secure</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>You are liable for all activities under your account</li>
                <li>We are not responsible for losses due to compromised credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">4.1 Permitted Uses</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Extract transcripts from publicly available YouTube videos</li>
                <li>Use transcripts for personal, educational, or commercial purposes</li>
                <li>Integrate our API into your applications (subject to rate limits)</li>
                <li>Share generated content in accordance with YouTube&apos;s terms</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">4.2 Prohibited Uses</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Violating YouTube&apos;s Terms of Service or any applicable laws</li>
                <li>Attempting to circumvent rate limits or usage quotas</li>
                <li>Using the service for illegal or harmful activities</li>
                <li>Reverse engineering, copying, or creating derivative works</li>
                <li>Sharing API keys or allowing unauthorized access</li>
                <li>Overwhelming our infrastructure with excessive requests</li>
                <li>Processing copyrighted content without proper authorization</li>
                <li>Using the service to harass, threaten, or harm others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Usage Limits and Fair Use</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">5.1 Free Tier Limits</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>3 requests per minute</li>
                <li>50 requests per day</li>
                <li>Basic formats only (TXT, SRT)</li>
                <li>No AI-powered features</li>
                <li>No API access</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">5.2 Premium Tier Benefits</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Higher rate limits and quotas</li>
                <li>All output formats (PDF, DOCX, XLSX)</li>
                <li>AI summaries and analysis</li>
                <li>Batch processing</li>
                <li>Priority support</li>
                <li>API access</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">5.3 Fair Use Policy</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend accounts that abuse the service, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Excessive automated requests</li>
                <li>Using the service primarily for resale</li>
                <li>Activities that degrade service performance for others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">6.1 Subscription Billing</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Premium subscriptions are billed monthly or annually</li>
                <li>Payments are processed by Stripe</li>
                <li>All fees are in USD unless otherwise specified</li>
                <li>Subscription auto-renews unless cancelled</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">6.2 Refund Policy</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Monthly subscriptions: No refunds for partial months</li>
                <li>Annual subscriptions: Prorated refunds within 30 days</li>
                <li>Refunds for technical issues evaluated case-by-case</li>
                <li>Refund requests must be submitted within 30 days</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">6.3 Price Changes</h3>
              <p className="text-gray-700 mb-4">
                We may change subscription prices with 30 days notice. Existing subscribers maintain 
                current pricing until renewal after the notice period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">7.1 Service Content</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>YTScript retains all rights to the service, software, and documentation</li>
                <li>You receive a limited license to use the service as intended</li>
                <li>You may not copy, modify, or distribute our software</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">7.2 User Content</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You retain ownership of URLs and inputs you provide</li>
                <li>Generated transcripts are provided &quot;as-is&quot; from YouTube&apos;s API</li>
                <li>You are responsible for ensuring you have rights to process submitted content</li>
                <li>We may use anonymized usage data for service improvement</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">7.3 Copyright Compliance</h3>
              <p className="text-gray-700 mb-4">
                We respect intellectual property rights. If you believe content processed through our service 
                infringes copyright, contact us at copyright@ytscript.app with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Identification of the copyrighted work</li>
                <li>Identification of the infringing material</li>
                <li>Your contact information and signature</li>
                <li>A statement of good faith belief that use is unauthorized</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our data practices are described in our 
                <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a>, 
                which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700 mb-4">
                Key points:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>We do not store or retain transcript content longer than necessary</li>
                <li>Personal data is processed in accordance with GDPR and applicable laws</li>
                <li>We implement appropriate security measures to protect your data</li>
                <li>You have rights regarding your personal data (access, correction, deletion)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Service Availability and Support</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">9.1 Service Level</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance when possible</li>
                <li>Service may be temporarily unavailable due to technical issues</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">9.2 Support</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Free users: Email support with best-effort response</li>
                <li>Premium users: Priority email support within 24 hours</li>
                <li>Enterprise users: Dedicated support channels</li>
                <li>Support is provided in English during business hours (PST)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Disclaimers and Limitations</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">10.1 Service Disclaimers</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Service is provided &quot;as-is&quot; without warranties</li>
                <li>We do not guarantee accuracy or completeness of transcripts</li>
                <li>Transcript quality depends on YouTube&apos;s data and audio quality</li>
                <li>AI features may produce inaccurate or incomplete results</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">10.2 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Our liability is limited to the amount paid in the 12 months prior to the claim</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We are not liable for business interruption, lost profits, or data loss</li>
                <li>Some jurisdictions do not allow liability limitations; these may not apply to you</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">11.1 By You</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You may terminate your account at any time</li>
                <li>Cancel subscriptions through your account settings or contact support</li>
                <li>Account deletion is permanent and irreversible</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">11.2 By Us</h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your account for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Violation of these Terms</li>
                <li>Illegal or harmful activities</li>
                <li>Non-payment of fees</li>
                <li>Extended inactivity (free accounts after 12 months)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">11.3 Effect of Termination</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Access to the service will be immediately revoked</li>
                <li>Outstanding fees remain due</li>
                <li>Data will be deleted according to our retention policy</li>
                <li>Provisions regarding liability and disputes survive termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Legal Terms</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">12.1 Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of [State/Country] without regard to conflict of law principles.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-2">12.2 Dispute Resolution</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Disputes should first be addressed through customer support</li>
                <li>Binding arbitration may be required for certain disputes</li>
                <li>Class action lawsuits are waived where legally permitted</li>
                <li>EU users retain right to court proceedings in their jurisdiction</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">12.3 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision is found unenforceable, the remainder of these Terms remains in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, please contact us:
              </p>
              <ul className="list-none mb-4 text-gray-700">
                <li><strong>Email:</strong> legal@ytscript.app</li>
                <li><strong>Subject Line:</strong> Terms of Service Inquiry</li>
                <li><strong>Business Address:</strong> [Your Business Address]</li>
              </ul>
            </section>

            <div className="mt-12 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                These Terms of Service were last updated on {new Date().toLocaleDateString()}. 
                By continuing to use YTScript after changes are posted, you accept the updated Terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}