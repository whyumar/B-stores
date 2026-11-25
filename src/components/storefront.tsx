"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, ChevronDown, Heart, Menu, Minus, Plus,
  Search, ShieldCheck, ShoppingBag, Sparkles, X
} from "lucide-react";
import { books, formatPrice, type Book } from "@/lib/books";
import { authClient } from "@/lib/auth-client";
import { AuthControls } from "@/components/auth-controls";

type CartLine = { id: string; quantity: number };

const categories = ["All books", ...Array.from(new Set(books.map((book) => book.category)))];

export function Storefront() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const { data: session } = authClient.useSession();
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All books");
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("b-stores-cart");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const restored = parsed.filter((line): line is CartLine =>
            Boolean(line) &&
            typeof line.id === "string" &&
            books.some((book) => book.id === line.id) &&
            Number.isInteger(line.quantity) &&
            line.quantity >= 1 &&
            line.quantity <= 10
          );
          setCart(restored);
        }
      }
    } catch {
      window.localStorage.removeItem("b-stores-cart");
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem("b-stores-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (session?.user) {
      setCustomerName((current) => current || session.user.name || "");
      setCustomerEmail((current) => current || session.user.email || "");
    }
  }, [session?.user?.name, session?.user?.email]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setCartOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleBooks = useMemo(() => books.filter((book) => {
    const matchesCategory = activeCategory === "All books" || book.category === activeCategory;
    const text = (book.title + " " + book.author + " " + book.category).toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase().trim());
  }), [activeCategory, query]);

  const cartLines = cart.map((line) => ({ ...line, book: books.find((book) => book.id === line.id) })).filter((line): line is CartLine & { book: Book } => Boolean(line.book));
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartLines.reduce((sum, line) => sum + line.book.price * line.quantity, 0);

  const addToCart = (book: Book) => {
    setCart((current) => {
      const found = current.find((line) => line.id === book.id);
      return found
        ? current.map((line) => line.id === book.id ? { ...line, quantity: Math.min(10, line.quantity + 1) } : line)
        : [...current, { id: book.id, quantity: 1 }];
    });
    setCartOpen(true);
    setCheckoutMode(false);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) => current
      .map((line) => line.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0 && line.quantity <= 10));
  };

  const beginCheckout = () => {
    setCheckoutError("");
    setCheckoutMode(true);
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setCheckoutError("");
    const reference = "BKS-" + (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart.map((line) => ({ id: line.id, quantity: line.quantity })),
          customer_name: customerName,
          customer_email: customerEmail,
          client_order_id: reference
        })
      });
      const result = await response.json() as { ok?: boolean; payment_url?: string; error?: string };
      if (!response.ok || result.ok !== true || !result.payment_url) {
        throw new Error(result.error || "We couldn't start checkout. Please try again.");
      }
      window.location.assign(result.payment_url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const closeCart = () => {
    setCartOpen(false);
    setCheckoutMode(false);
    setCheckoutError("");
  };

  return (
    <main>
      <div className="announcement">
        <span className="announcement-star">✳</span>
        A little more wonder in every order <span className="announcement-divider">/</span> Curated for curious minds
        <span className="announcement-star">✳</span>
      </div>

      <header className="site-header">
        <Link hrefTop="/" className="brand"><span className="brand-mark">b.</span><span>B-stores</span></Link>
        <nav className={"main-nav " + (menuOpen ? "main-nav-open" : "")}>
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#bestsellers" onClick={() => setMenuOpen(false)}>Bestsellers</a>
          <a href="#our-story" onClick={() => setMenuOpen(false)}>Our story</a>
        </nav>
        <div className="header-actions">
          <label className="header-search">
            <Search size={16} />
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book..." aria-label="Search books" />
            <kbd>⌘ K</kbd>
          </label>
          <AuthControls />
          <button type="button" className="icon-button cart-trigger" onClick={() => setCartOpen(true)} aria-label={"Open basket, " + itemCount + " items"}>
            <ShoppingBag size={19} /><span className="cart-count">{itemCount}</span>
          </button>
          <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span></span> THE INDEPENDENT BOOKSTORE FOR EVERY KIND OF CURIOUS</div>
          <h1>Stories worth<br /><em>keeping.</em></h1>
          <p className="hero-description">Find the words that stay with you. Thoughtful reads, timeless ideas, and new worlds — picked for the way you see life.</p>
          <div className="hero-cta-row">
            <a className="button button-primary" href="#discover">Explore the collection <ArrowUpRight size={17} /></a>
            <span className="hero-note"><Sparkles size={15} /> A good book changes everything</span>
          </div>
          <div className="hero-meta">
            <div className="reader-stack"><span>R</span><span>A</span><span>M</span><span>+</span></div>
            <div><strong>For the endlessly curious</strong><small>Your next favourite is waiting</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image"></div>
          <div className="hero-image-shade"></div>
          <div className="hero-image-caption"><span>THE ART OF SLOWING DOWN</span><span>VOL. 01 — READ MORE</span></div>
          <div className="hero-sticker"><span>READ</span><strong>MORE.</strong><span>WORRY LESS.</span><i>✳</i></div>
          <div className="hero-side-note">A BOOK IS A DOOR<br />YOU CAN ALWAYS OPEN.</div>
        </div>
        <div className="hero-index"><span>01</span><span className="hero-index-line"></span><span>04</span></div>
      </section>

      <div className="value-strip">
        <div><span className="value-icon"><Sparkles size={16} /></span><span>Thoughtfully curated</span></div>
        <div><span className="value-icon"><ShieldCheck size={16} /></span><span>Secure PakPays checkout</span></div>
        <div><span className="value-icon"><Heart size={16} /></span><span>Made for book people</span></div>
        <div className="value-location">INDEPENDENT SPIRIT. ENDLESS STORIES.</div>
      </div>

      <section className="collection-section" id="discover">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE BOOKSHELF</p>
            <h2>Find your <em>next thing.</em></h2>
            <p className="section-intro">A collection for big thinkers, late-night readers, and people who love a well-turned page.</p>
          </div>
          <div className="collection-count">{visibleBooks.length.toString().padStart(2, "0")} <span>BOOKS TO EXPLORE</span></div>
        </div>

        <div className="filter-row">
          <div className="category-filters" aria-label="Filter by category">
            {categories.map((category) => (
              <button type="button" key={category} onClick={() => setActiveCategory(category)} className={"filter-chip " + (activeCategory === category ? "filter-chip-active" : "")}>{category}</button>
            ))}
          </div>
          <span className="filter-hint"><ChevronDown size={14} /> HANDPICKED FOR YOU</span>
        </div>

        {visibleBooks.length ? (
          <div className="book-grid">
            {visibleBooks.map((book, index) => (
              <article className="book-card" key={book.id}>
                <div className="book-art-wrap">
                  <div className={"book-art cover-" + book.cover}>
                    <span className="book-art-top">B–STORES <span>✳</span></span>
                    <div className="book-art-title">{book.mark.split("\n").map((part) => <span key={part}>{part}</span>)}</div>
                    <span className="book-art-author">{book.author.toUpperCase()}</span>
                    <span className="book-art-number">0{index + 1}</span>
                  </div>
                  {book.badge && <span className="book-badge">{book.badge}</span>}
                  <button type="button" className="quick-add" onClick={() => addToCart(book)} aria-label={"Add " + book.title + " to basket"}><Plus size={18} /></button>
                </div>
                <div className="book-info">
                  <div className="book-category">{book.category}</div>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <div className="book-bottom"><strong>{formatPrice(book.price)}</strong><button type="button" onClick={() => addToCart(book)}>Add to bag <ArrowUpRight size={14} /></button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results"><Search size={25} /><h3>No books found just yet.</h3><p>Try a different title, author, or category.</p><button className="text-link" onClick={() => { setQuery(""); setActiveCategory("All books"); }}>Clear filters <ArrowRight size={14} /></button></div>
        )}
      </section>

      <section className="editorial-section" id="bestsellers">
        <div className="editorial-image">
          <div className="editorial-image-inner"></div>
          <span className="editorial-stamp">THE<br />GOOD<br />PAGES<br /><b>✳</b></span>
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">A NOTE FROM OUR BOOKSHELF</p>
          <h2>Less scrolling.<br /><em>More soul-stirring.</em></h2>
          <p>We believe the right book finds you at exactly the right time. That&apos;s why our shelves are built around ideas worth sitting with, stories worth sharing, and pages you&apos;ll want to return to.</p>
          <a className="editorial-link" href="#discover">Meet your next favourite <ArrowUpRight size={17} /></a>
          <div className="editorial-signoff">KEEP TURNING PAGES. <span>— B.</span></div>
        </div>
      </section>

      <section className="quote-section">
        <span className="quote-mark">“</span>
        <p>A room without books<br />is like a body without a soul.</p>
        <span className="quote-attribution">— CICERO, VIA OUR BOOKSHELF</span>
        <span className="quote-spark">✳</span>
      </section>

      <section className="newsletter-section" id="our-story">
        <div className="newsletter-deco">✳</div>
        <div>
          <p className="eyebrow">A LETTER FOR THE LOVE OF BOOKS</p>
          <h2>Good things come<br /><em>to those who read.</em></h2>
          <p>Fresh finds, thoughtful recommendations, and little notes from our reading corner.</p>
        </div>
        <div className="newsletter-form newsletter-coming-soon">
          <span>THE READING LETTER</span>
          <p>Our first reading letter is in the works. Until then, discover something good.</p>
          <a href="#discover">Browse the collection <ArrowRight size={16} /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <Link hrefTop="/" className="brand brand-footer"><span className="brand-mark">b.</span><span>B-stores</span></Link>
          <p>For the love of a good story.<br /><em>And the people who read them.</em></p>
          <a href="#discover" className="back-top">BACK TO THE BOOKSHELF ↑</a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} B-STORES. ALL STORIES RESERVED.</span><span>THOUGHTFULLY CURATED, ALWAYS.</span><span className="footer-made">MADE WITH <Heart size={12} /> FOR READERS</span></div>
      </footer>

      {cartOpen && (
        <div className="drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCart(); }}>
          <aside className="cart-drawer" aria-label="Shopping basket">
            <div className="drawer-header"><div><p className="eyebrow">{checkoutMode ? "ALMOST YOURS" : "YOUR LITTLE BOOK HAUL"}</p><h2>{checkoutMode ? "Checkout." : "Your bag."}</h2></div><button className="icon-button" type="button" onClick={closeCart} aria-label="Close basket"><X size={21} /></button></div>

            {!checkoutMode ? (
              <>
                {cartLines.length ? (
                  <div className="cart-lines">
                    {cartLines.map((line) => (
                      <div className="cart-line" key={line.id}>
                        <div className={"cart-mini-cover cover-" + line.book.cover}><span>{line.book.mark.split("\n")[0]}</span></div>
                        <div className="cart-line-info"><strong>{line.book.title}</strong><span>{line.book.author}</span><b>{formatPrice(line.book.price)}</b><div className="quantity-control"><button type="button" onClick={() => changeQuantity(line.id, -1)} aria-label="Decrease quantity"><Minus size={12} /></button><span>{line.quantity}</span><button type="button" onClick={() => changeQuantity(line.id, 1)} aria-label="Increase quantity" disabled={line.quantity >= 10}><Plus size={12} /></button></div></div>
                        <button type="button" className="remove-line" onClick={() => changeQuantity(line.id, -line.quantity)} aria-label={"Remove " + line.book.title}><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cart-empty"><span><ShoppingBag size={26} /></span><h3>Your bag is waiting.</h3><p>Every great collection starts with one good book.</p><button type="button" className="button button-primary" onClick={closeCart}>Explore books <ArrowRight size={16} /></button></div>
                )}
                {cartLines.length > 0 && (
                  <div className="drawer-bottom">
                    <div className="subtotal-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                    <p>Final payable amount is confirmed securely by PakPays at checkout.</p>
                    <button type="button" className="button button-primary button-full" onClick={beginCheckout}>Continue to checkout <ArrowRight size={17} /></button>
                    <div className="drawer-secure"><ShieldCheck size={14} /> Secure payment powered by PakPays</div>
                  </div>
                )}
              </>
            ) : (
              <form className="checkout-form" onSubmit={submitCheckout}>
                <button type="button" className="back-to-bag" onClick={() => { setCheckoutMode(false); setCheckoutError(""); }}>← Back to your bag</button>
                <div className="checkout-intro"><span>01</span><div><strong>Your details</strong><small>So your order has a name to go with it.</small></div></div>
                <label htmlFor="customer-name">FULL NAME</label>
                <input id="customer-name" required minLength={2} maxLength={120} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your full name" />
                <label htmlFor="customer-email">EMAIL ADDRESS</label>
                <input id="customer-email" required type="email" maxLength={254} autoComplete="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="you@example.com" />
                <div className="checkout-total"><span>Order total</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="payment-note"><ShieldCheck size={17} /><span>You&apos;ll continue to PakPays&apos; secure hosted checkout to complete your payment in PKR.</span></div>
                {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                <button className="button button-primary button-full" type="submit" disabled={submitting || cartLines.length === 0}>{submitting ? "Connecting to PakPays…" : "Continue to secure payment"} <ArrowRight size={17} /></button>
                <p className="checkout-fineprint">Your payment is verified by the bookstore server with PakPays. A return to this site alone is never treated as proof of payment.</p>
              </form>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

function Link({ hrefTop, children, className }: { hrefTop: string; children: ReactNode; className?: string }) {
  return <a href={hrefTop} className={className}>{children}</a>;
}