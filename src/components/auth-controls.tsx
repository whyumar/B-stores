"use client";

import { useState, type FormEvent } from "react";
import { LogOut, UserRound, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";

export function AuthControls() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message || "We couldn't complete that request. Please try again.");
        return;
      }
      setPassword("");
      setOpen(false);
    } catch {
      setError("We couldn't reach the account service. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      await authClient.signOut();
      setOpen(false);
    } catch {
      setError("We couldn't sign you out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const user = session?.user;

  return (
    <>
      <button type="button" className="account-trigger" onClick={() => { setOpen(true); setError(""); }}>
        <UserRound size={16} />
        <span>{isPending ? "Account" : user ? user.name.split(" ")[0] : "Sign in"}</span>
      </button>

      {open && (
        <div className="auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button type="button" className="auth-close" onClick={() => setOpen(false)} aria-label="Close account dialog"><X size={19} /></button>
            {user ? (
              <div className="auth-account">
                <p className="eyebrow">YOUR B-STORES ACCOUNT</p>
                <h2 id="auth-title">Welcome back.</h2>
                <div className="auth-user-card">
                  <span className="auth-avatar"><UserRound size={22} /></span>
                  <span><strong>{user.name}</strong><small>{user.email}</small></span>
                </div>
                <p className="auth-helper">You can keep shopping and checking out while signed in, or sign out whenever you like.</p>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button type="button" className="button button-primary button-full auth-submit" onClick={signOut} disabled={busy}>
                  <LogOut size={16} /> {busy ? "Signing out…" : "Sign out"}
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">A LITTLE MORE PERSONAL</p>
                <h2 id="auth-title">{mode === "signup" ? "Create your account." : "Good to see you."}</h2>
                <p className="auth-helper">An account is optional. You can always browse, add to your bag, and pay as a guest.</p>
                <div className="auth-tabs" role="tablist" aria-label="Account action">
                  <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "auth-tab auth-tab-active" : "auth-tab"} onClick={() => { setMode("signin"); setError(""); }}>Sign in</button>
                  <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "auth-tab auth-tab-active" : "auth-tab"} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
                </div>
                <form className="auth-form" onSubmit={submit}>
                  {mode === "signup" && (
                    <>
                      <label htmlFor="auth-name">FULL NAME</label>
                      <input id="auth-name" required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
                    </>
                  )}
                  <label htmlFor="auth-email">EMAIL ADDRESS</label>
                  <input id="auth-email" required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
                  <label htmlFor="auth-password">PASSWORD</label>
                  <input id="auth-password" required type="password" minLength={8} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
                  {error && <p className="auth-error" role="alert">{error}</p>}
                  <button className="button button-primary button-full auth-submit" type="submit" disabled={busy}>
                    {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                  </button>
                </form>
                <p className="auth-footnote">Your account is secured with Better Auth. Guest checkout stays available either way.</p>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
