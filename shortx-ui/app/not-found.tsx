import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center px-6 text-center">
      {/* Gradient logo */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold font-schibsted mb-8 shadow-xl">
        S
      </div>

      <div className="text-8xl font-black font-schibsted tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
        404
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 font-schibsted">
        Page not found
      </h1>
      <p className="text-[var(--color-text-secondary)] max-w-md mb-8 text-base leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist, or the short link may have expired or been deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn btn-primary px-8 py-3">
          ← Go Home
        </Link>
        <Link href="/dashboard" className="btn btn-secondary px-8 py-3">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
