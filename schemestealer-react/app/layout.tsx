import type { Metadata, Viewport } from "next";
import { Inter, Rajdhani, Cinzel, Orbitron } from 'next/font/google';
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ClientProvider } from "@/components/ClientProvider";
import { ConsentBanner } from "@/components/shared/ConsentBanner";

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fontRajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const fontCinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const fontOrbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SchemeStealer - Paint Colour Detection for Miniatures",
  description: "Scan miniatures and find colour inspiration with AI-powered paint matching for Warhammer and miniature painters",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontInter.variable} ${fontRajdhani.variable} ${fontCinzel.variable} ${fontOrbitron.variable}`}>
      <body className="antialiased bg-[#050505] font-sans">
        <ClientProvider>
          <Navigation />
          <main className="min-h-screen pb-nav-safe">
            {children}
          </main>
          <ConsentBanner />
        </ClientProvider>
      </body>
    </html>
  );
}
