import type { ReactNode } from "react";

type PolicyPageProps = {
  title: string;
  description: string;
  updatedAt: string;
  children: ReactNode;
};

export function PolicyPage({ title, description, updatedAt, children }: PolicyPageProps) {
  return (
    <main className="policy-page">
      <header className="policy-header">
        <a href="/" className="brand policy-brand" aria-label="B-stores home">
          <span className="brand-mark">b.</span><span>B-stores</span>
        </a>
        <nav className="policy-nav" aria-label="Legal pages">
          <a href="/privacy" aria-current={title === "Privacy Policy" ? "page" : undefined}>Privacy</a>
          <a href="/terms" aria-current={title === "Terms & Conditions" ? "page" : undefined}>Terms</a>
          <a href="/">Storefront <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <div className="policy-shell">
        <div className="policy-heading">
          <p className="eyebrow">THE IMPORTANT DETAILS</p>
          <h1>{title}</h1>
          <p className="policy-summary">{description}</p>
          <p className="policy-updated">LAST UPDATED · {updatedAt.toUpperCase()}</p>
        </div>

        <article className="policy-content">{children}</article>

        <div className="policy-return">
          <span>Still have a question?</span>
          <p>Use the contact channel provided by the B-stores operator or in your payment correspondence. Please do not send passwords or full payment-card details.</p>
          <a href="/">← Back to B-stores</a>
        </div>
      </div>

      <footer className="policy-footer">
        <span>© {new Date().getFullYear()} B-STORES. ALL STORIES RESERVED.</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms & Conditions</a></div>
      </footer>
    </main>
  );
}
