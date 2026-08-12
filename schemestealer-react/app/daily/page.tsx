import { Metadata } from 'next';
import { MatchleGame } from '@/components/daily/MatchleGame';
import { CleanThematicBackground } from '@/components/shared/CleanThematicBackground';

/**
 * Copy is plain on purpose.
 *
 * The previous description — "Identify the daily target cogno-meme paint in 6
 * guesses or fewer" — let flavour obscure meaning, and it was the line that
 * appeared on every single share and link preview. Someone who has never heard
 * of the app should understand the game from it.
 */
const TITLE = 'Matchle | SchemeStealer';
const DESCRIPTION =
  'A daily colour game for miniature painters. Five rounds: spot which paint is the closest match, and see how far off you were.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DailyPage() {
  return (
    <>
      <CleanThematicBackground />
      <MatchleGame />
    </>
  );
}
