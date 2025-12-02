'use client';

import React, { useState } from 'react';

type LanguageOption = {
  code: string;
  label: string;
};

type I18nText = {
  title: string;
  placeholder: string;
  selectLanguage: string;
  selectCodeLang: string;
  button: string;
  loading: string;
  errorEmpty: string;
  errorFail: string;
  errorCall: string;
};

const uiLanguages: LanguageOption[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const codeLanguages: string[] = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
];

const i18n: Record<string, I18nText> = {
  'zh-CN': {
    title: 'AI 单元测试生成器',
    placeholder: '请输入你要测试的代码，例如一个函数实现',
    selectLanguage: '界面语言',
    selectCodeLang: '代码语言',
    button: '生成单元测试',
    loading: '生成中...',
    errorEmpty: '请输入代码',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: 'AI 單元測試產生器',
    placeholder: '請輸入你要測試的程式碼，例如一個函數',
    selectLanguage: '界面語言',
    selectCodeLang: '程式語言',
    button: '生成單元測試',
    loading: '生成中...',
    errorEmpty: '請輸入程式碼',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'AI Unit Test Generator',
    placeholder: 'Paste your code here, e.g. a function to test',
    selectLanguage: 'UI Language',
    selectCodeLang: 'Code Language',
    button: 'Generate Unit Test',
    loading: 'Generating...',
    errorEmpty: 'Please enter some code',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Générateur de tests unitaires IA",
    placeholder: "Collez ici le code à tester, ex : une fonction",
    selectLanguage: 'Langue de l’interface',
    selectCodeLang: 'Langage du code',
    button: 'Générer les tests',
    loading: 'Génération...',
    errorEmpty: 'Veuillez entrer du code',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Generador de pruebas unitarias IA',
    placeholder: 'Pega aquí el código a probar, ej: una función',
    selectLanguage: 'Idioma de la interfaz',
    selectCodeLang: 'Lenguaje de código',
    button: 'Generar pruebas',
    loading: 'Generando...',
    errorEmpty: 'Por favor ingresa código',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function UnitTestGenerator() {
  const [language, setLanguage] = useState('en');
  const [codeLang, setCodeLang] = useState('Python');
  const [inputCode, setInputCode] = useState('');
  const [testCode, setTestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[language];

  const generatePrompt = (code: string, lang: string): string => {
    return `You are a senior ${lang} developer. Given the following code, generate comprehensive unit tests using best practices.\n\nCode:\n${code}\n\nOnly output test code. No explanation.`;
  };

  const generateUnitTest = async () => {
    if (!inputCode.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setError('');
    setTestCode('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const prompt = generatePrompt(inputCode, codeLang);

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI that writes unit tests for any code.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        setTestCode(content.trim());
      } else {
        setError(t.errorFail);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorCall);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {uiLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.selectCodeLang}
          </label>
          <select
            value={codeLang}
            onChange={(e) => setCodeLang(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {codeLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows={8}
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder={t.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={generateUnitTest}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-semibold"
        >
          {loading ? t.loading : t.button}
        </button>

        {testCode && (
          <pre className="mt-6 bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap text-gray-800 border border-gray-300">
            <code>{testCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default UnitTestGenerator;