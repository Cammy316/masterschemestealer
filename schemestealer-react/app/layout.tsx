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
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  // Without cover, env(safe-area-inset-*) is 0 on iOS and every pb-nav-safe /
  // safe-area utility in the app silently does nothing.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontInter.variable} ${fontRajdhani.variable} ${fontCinzel.variable} ${fontOrbitron.variable}`}>
      <body suppressHydrationWarning className="antialiased bg-[#050505] font-sans">
        <ClientProvider>
          <Navigation />
          {/* main is the ONLY owner of the viewport floor (svh = stable when the
              mobile URL bar toggles) and the nav-safe bottom padding. Page roots
              use flex-1, never their own min-h-dvh or nav padding. */}
          <main className="min-h-svh pb-nav-safe flex flex-col">
            {children}
          </main>
          <ConsentBanner />
        </ClientProvider>
      </body>
    </html>
  );
}
