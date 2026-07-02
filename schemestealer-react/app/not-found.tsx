import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-void-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-brass flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-brass/10"></div>
            <div className="w-4 h-4 bg-error rounded-full shadow-[0_0_15px_#ff0000]"></div>
          </div>
        </div>
        <h1 className="text-6xl gothic-text text-brass tracking-widest text-shadow">404</h1>
        <h2 className="text-2xl tech-text text-gray-300 uppercase tracking-wider">Signal Lost in the Warp</h2>
        <p className="text-gray-400">
          The requested cogitator record could not be found. It may have been corrupted or purged from the archives.
        </p>
        <div className="pt-4">
          <Link href="/" className="inline-block border border-brass text-brass px-8 py-3 rounded hover:bg-brass/10 transition-colors tech-text uppercase tracking-widest text-sm">
            Return to Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
