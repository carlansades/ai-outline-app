'use client';

import { useState } from 'react';
import Link from 'next/link';

// 支持语言列表
const languages = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
] as const;

type LangCode = typeof languages[number]['code'];

// 多语言文案
const i18n: Record<LangCode, {
  title: string;
  toolListTitle: string;
  languageTitle: string;
  tools: Record<string, string>;
}> = {
  'zh-CN': {
    title: 'AI 工具导航',
    toolListTitle: '选择工具',
    languageTitle: '选择语言',
    tools: {
      CoderGenerator: 'AI写代码',
      UnitTestGenerator: 'AI单元测试',
      CodeReview: 'AI代码审查',
      LanguageTranslator: 'AI翻译',
      OutlineGenerator: 'AI内容运营',
    },
  },
  'zh-TW': {
    title: 'AI 工具導航',
    toolListTitle: '選擇工具',
    languageTitle: '選擇語言',
    tools: {
      CoderGenerator: 'AI寫程式',
      UnitTestGenerator: 'AI單元測試',
      CodeReview: 'AI程式碼審查',
      LanguageTranslator: 'AI翻譯',
      OutlineGenerator: 'AI內容營運',
    },
  },
  en: {
    title: 'AI Tools Hub',
    toolListTitle: 'Choose a Tool',
    languageTitle: 'Select Language',
    tools: {
      CoderGenerator: 'AI Code Writer',
      UnitTestGenerator: 'AI Unit Test',
      CodeReview: 'AI Code Review',
      LanguageTranslator: 'AI Translator',
      OutlineGenerator: 'AI Content Generator',
    },
  },
  fr: {
    title: 'Outils d’IA',
    toolListTitle: 'Choisissez un outil',
    languageTitle: 'Choisir la langue',
    tools: {
      CoderGenerator: 'Écriture de code IA',
      UnitTestGenerator: 'Test unitaire IA',
      CodeReview: 'Revue de code IA',
      LanguageTranslator: 'Traducteur IA',
      OutlineGenerator: 'Marketing de contenu IA',
    },
  },
  es: {
    title: 'Herramientas de IA',
    toolListTitle: 'Elegir herramienta',
    languageTitle: 'Seleccionar idioma',
    tools: {
      CoderGenerator: 'IA para escribir código',
      UnitTestGenerator: 'IA para pruebas unitarias',
      CodeReview: 'IA para revisión de código',
      LanguageTranslator: 'Traductor de IA',
      OutlineGenerator: 'IA para contenido',
    },
  },
};

// 修改后的顺序
const pages = [
  { path: 'CoderGenerator' },
  { path: 'UnitTestGenerator' },
  { path: 'CodeReview' },
  { path: 'LanguageTranslator' },
  { path: 'OutlineGenerator' },
];

export default function Home() {
  const [lang, setLang] = useState<LangCode>('en');
  const t = i18n[lang];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-center text-blue-700 drop-shadow-sm">
        {t.title}
      </h1>

      {/* 语言选择 */}
      <section className="mb-10 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">{t.languageTitle}</h2>
        <div className="flex flex-wrap gap-3">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                lang === code
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 工具导航 */}
      <section className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">{t.toolListTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map(({ path }) => (
            <NavLink
              key={path}
              href={`/views/${path}`}
              label={t.tools[path]}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block bg-white hover:bg-blue-50 border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition text-lg font-medium text-blue-700"
    >
      {label}
    </Link>
  );
}