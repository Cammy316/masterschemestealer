import { Metadata } from 'next';
import { SessionRunner } from '@/components/session/SessionRunner';
import { AdMechBackground } from '@/components/shared/AdMechBackground';

export const metadata: Metadata = {
  title: 'Session Forge | SchemeStealer',
  description: 'Manage your active painting session.',
};

export default function SessionPage() {
  return (
    <>
      <AdMechBackground />
      <SessionRunner />
    </>
  );
}
