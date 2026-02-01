import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "SchemeStealer - Paint Colour Detection for Miniatures",
  description: "Scan miniatures and find colour inspiration with AI-powered paint matching for Warhammer and miniature painters",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#2563eb",
  manifest: "/manifest.json",
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
          <main className="min-h-screen pb-20">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
