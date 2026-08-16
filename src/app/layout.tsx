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
  metadataBase: new URL("https://qclay.design"),
  title: "QClay | Creative Design and Development Agency",
  description: "QClay is a design and development agency that helps startups create products their users love.",
  icons: { icon: "/sites/qclay-design-fc4b5892/root-8a5edab2/favicon.ico" },
  openGraph: {
    title: "QClay Design",
    url: "https://qclay.design",
    type: "website",
    images: [{ url: "/sites/qclay-design-fc4b5892/root-8a5edab2/preview.jpg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
