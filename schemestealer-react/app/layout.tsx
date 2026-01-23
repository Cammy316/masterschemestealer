import type { Metadata } from "next";
import { Inter, Cinzel, Philosopher } from 'next/font/google';
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-cinzel' });
const philosopher = Philosopher({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-philosopher' });

export const metadata: Metadata = {
  title: "SchemeStealer - Paint Color Detection for Miniatures",
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
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${philosopher.variable}`}>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
