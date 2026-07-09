import { Metadata } from 'next';
import { DailyGameUI } from '@/components/daily/DailyGameUI';
import { AdMechBackground } from '@/components/shared/AdMechBackground';

export const metadata: Metadata = {
  title: 'The Daily Augury | SchemeStealer',
  description: 'Identify the daily target cogno-meme paint in 6 guesses or fewer.',
  openGraph: {
    title: 'The Daily Augury | SchemeStealer',
    description: 'Identify the daily target cogno-meme paint in 6 guesses or fewer.',
  }
};

export default function DailyPage() {
  return (
    <>
      <AdMechBackground />
      <DailyGameUI />
    </>
  );
}
