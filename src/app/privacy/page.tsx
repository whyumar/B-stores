import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how B-stores handles account, checkout, and website information."
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="A clear account of the information used to run the B-stores bookshelf, optional accounts, and secure checkout."
      updatedAt="25 November 2026"
    >
      <p className="policy-lead">Your trust matters. This policy explains what information the current B-stores website handles, why it is used, and which service providers are involved.</p>

      <h2>1. Who operates this website</h2>
      <p>B-stores is the online bookstore brand presented on this website. The website does not currently display the operator’s registered legal name, business address, or a dedicated privacy email address. Those details should be added by the operator before the store is used for ongoing commercial orders.</p>

      <h2>2. Information we handle</h2>
      <ul>
        <li><strong>Checkout details:</strong> your name, email address, selected books, quantities, order reference, and the amount and currency required to create a payment request.</li>
        <li><strong>Optional account details:</strong> if you register, Better Auth processes your account name, email address, password credential, and session information. Authentication records are stored in the B-stores Neon PostgreSQL database. You do not need an account to browse or check out.</li>
        <li><strong>Basket information:</strong> the current basket is saved in your browser’s local storage so it can remain available when you return to the site.</li>
        <li><strong>Technical information:</strong> the website and its infrastructure providers may process request, device, browser, IP-address, and diagnostic information for security, reliability, and troubleshooting.</li>
      </ul>

      <h2>3. How we use information</h2>
      <p>Information is used to operate the storefront, keep an optional account signed in, prepare a checkout request, communicate with the payment service, verify payment status, protect the website from misuse, and respond to requests. We do not require registration for ordinary browsing or guest checkout.</p>

      <h2>4. Payments and service providers</h2>
      <p>When you continue to payment, B-stores sends the customer name and email address, order reference, order description, amount, and return URL to PakPays to create the hosted payment session and check its status. Payment details that you enter on the hosted payment page are handled by PakPays and its payment partners, not collected by the B-stores checkout form. PakPays has its own terms and privacy practices, which you should review before paying.</p>
      <p>The website is hosted through Vercel, and optional account records are held in a Neon database. These providers process information as needed to deliver their infrastructure services and are subject to their own terms and privacy documentation.</p>

      <h2>5. Cookies and browser storage</h2>
      <p>The basket uses local storage in your browser. If you sign in, authentication uses session cookies and related session data to keep your account secure. Blocking browser storage or cookies may affect basket persistence or sign-in features, but guest browsing may still be available.</p>

      <h2>6. Newsletter and marketing</h2>
      <p>The “reading letter” area on the current website is a coming-soon notice, not an active newsletter subscription form. It does not currently sign you up to receive marketing emails.</p>

      <h2>7. Sharing and retention</h2>
      <p>We share information with the infrastructure and payment providers described above only as needed to operate the website, authenticate accounts, and process or verify payments. The current B-stores application does not maintain its own order-history or fulfilment database. Payment and transaction records may therefore be retained by PakPays under its own policies. Account and security records are retained for as long as needed to provide the account service, protect the website, and meet applicable obligations.</p>

      <h2>8. Your choices and requests</h2>
      <p>You can browse and check out without creating an account. You can clear the saved basket by clearing this site’s browser storage. You may also ask the B-stores operator to review, correct, or delete account information, subject to applicable law and records that must be retained for security or legal reasons. A dedicated privacy contact is not yet published on this website; the operator should add a monitored contact email and business address here.</p>

      <h2>9. Security</h2>
      <p>Reasonable technical measures are used to protect the website and account functionality. No website, internet transmission, or storage system can be guaranteed to be completely secure. Keep your account credentials private and contact the operator promptly if you believe your account has been accessed without permission.</p>

      <h2>10. Children and changes</h2>
      <p>This website is intended for a general bookstore audience and is not designed to collect personal information from children knowingly. We may update this policy as the website or its services change. The “Last updated” date above indicates the latest published revision.</p>

      <div className="policy-note">
        <strong>Important service note</strong>
        <p>The current checkout does not collect a postal delivery address, and the website does not yet provide an in-site order-history or fulfilment system. Do not assume that payment creates a delivery arrangement; confirm fulfilment details with the store operator before placing a paid order.</p>
      </div>
    </PolicyPage>
  );
}
