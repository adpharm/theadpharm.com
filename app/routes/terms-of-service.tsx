import type { Route } from "./+types/terms-of-service";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  const title = "Terms of Service | The AdPharm";
  const description = "Terms of Service for The Adpharm Inc. Read the terms and conditions governing your use of our website and services.";
  const url = "https://theadpharm.com/terms-of-service";
  const image = "https://theadpharm.com/images/gray-bg-group-photo.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: url },
    
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "The AdPharm" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export default function TermsOfService() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Terms of Service</h1>
          <p className="text-white/40 mb-12">Last Updated: January 22, 2026</p>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you and The Adpharm Inc.
                ("Company," "we," "us," or "our") concerning your access to and use of the theadpharm.com website (the
                "Site"). By accessing or using the Site, you acknowledge that you have read, understood, and agree to be
                bound by these Terms. If you do not agree to these Terms, you must discontinue use of the Site
                immediately.
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
              <h2 className="text-2xl font-light text-white mb-4">3. Intellectual Property Rights</h2>
              <p className="mb-4">
                All content, features, and functionality on the Site, including but not limited to text, graphics,
                logos, images, software, and other materials (collectively, the "Content"), are the exclusive property
                of The Adpharm Inc. or its licensors and are protected by international copyright, trademark, patent,
                trade secret, and other intellectual property laws.
              </p>
              <p>
                You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Site
                and Content for personal, non-commercial purposes only. This license does not include any rights to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Reproduce, distribute, modify, or create derivative works from the Content</li>
                <li>Use the Content for commercial purposes without express written authorization</li>
                <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                <li>Frame or mirror any portion of the Site without prior written consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">4. User Representations and Warranties</h2>
              <p className="mb-4">By using the Site, you represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You are at least 18 years of age</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate, current, and complete</li>
                <li>You will not use the Site for any unlawful or prohibited purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">5. Prohibited Activities</h2>
              <p className="mb-4">You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Systematically retrieve data or content from the Site to create a collection or database</li>
                <li>Circumvent, disable, or interfere with security-related features of the Site</li>
                <li>Engage in unauthorized framing or linking to the Site</li>
                <li>Trick, defraud, or mislead us or other users</li>
                <li>Make improper use of our support services or submit false reports</li>
                <li>Interfere with, disrupt, or create an undue burden on the Site or networks</li>
                <li>Attempt to impersonate another user or use another user's information</li>
                <li>Use any automated system to access the Site without authorization</li>
                <li>Upload or transmit viruses, malware, or other malicious code</li>
                <li>Harass, intimidate, or threaten our employees or other users</li>
                <li>Delete copyright or other proprietary rights notices</li>
                <li>Use the Site in a manner inconsistent with applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">6. User-Generated Content</h2>
              <p className="mb-4">
                When you submit content through our contact form or other means (collectively, "Submissions"), you grant
                us a perpetual, irrevocable, worldwide, non-exclusive, royalty-free license to use, reproduce, modify,
                adapt, publish, translate, distribute, and display such content for business purposes, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Responding to your inquiries</li>
                <li>Improving our services</li>
                <li>Marketing and promotional purposes (with anonymization where appropriate)</li>
              </ul>
              <p className="mt-4">
                You represent and warrant that you own or have the necessary rights to submit such content and that your
                Submissions do not violate any third-party rights or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">7. Site Management</h2>
              <p className="mb-4">We reserve the right, but not the obligation, to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Monitor the Site for violations of these Terms</li>
                <li>Take appropriate legal action against anyone who violates these Terms</li>
                <li>Refuse, restrict access to, limit availability of, or disable any contribution or content</li>
                <li>
                  Remove or disable any content that we determine violates these Terms or is otherwise objectionable
                </li>
                <li>Otherwise manage the Site in a manner designed to protect our rights and property</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">8. Privacy Policy</h2>
              <p>
                Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by
                reference. Please review our Privacy Policy to understand our practices regarding the collection, use,
                and disclosure of your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">9. Disclaimer of Warranties</h2>
              <p className="mb-4">
                THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>WARRANTIES OF MERCHANTABILITY</li>
                <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>NON-INFRINGEMENT</li>
                <li>ACCURACY, RELIABILITY, OR AVAILABILITY OF THE SITE</li>
                <li>ERROR-FREE OR UNINTERRUPTED OPERATION</li>
              </ul>
              <p className="mt-4">
                We make no warranty that the Site will meet your requirements or that any defects will be corrected. You
                assume all risk associated with the use of the Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">10. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE ADPHARM INC., ITS AFFILIATES,
                DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Loss of profits or revenue</li>
                <li>Loss of data or information</li>
                <li>Loss of business opportunities</li>
                <li>Cost of substitute services</li>
                <li>Any other intangible losses</li>
              </ul>
              <p className="mt-4">
                This limitation applies whether based on warranty, contract, tort (including negligence), or any other
                legal theory, and whether or not we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">11. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless The Adpharm Inc., its affiliates, and their respective
                officers, directors, employees, contractors, agents, and licensors from and against any claims,
                liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable
                attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights, including intellectual property rights</li>
                <li>Your use or misuse of the Site</li>
                <li>Any breach of your representations and warranties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario
                and the federal laws of Canada applicable therein, without regard to conflict of law principles.
              </p>
              <p>
                Any dispute arising from or relating to these Terms or the Site shall be subject to the exclusive
                jurisdiction of the courts located in Ontario, Canada. You irrevocably consent to the jurisdiction of
                such courts and waive any objection to venue or inconvenient forum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">13. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to the Site immediately, without prior notice
                or liability, for any reason, including but not limited to breach of these Terms. Upon termination, your
                right to use the Site will cease immediately, and any provisions of these Terms that by their nature
                should survive termination shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">14. Modifications to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. Material
                changes will be effective immediately upon posting on the Site. Your continued use of the Site following
                the posting of changes constitutes acceptance of those changes. We encourage you to review these Terms
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">15. Severability</h2>
              <p>
                If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity,
                legality, and enforceability of the remaining provisions shall not be affected or impaired. Such invalid
                provision shall be replaced with a valid provision that most closely reflects the original intent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">16. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other legal notices or agreements published on the
                Site, constitute the entire agreement between you and The Adpharm Inc. regarding the use of the Site and
                supersede all prior agreements and understandings, whether written or oral.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">17. Contact Information</h2>
              <p>If you have any questions, concerns, or feedback regarding these Terms, please contact us at:</p>
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
