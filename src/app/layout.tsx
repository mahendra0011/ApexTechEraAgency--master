import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clashGrotesk = localFont({
  src: "../fonts/clash-grotesk-variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apextechera.online"),
  title: {
    default: "ApexTechEra Agency | Next-Gen Creative Design & AI Development Studio",
    template: "%s | ApexTechEra Agency",
  },
  description:
    "ApexTechEra Agency is a premier creative design and full-stack software development agency. We build custom web apps, AI models & automations, mobile apps, UI/UX designs, and scalable cloud systems for high-growth startups and visionary businesses.",
  keywords: [
    "ApexTechEra",
    "ApexTechEra Agency",
    "Apex Tech Era",
    "Creative Design Agency",
    "Web Development Agency",
    "AI Models",
    "AI Agents",
    "AI Automation Agency",
    "UI UX Design Studio",
    "Mobile App Development",
    "Custom Software Development",
    "Cloud Architecture",
    "Full Stack Development",
    "Next.js Development Agency"
  ],
  authors: [{ name: "ApexTechEra Agency", url: "https://apextechera.online" }],
  creator: "ApexTechEra Agency",
  publisher: "ApexTechEra Agency",
  applicationName: "ApexTechEra Agency",
  alternates: {
    canonical: "https://apextechera.online",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ApexTechEra Agency | Next-Gen Creative Design & AI Development",
    description:
      "Premier design & development agency crafting world-class digital experiences, custom web applications, AI models & automations, mobile apps, and scalable software for high-growth startups.",
    url: "https://apextechera.online",
    siteName: "ApexTechEra Agency",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/apex-logo.png",
        width: 1200,
        height: 630,
        alt: "ApexTechEra Agency Logo & Branding",
      },
      {
        url: "/sites/apextechera-design-fc4b5892/root-8a5edab2/preview.jpg",
        width: 1200,
        height: 630,
        alt: "ApexTechEra Agency Studio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexTechEra Agency | Next-Gen Creative Design & AI Development",
    description:
      "Premier design & development studio crafting world-class digital experiences, custom web applications, AI models & automations, mobile apps, and scalable software.",
    creator: "@apextechera",
    images: ["/apex-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://apextechera.online/#organization",
      "name": "ApexTechEra Agency",
      "alternateName": ["ApexTechEra", "Apex Tech Era"],
      "url": "https://apextechera.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://apextechera.online/apex-logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://instagram.com/apextechera",
        "https://twitter.com/apextechera",
        "https://linkedin.com/company/apextechera"
      ],
      "description": "ApexTechEra Agency is a premier creative design and full-stack software development agency engineering custom web applications, AI models & automations, mobile apps, and scalable software for high-growth startups."
    },
    {
      "@type": "WebSite",
      "@id": "https://apextechera.online/#website",
      "url": "https://apextechera.online",
      "name": "ApexTechEra Agency",
      "publisher": {
        "@id": "https://apextechera.online/#organization"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "ApexTechEra Agency",
      "image": "https://apextechera.online/apex-logo.png",
      "url": "https://apextechera.online",
      "priceRange": "$$$",
      "serviceArea": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Agency Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Full Stack Web Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI / UX Design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Android & iOS App Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Models, Agents & Automations" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud & DevOps Architecture" } }
        ]
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en" className={clashGrotesk.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
