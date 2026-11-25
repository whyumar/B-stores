import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "B-stores — Stories worth keeping",
    template: "%s | B-stores"
  },
  description: "A thoughtfully curated bookstore for curious minds. Find your next favourite read at B-stores.",
  applicationName: "B-stores",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://b-stores.vercel.app"),
  verification: {
    google: "s5biJhoW52LA9YwShTOStKPZzJE37sDKkysy_UHDDbg"
  },
  openGraph: {
    title: "B-stores — Stories worth keeping",
    description: "A thoughtfully curated bookstore for curious minds.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
