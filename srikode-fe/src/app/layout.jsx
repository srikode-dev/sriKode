import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import { getCmsConfig } from "@/lib/api";

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
  authors: [{ name: "SriKode" }],
  creator: "SriKode",
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
    creator: "@srikode",
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

export default async function RootLayout({ children }) {
  let theme = null;
  try {
    const cms = await getCmsConfig();
    if (cms?.theme) {
      theme = cms.theme;
    }
  } catch (err) {
    // Graceful fallback to default CSS theme
  }

  const primaryColor = theme?.primaryColor || "#2563eb";
  const primaryHover = theme?.primaryHover || "#1d4ed8";
  const primaryLight = theme?.primaryLight || "#eff6ff";
  const primaryText = theme?.primaryText || "#1d4ed8";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --sk-primary: ${primaryColor} !important;
                --sk-primary-hover: ${primaryHover} !important;
                --sk-primary-light: ${primaryLight} !important;
                --sk-primary-text: ${primaryText} !important;
                --primary: var(--sk-primary) !important;
                --primary-hover: var(--sk-primary-hover) !important;
              }
              .dark {
                --sk-primary: ${primaryColor} !important;
                --sk-primary-hover: ${primaryHover} !important;
                --sk-primary-light: ${primaryLight.startsWith('#') ? `${primaryLight}25` : primaryLight} !important;
                --sk-primary-text: ${primaryText} !important;
                --primary: var(--sk-primary) !important;
                --primary-hover: var(--sk-primary-hover) !important;
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
