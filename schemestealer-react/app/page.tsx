/**
 * Home page - Mode selection (Miniscan vs Inspiration)
 */

import { ModeSelector } from '@/components/ModeSelector';
import { AdMechBackground } from '@/components/shared/AdMechBackground';

export default function Home() {
  return (
    <>
      <AdMechBackground />
      {/* The Daily Augury banner now lives inside ModeSelector's first
          viewport — rendered after it, it sat below the fold. */}
      <ModeSelector />
    </>
  );
}
