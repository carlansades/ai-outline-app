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

// 文案字典（页面标题、分组标题、工具名等多语言）
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
      OutlineGenerator: '大纲生成器',
      CodeReview: '代码审查',
      CoderGenerator: '代码生成器',
      UnitTestGenerator: '单元测试生成器',
      LanguageTranslator: '语言翻译器',
    },
  },
  'zh-TW': {
    title: 'AI 工具導航',
    toolListTitle: '選擇工具',
    languageTitle: '選擇語言',
    tools: {
      OutlineGenerator: '大綱產生器',
      CodeReview: '程式碼審查',
      CoderGenerator: '程式碼產生器',
      UnitTestGenerator: '單元測試產生器',
      LanguageTranslator: '語言翻譯器',
    },
  },
  en: {
    title: 'AI Tools Hub',
    toolListTitle: 'Choose a Tool',
    languageTitle: 'Select Language',
    tools: {
      OutlineGenerator: 'Outline Generator',
      CodeReview: 'Code Review',
      CoderGenerator: 'Coder Generator',
      UnitTestGenerator: 'Unit Test Generator',
      LanguageTranslator: 'Language Translator',
    },
  },
  fr: {
    title: 'Outils d’IA',
    toolListTitle: 'Choisissez un outil',
    languageTitle: 'Choisir la langue',
    tools: {
      OutlineGenerator: 'Générateur de plan',
      CodeReview: 'Revue de code',
      CoderGenerator: 'Générateur de code',
      UnitTestGenerator: 'Générateur de tests',
      LanguageTranslator: 'Traducteur de langue',
    },
  },
  es: {
    title: 'Herramientas de IA',
    toolListTitle: 'Elegir herramienta',
    languageTitle: 'Seleccionar idioma',
    tools: {
      OutlineGenerator: 'Generador de esquemas',
      CodeReview: 'Revisión de código',
      CoderGenerator: 'Generador de código',
      UnitTestGenerator: 'Generador de pruebas',
      LanguageTranslator: 'Traductor de idiomas',
    },
  },
};

// 页面配置
const pages = [
  { path: 'OutlineGenerator' },
  { path: 'CodeReview' },
  { path: 'CoderGenerator' },
  { path: 'UnitTestGenerator' },
  { path: 'LanguageTranslator' },
];

export default function Home() {
  const [lang, setLang] = useState<LangCode>('zh-CN');
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