import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://srikode.dev"),
  title: {
    default: "SriKode — Web Development Tutorials & Guides",
    template: "%s | SriKode",
  },
  description: "Learn HTML, CSS, JavaScript, React, Next.js, and modern full-stack web development through step-by-step practical guides.",
  keywords: ["web development", "tutorials", "coding", "HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "MongoDB", "learn programming"],
  authors: [{ name: "Srikant Sahu" }],
  creator: "Srikant Sahu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://srikode.dev",
    siteName: "SriKode",
    title: "SriKode — Web Development Tutorials & Guides",
    description: "Learn HTML, CSS, JavaScript, React, Next.js, and modern full-stack web development through step-by-step practical guides.",
    images: [
      {
        url: "https://picsum.photos/seed/srikode-og/1200/630",
        width: 1200,
        height: 630,
        alt: "SriKode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SriKode — Web Development Tutorials & Guides",
    description: "Learn HTML, CSS, JavaScript, React, Next.js, and modern full-stack web development through step-by-step practical guides.",
    images: ["https://picsum.photos/seed/srikode-og/1200/630"],
    creator: "@srikantdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
