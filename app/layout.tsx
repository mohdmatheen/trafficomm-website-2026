import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";
import { company, siteUrl } from "@/data/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
// Mono is used only for small labels. "optional" avoids a late swap re-wrapping label lines (CLS on slow
// connections); first slow visits keep the near-identical system monospace, cached visits use Geist Mono.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "optional" });
// Poppins SemiBold is used only for the wordmark, matching the brand logotype.
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: "600", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Performance Operations. Built to Scale.`,
    template: `%s | ${company.name}`,
  },
  description:
    "Trafficomm is the performance operations layer behind agencies, ad-tech companies, publishers and brands: ad operations, performance marketing, programmatic, measurement and reporting since 2015.",
  applicationName: company.name,
  openGraph: { siteName: company.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f6f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables reveal animations only when JS is running, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
