import type { Route } from "./+types/privacy-policy";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy | The AdPharm" },
    { name: "description", content: "Privacy Policy for The Adpharm Inc." },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Privacy Policy</h1>
          <p className="text-white/40 mb-12">Last Updated: January 22, 2026</p>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">1. Introduction</h2>
              <p>
                The Adpharm Inc. ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website
                located at theadpharm.com (the "Site"). Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">2. Company Information</h2>
              <p>
                The Adpharm Inc.
                <br />
                133 Thomas Street
                <br />
                Oakville, Ontario, Canada
                <br />
                Email: digital@theadpharm.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">3. Information We Collect</h2>
              <h3 className="text-xl font-light text-white mb-3 mt-6">3.1 Personal Information</h3>
              <p className="mb-4">
                When you submit a contact form on our Site, we collect the following personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name</li>
                <li>Organization name</li>
                <li>Email address</li>
                <li>Message content</li>
              </ul>

              <h3 className="text-xl font-light text-white mb-3 mt-6">3.2 Analytics and Usage Data</h3>
              <p className="mb-4">
                We automatically collect certain information about your device and how you interact with our Site,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Browser type and version</li>
                <li>Device information (type, operating system)</li>
                <li>Pages visited and features used</li>
                <li>Time spent on pages</li>
                <li>Referring website addresses</li>
                <li>User behavior and interaction patterns</li>
                <li>Unique browser identifiers (UBIDs) for session grouping</li>
              </ul>
              <p className="mt-4">
                We do not collect IP addresses or other directly identifiable information through our analytics systems.
              </p>

              <h3 className="text-xl font-light text-white mb-3 mt-6">3.3 Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our Site. These include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>
                  <strong>Analytics Cookies:</strong> Google Analytics to understand site usage and improve our services
                </li>
                <li>
                  <strong>Functionality Cookies:</strong> Our proprietary analytics system (Segment) to track user
                  actions and events
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">4. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Process and fulfill contact form submissions</li>
                <li>Analyze Site usage and improve our services</li>
                <li>Understand user behavior and preferences</li>
                <li>Enhance the user experience and Site functionality</li>
                <li>Generate analytics reports for internal business purposes</li>
                <li>Communicate with you about our services and offerings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">5. Data Storage and Processing</h2>
              <p>
                Your information is stored securely in databases hosted on Neon serverless infrastructure, located in
                United States data centers (US-East-1 or US-East-2 regions). Contact form submissions are processed
                through Amazon Web Services EventBridge for reliable delivery and processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">6. Third-Party Service Providers</h2>
              <p className="mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our
                Site and conducting our business, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> For website analytics and performance monitoring
                </li>
                <li>
                  <strong>Segment:</strong> Our proprietary analytics platform for tracking user interactions
                </li>
                <li>
                  <strong>Neon:</strong> Database hosting services
                </li>
                <li>
                  <strong>Amazon Web Services (AWS):</strong> Cloud infrastructure and EventBridge processing
                </li>
              </ul>
              <p className="mt-4">
                These third parties are obligated to protect your information and use it only for the purposes for which
                it was disclosed to them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or permitted by law. Analytics data is
                retained for business intelligence and reporting purposes in accordance with our internal data retention
                policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">8. Your Rights and Choices</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Withdraw consent for data processing where applicable</li>
                <li>Opt-out of analytics tracking by disabling cookies in your browser settings</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at digital@theadpharm.com.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">9. Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">10. Children's Privacy</h2>
              <p>
                Our Site is not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children. If you become aware that a child has provided us with personal information,
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to modify this Privacy Policy at any time. Any changes will be effective
                immediately upon posting the updated Privacy Policy on the Site. Your continued use of the Site
                following the posting of changes constitutes your acceptance of such changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">12. Governing Law</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of the Province of Ontario
                and the federal laws of Canada applicable therein, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">13. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-4">
                The Adpharm Inc.
                <br />
                133 Thomas Street
                <br />
                Oakville, Ontario, Canada
                <br />
                Email: digital@theadpharm.com
              </p>
            </section>
          </div>

          <div className="mt-16">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
