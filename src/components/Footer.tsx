import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
        Built for{' '}
        <Link
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-indigo-600 underline-offset-2 hover:underline"
        >
          Digital Heroes Training Task
        </Link>
      </div>
    </footer>
  );
}
