import type { Route } from "./+types/accessibility";
import { BackgroundGrid } from "~/components/BackgroundGrid";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Accessibility Statement | The AdPharm" },
    { name: "description", content: "Accessibility commitment and statement for The Adpharm Inc." },
  ];
}

export default function Accessibility() {
  return (
    <div className="antialiased">
      <BackgroundGrid />
      <Navigation />
      <main className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Accessibility Statement</h1>
          <p className="text-white/40 mb-12">Last Updated: January 22, 2026</p>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-white mb-4">Our Commitment to Accessibility</h2>
              <p>
                The Adpharm Inc. is committed to ensuring digital accessibility for people with disabilities. We are
                continually improving the user experience for everyone and applying the relevant accessibility standards
                to ensure we provide equal access to all of our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Conformance Status</h2>
              <p className="mb-4">
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to
                improve accessibility for people with disabilities. It defines three levels of conformance: Level A,
                Level AA, and Level AAA.
              </p>
              <p>
                The Adpharm website (theadpharm.com) is designed to be conformant with{" "}
                <strong className="text-white">WCAG 2.1 Level AAA</strong>. This means we strive to meet the highest
                standard of accessibility to ensure our content is accessible to the widest possible audience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Accessibility Features</h2>
              <p className="mb-4">Our website includes the following accessibility features:</p>

              <h3 className="text-xl font-light text-white mb-3 mt-6">Navigation and Structure</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Semantic HTML markup for proper document structure</li>
                <li>Logical heading hierarchy (H1, H2, H3, etc.)</li>
                <li>Descriptive page titles</li>
                <li>Consistent navigation throughout the site</li>
                <li>Skip navigation links for keyboard users</li>
                <li>Clear focus indicators for interactive elements</li>
              </ul>

              <h3 className="text-xl font-light text-white mb-3 mt-6">Visual Design</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>High contrast text and background color combinations</li>
                <li>Readable font sizes and line spacing</li>
                <li>Consistent visual design and layout</li>
                <li>Responsive design that adapts to different screen sizes and orientations</li>
                <li>Text that can be resized up to 200% without loss of content or functionality</li>
              </ul>

              <h3 className="text-xl font-light text-white mb-3 mt-6">Content</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Alternative text for images and graphics</li>
                <li>Descriptive link text that makes sense out of context</li>
                <li>Clear and simple language</li>
                <li>Properly structured forms with associated labels</li>
                <li>Error identification and suggestions for form inputs</li>
              </ul>

              <h3 className="text-xl font-light text-white mb-3 mt-6">Keyboard Navigation</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All functionality available via keyboard</li>
                <li>Logical tab order through page elements</li>
                <li>Visible keyboard focus indicators</li>
                <li>No keyboard traps</li>
              </ul>

              <h3 className="text-xl font-light text-white mb-3 mt-6">Screen Reader Compatibility</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ARIA landmarks for page regions</li>
                <li>ARIA labels and descriptions where appropriate</li>
                <li>Proper markup for dynamic content updates</li>
                <li>Compatibility with major screen readers (JAWS, NVDA, VoiceOver)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Technical Specifications</h2>
              <p className="mb-4">
                Accessibility of the Adpharm website relies on the following technologies to work with the particular
                combination of web browser and any assistive technologies or plugins installed on your computer:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript (React)</li>
                <li>WAI-ARIA</li>
              </ul>
              <p className="mt-4">
                These technologies are relied upon for conformance with the accessibility standards used. The site is
                designed to work with current and recent versions of major browsers and assistive technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Testing and Evaluation</h2>
              <p className="mb-4">We regularly test our website for accessibility compliance using a combination of:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with keyboard-only navigation</li>
                <li>Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                <li>Browser developer tools and extensions</li>
                <li>Color contrast analyzers</li>
                <li>Mobile device and responsive design testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Known Limitations</h2>
              <p>
                We continuously work to improve the accessibility of our website. At this time, we are not aware of any
                significant accessibility barriers. However, if you encounter any issues or have suggestions for
                improvement, please let us know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Ongoing Efforts</h2>
              <p className="mb-4">
                Accessibility is an ongoing effort, and we are committed to continuous improvement. Our accessibility
                initiatives include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Regular accessibility audits and testing</li>
                <li>Training for our development and content teams on accessibility best practices</li>
                <li>Incorporating accessibility into our design and development processes</li>
                <li>Staying current with evolving accessibility standards and guidelines</li>
                <li>Listening to user feedback and addressing accessibility concerns promptly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Third-Party Content</h2>
              <p>
                We strive to ensure that all content on our website, including any third-party content or embedded
                services, meets our accessibility standards. However, some third-party content may not be fully within
                our control. We work with our partners to ensure the highest level of accessibility possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Feedback and Contact Information</h2>
              <p className="mb-4">
                We welcome your feedback on the accessibility of the Adpharm website. If you encounter any accessibility
                barriers or have suggestions for improvement, please let us know:
              </p>

              <div className="bg-white/5 border border-white/10 p-6 mt-6">
                <h3 className="text-xl font-light text-white mb-4">Contact Methods:</h3>
                <ul className="space-y-3">
                  <li>
                    <strong className="text-white">Email:</strong>{" "}
                    <a href="mailto:digital@theadpharm.com" className="text-[var(--accent-primary)] hover:underline">
                      digital@theadpharm.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-white">Contact Form:</strong> Use the contact form at the bottom of our
                    homepage
                  </li>
                  <li>
                    <strong className="text-white">Mailing Address:</strong>
                    <br />
                    The Adpharm Inc.
                    <br />
                    133 Thomas Street
                    <br />
                    Oakville, Ontario, Canada
                  </li>
                </ul>
              </div>

              <p className="mt-6">When reporting an accessibility issue, please include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>The specific page or feature where you encountered the issue</li>
                <li>A description of the problem</li>
                <li>The assistive technology you were using, if applicable</li>
                <li>Your browser and operating system</li>
              </ul>

              <p className="mt-6">
                We aim to respond to accessibility feedback within 3 business days and to provide a solution or
                alternative within 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Formal Complaints</h2>
              <p>
                If you are not satisfied with our response to your accessibility concerns, you may file a formal
                complaint with the Canadian Human Rights Commission or other appropriate regulatory body in your
                jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Standards and Guidelines</h2>
              <p className="mb-4">This accessibility statement references the following standards and guidelines:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>WCAG 2.1:</strong> Web Content Accessibility Guidelines version 2.1 (Level AAA)
                </li>
                <li>
                  <strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act (Ontario, Canada)
                </li>
                <li>
                  <strong>Section 508:</strong> U.S. Rehabilitation Act Section 508 Standards
                </li>
                <li>
                  <strong>EN 301 549:</strong> European accessibility standard for ICT products and services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-white mb-4">Assessment and Documentation</h2>
              <p>
                This accessibility statement was last reviewed and updated on January 22, 2026. Our commitment to
                accessibility is ongoing, and this statement will be updated as we continue to improve our website and
                implement new accessibility features.
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
