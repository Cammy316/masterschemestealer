import { Metadata } from 'next';
import { DailyGameUI } from '@/components/daily/DailyGameUI';
import { CleanThematicBackground } from '@/components/shared/CleanThematicBackground';

export const metadata: Metadata = {
  title: 'Swatchle | SchemeStealer',
  description: 'Identify the daily target cogno-meme paint in 6 guesses or fewer.',
  openGraph: {
    title: 'Swatchle | SchemeStealer',
    description: 'Identify the daily target cogno-meme paint in 6 guesses or fewer.',
  }
};

export default function DailyPage() {
  return (
    <>
      <CleanThematicBackground />
      <DailyGameUI />
    </>
  );
}
