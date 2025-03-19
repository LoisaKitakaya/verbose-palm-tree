import MetaTitle from "../components/meta/meta-title";

export default function TermsAndConditions() {
    const lastUpdatedDate = new Date("2025-01-09");

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(lastUpdatedDate);

    return (
      <>
        <MetaTitle title="Terms and Conditions" />

        <div className="px-2 lg:px-4 py-8">
          <div className="w-4/5 mx-auto">
            <h1 className="text-2xl font-semibold">Terms And Conditions</h1>

            <p className="italic font-thin">Last updated: {formattedDate}</p>

            <br />

            <p>
              Welcome to Uranium Glass, a SaaS for managing real estate
              properties, transactions, and user interactions. By using our
              service, you agree to these Terms and Conditions. Please read them
              carefully.
            </p>

            <br />

            <ol className="ml-4">
              <li>
                <p className="text-lg font-semibold mb-2">
                  1. Acceptance of Terms
                </p>
                By accessing and using our services, you confirm your agreement
                to these terms and our{" "}
                <a className="link link-primary" href="privacy-policy">
                  Privacy Policy
                </a>
                . If you do not agree, you may not use our platform.
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  2. Services Provided
                </p>
                We provide tools for property listings, management, and
                interaction between property managers, landlords, tenants, and
                potential buyers. Our services are for informational and
                management purposes only and should not be construed as legal or
                financial advice.
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  3. Account Creation and Security
                </p>

                <ul className="ml-4">
                  <li>
                    <strong>-</strong> Users must provide accurate, complete
                    information when creating an account.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> Each user is responsible for maintaining
                    the confidentiality of their account credentials.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> Unauthorized access or use of accounts
                    may lead to suspension or termination.
                  </li>
                </ul>
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">4. User Conduct</p>

                <ul className="ml-4">
                  <li>
                    <strong>-</strong> You agree to use our services only for
                    lawful purposes and in accordance with these terms.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> Prohibited conduct includes, but is not
                    limited to, misuse of data, harassment, distribution of
                    harmful software, and unauthorized access.
                  </li>
                </ul>
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  5. Content Ownership and License
                </p>

                <ul className="ml-4">
                  <li>
                    <strong>-</strong> Users retain ownership of content they
                    upload, such as property images and descriptions.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> By submitting content, you grant us a
                    worldwide, non-exclusive license to use, display, and
                    distribute this content to provide the intended services.
                  </li>
                </ul>
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  6. Data and Privacy
                </p>
                Our collection, use, and storage of personal information are
                governed by our{" "}
                <a className="link link-primary" href="privacy-policy">
                  Privacy Policy
                </a>
                . By using the platform, you agree to the processing of your
                data in accordance with our{" "}
                <a className="link link-primary" href="privacy-policy">
                  Privacy Policy
                </a>
                .
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  7. Payments and Fees
                </p>

                <ul className="ml-4">
                  <li>
                    <strong>-</strong> [Outline any subscription or usage fees
                    if applicable, including payment terms, cancellation
                    policies, and refund policies].
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> Failure to pay fees on time may result in
                    service suspension.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong>{" "}
                    <span className="font-light italic">
                      <strong>NOTE</strong>: This only applies to property
                      managers. Any failures by a tenant to pay fees on time,
                      should be addressed py the property manager. Boma Yetu has
                      no part in agreements or disagreements between property
                      managers and tenants.
                    </span>
                  </li>
                </ul>
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  8. Disclaimer of Warranties
                </p>

                <ul className="ml-4">
                  <li>
                    <strong>-</strong> Our platform is provided "as is" without
                    warranties of any kind.
                  </li>

                  <br />

                  <li>
                    <strong>-</strong> We do not guarantee that the services
                    will be uninterrupted, secure, or error-free.
                  </li>
                </ul>
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">
                  9. Limitation of Liability
                </p>
                In no event shall Uranium Glass be liable for any indirect,
                incidental, or consequential damages arising from your use of
                the platform.
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">10. Termination</p>
                We reserve the right to terminate or suspend your account for
                violations of these terms, inactivity, or at our discretion.
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">11. Modifications</p>
                We may update these Terms from time to time. Continued use of
                the platform constitutes acceptance of the updated Terms.
              </li>

              <br />

              <li>
                <p className="text-lg font-semibold mb-2">12. Governing Law</p>
                These Terms are governed by the laws of the{" "}
                <a
                  className="link link-primary"
                  href="https://en.wikipedia.org/wiki/Kenya"
                >
                  Republic of Kenya
                </a>
                .
              </li>
            </ol>

            <br />

            <p>
              If you have any questions about these terms, please contact us at{" "}
              <a className="link link-primary" href="mailto:info@casaflex.com">
                info@casaflex.com
              </a>
              .
            </p>
          </div>
        </div>
      </>
    );
}