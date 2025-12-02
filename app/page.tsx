'use client';

import Link from 'next/link';

const pages = [
  { path: 'OutlineGenerator', label: 'Outline Generator' },
  { path: 'CodeReview', label: 'Code Review' },
  { path: 'CoderGenerator', label: 'Coder Generator' },
  { path: 'UnitTestGenerator', label: 'Unit Test Generator' },
  { path: 'LanguageTranslator', label: 'Language Translator' },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">AI Tools 首页</h1>
      <div className="space-y-3">
        {pages.map(({ path, label }) => (
          <NavLink key={path} href={`/views/${path}`} label={label} />
        ))}
      </div>
    </main>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block text-blue-600 hover:underline text-lg"
    >
      {label}
    </Link>
  );
}