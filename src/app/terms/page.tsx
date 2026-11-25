import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms for browsing and using B-stores and its hosted checkout."
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      description="The ground rules for using B-stores, placing a payment request, and using an optional customer account."
      updatedAt="25 November 2026"
    >
      <p className="policy-lead">By accessing or using the B-stores website, you agree to these terms. Please read them before using the storefront or continuing to a payment provider.</p>

      <h2>1. About B-stores</h2>
      <p>B-stores is an online bookstore website that presents a curated catalogue and provides a link to a hosted payment service. The legal name and business address of the website operator are not currently displayed on this site; the operator should publish those details and a monitored customer-support contact before accepting ongoing commercial orders.</p>

      <h2>2. Using the website</h2>
      <p>You agree to use the website lawfully and not to interfere with its operation, attempt unauthorised access, submit malicious code, misuse another person’s account, or use the checkout for fraudulent or prohibited activity. We may restrict access where reasonably necessary to protect the website, customers, or service providers.</p>

      <h2>3. Accounts are optional</h2>
      <p>You may browse the catalogue, use the basket, and proceed to checkout as a guest. Creating a Better Auth account is optional. If you create an account, provide accurate information, keep your password confidential, and tell the operator if you suspect unauthorised use. You are responsible for activity carried out through your account, except where applicable law provides otherwise.</p>

      <h2>4. Catalogue and prices</h2>
      <p>We aim to present book titles, descriptions, and prices clearly, but catalogue information, availability, and prices may change without notice. Prices are displayed in Pakistani rupees (PKR). The server calculates the basket amount from the current catalogue; the final amount, any applicable payment-service fees, and the currency shown by PakPays should be reviewed on the hosted payment page before you authorise payment.</p>

      <h2>5. Checkout and payment status</h2>
      <p>When you submit checkout, B-stores sends your name, email address, order summary, reference, and payment amount to PakPays to create a hosted payment session. You will be redirected to PakPays to complete payment. A redirect back to B-stores, a browser message, or a submitted checkout form is not by itself proof that payment succeeded. Payment status is checked with the payment service; only a status confirmed by the service as approved or merchant-approved is treated by the website as confirmed.</p>
      <p>Payments are subject to PakPays’ terms, privacy practices, payment methods, and availability. We do not collect or store your full card or bank credentials in the B-stores checkout form.</p>

      <div className="policy-note">
        <strong>Important: delivery and fulfilment are not yet configured</strong>
        <p>The current website does not collect a postal delivery address, display shipping choices or delivery estimates, or provide order fulfilment and tracking. Do not complete a paid order unless the store operator has separately confirmed how the books will be supplied and delivered to you.</p>
      </div>

      <h2>6. Cancellations, returns, and refunds</h2>
      <p>This website does not currently publish a return window, cancellation workflow, or refund timetable. Contact the store operator and obtain confirmation of the applicable arrangements before paying. Nothing in these terms is intended to remove consumer rights or remedies that cannot lawfully be excluded under applicable law. Payment disputes and payment-method reversals may also be subject to PakPays’ and your financial provider’s procedures.</p>

      <h2>7. Third-party services and links</h2>
      <p>Checkout is provided through PakPays, and the website relies on external hosting, database, and authentication infrastructure. Third-party services are governed by their own terms and policies. B-stores is not responsible for the availability or content of third-party services, subject to rights and responsibilities that cannot be excluded by law.</p>

      <h2>8. Website content and intellectual property</h2>
      <p>Unless stated otherwise, the B-stores name, design, written content, and website presentation are owned by or used with permission by the website operator. Book titles, author names, and other publisher materials remain the property of their respective rights holders. You may use the website for personal, lawful shopping and browsing, but may not copy, republish, or commercially exploit website content without permission or a lawful basis.</p>

      <h2>9. Availability and liability</h2>
      <p>We aim to keep the website available and accurate but do not promise uninterrupted or error-free operation. To the extent permitted by applicable law, the website is provided on an “as available” basis. Nothing in these terms excludes liability, consumer guarantees, or other protections where exclusion is not permitted by law. You remain responsible for checking the payment details and arrangements presented before authorising a transaction.</p>

      <h2>10. Changes to these terms</h2>
      <p>We may update these terms as the website, catalogue, or services change. The latest revision date appears at the top of this page. Continued use of the website after updated terms are published means you acknowledge the revised terms, to the extent permitted by applicable law.</p>

      <h2>11. Applicable law and contact</h2>
      <p>These terms are subject to the laws that apply to the website operator and the transaction, while preserving any mandatory consumer protections that apply to you. The operator’s legal identity, business address, customer-support email, and formal complaints process should be added to this page before the website is used for ongoing commercial sales.</p>
    </PolicyPage>
  );
}
