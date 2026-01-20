import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "SchemeSteal - Paint Color Detection for Miniatures",
  description: "Scan miniatures and find color inspiration with AI-powered paint matching for Warhammer and miniature painters",
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
        <Navigation />
        <main className="min-h-screen pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
