import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SitePageWidgets } from "@/components/widgets/SitePageWidgets";
import { GtmNoscript, ThirdPartyTags } from "@/components/ThirdPartyTags";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  weight: ["400", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e5e7eb",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Free Statistics Calculators`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  keywords: [...siteConfig.keywords],
  formatDetection: { telephone: false },
  verification: {
    google: siteConfig.googleSiteVerification,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Free Statistics Calculators`,
    description: siteConfig.metaDescription,
    // url omitted on purpose — child routes set openGraph.url to match their canonical
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Free Statistics Calculators`,
    description: siteConfig.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "llms.txt" },
        { url: "/llms-full.txt", title: "llms-full.txt" },
      ],
    },
  },
  other: {
    "google-adsense-account": siteConfig.adsenseClient,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const orgLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.contactEmail,
        description: siteConfig.description,
        foundingDate: "2024",
        sameAs: [`https://${siteConfig.domain}`],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: { "@id": `${siteConfig.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/calculators?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={cn("h-full font-sans antialiased", dmSans.variable, sourceSerif.variable)}
    >
      <body className="flex min-h-full flex-col">
        <GtmNoscript />
        <ThirdPartyTags />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-foreground"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <div id="site-widgets">
          <Suspense fallback={null}>
            <SitePageWidgets />
          </Suspense>
        </div>
        <Footer />
      </body>
    </html>
  );
}
