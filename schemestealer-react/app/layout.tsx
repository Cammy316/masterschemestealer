import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "SchemeStealer - Paint Colour Detection for Miniatures",
  description: "Scan miniatures and find colour inspiration with AI-powered paint matching for Warhammer and miniature painters",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        <ClientProvider>
          <Navigation />
          <main className="min-h-screen pb-nav-safe">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
