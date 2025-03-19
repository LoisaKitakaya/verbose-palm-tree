import MetaTitle from "../components/meta/meta-title";

export default function PrivacyPolicy() {
  const lastUpdatedDate = new Date("2025-01-09");

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(lastUpdatedDate);

  return (
    <>
      <MetaTitle title="Privacy Policy" />

      <div className="px-2 lg:px-4 py-8">
        <div className="w-4/5 mx-auto">
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>

          <p className="italic font-thin">Last updated: {formattedDate}</p>

          <br />

          <p>
            At Uranium Glass, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our platform.
          </p>

          <br />

          <ol className="ml-4">
            <li>
              <p className="text-lg font-semibold mb-2">
                1. Information We Collect
              </p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> <strong>Personal Information:</strong>{" "}
                  Information that identifies you personally, such as name,
                  email address, payment information, and other contact
                  information.
                </li>

                <br />

                <li>
                  <strong>-</strong> <strong>Usage Data:</strong> Information on
                  how you interact with our platform, such as login details, IP
                  address, and device type.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">
                2. How We Use Your Information
              </p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> To provide, operate, and maintain the
                  platform.
                </li>

                <br />

                <li>
                  <strong>-</strong> To process payments and manage billing.
                </li>

                <br />

                <li>
                  <strong>-</strong> To communicate with you, respond to
                  inquiries, and send service-related notifications.
                </li>

                <br />

                <li>
                  <strong>-</strong> For analytics and improvements to our
                  services and user experience.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">
                3. Sharing and Disclosure of Information
              </p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> We may share your data with third-party
                  service providers who assist with service operation, payment
                  processing, or analytics.
                </li>

                <br />

                <li>
                  <strong>-</strong> Legal compliance: We may disclose your
                  information to comply with legal obligations or protect our
                  rights and users.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">
                4. Cookies and Tracking Technologies
              </p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> Our platform uses cookies and similar
                  technologies to personalize user experience, analyze usage,
                  and serve targeted advertisements.
                </li>

                <br />

                <li>
                  <strong>-</strong> You can manage cookie preferences in your
                  browser settings.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">5. Data Security</p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> We implement reasonable security measures
                  to protect your data from unauthorized access, use, or
                  disclosure.
                </li>

                <br />

                <li>
                  <strong>-</strong> However, no electronic storage or
                  transmission is 100% secure, and we cannot guarantee absolute
                  security.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">6. User Rights</p>

              <ul className="ml-4">
                <li>
                  <strong>-</strong> <strong>Access and Update:</strong> You can
                  access and update your account information through your
                  profile settings.
                </li>

                <br />

                <li>
                  <strong>-</strong> <strong>Data Deletion:</strong> You may
                  request the deletion of your data by contacting us at{" "}
                  <a
                    className="link link-primary"
                    href="mailto:info@casaflex.com"
                  >
                    info@casaflex.com
                  </a>
                  .
                </li>

                <br />

                <li>
                  <strong>-</strong> <strong>Opt-Out:</strong> You may opt out
                  of receiving non-essential communications from us by following
                  the unsubscribe instructions in any marketing email.
                </li>
              </ul>
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">7. Retention of Data</p>
              We retain your personal information as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required by law.
            </li>

            <br />

            <li>
              <p className="text-lg font-semibold mb-2">
                8. Changes to This Privacy Policy
              </p>
              We may update this policy from time to time. Changes are effective
              immediately upon posting on this page.
            </li>
          </ol>

          <br />

          <p>
            If you have questions about this Privacy Policy or our data
            practices, please contact us at{" "}
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
