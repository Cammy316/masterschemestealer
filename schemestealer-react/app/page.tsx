/**
 * Home page - Mode selection (Miniscan vs Inspiration)
 */

import { ModeSelector } from '@/components/ModeSelector';
import { AdMechBackground } from '@/components/shared/AdMechBackground';

export default function Home() {
  return (
    <>
      <AdMechBackground />
      <ModeSelector />
    </>
  );
}
