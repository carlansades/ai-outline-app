'use client';

import React, { useState } from 'react';

const uiLanguages = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const codeLanguages = [
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

const i18n = {
  'zh-CN': {
    title: 'AI 重构与代码审查助手',
    placeholder: '请输入你想审查的代码，例如一个模块或函数',
    selectLanguage: '界面语言',
    selectCodeLang: '代码语言',
    button: '生成重构建议',
    loading: '分析中...',
    errorEmpty: '请输入代码',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: 'AI 重構與程式碼審查助手',
    placeholder: '請輸入你要審查的程式碼，例如一個模組或函數',
    selectLanguage: '界面語言',
    selectCodeLang: '程式語言',
    button: '產生重構建議',
    loading: '分析中...',
    errorEmpty: '請輸入程式碼',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'AI Refactor & Code Review Assistant',
    placeholder: 'Paste the code you want to review, e.g. a function or module',
    selectLanguage: 'UI Language',
    selectCodeLang: 'Code Language',
    button: 'Generate Suggestions',
    loading: 'Analyzing...',
    errorEmpty: 'Please enter some code',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Assistant IA de refactorisation et revue de code",
    placeholder: "Collez le code à examiner, ex : une fonction ou un module",
    selectLanguage: 'Langue de l’interface',
    selectCodeLang: 'Langage du code',
    button: 'Générer des suggestions',
    loading: 'Analyse...',
    errorEmpty: 'Veuillez entrer du code',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Asistente IA de refactorización y revisión de código',
    placeholder: 'Pega el código a revisar, ej: una función o módulo',
    selectLanguage: 'Idioma de la interfaz',
    selectCodeLang: 'Lenguaje de código',
    button: 'Generar sugerencias',
    loading: 'Analizando...',
    errorEmpty: 'Por favor ingresa código',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function CodeReview() {
  const [language, setLanguage] = useState('en');
  const [codeLang, setCodeLang] = useState('Python');
  const [inputCode, setInputCode] = useState('');
  const [reviewOutput, setReviewOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[language];

  const generatePrompt = (code, lang) => {
    return `You are a senior ${lang} developer and code reviewer. 
Please review the following code and provide:
- Suggestions for refactoring
- Code smell detection
- Potential bugs or performance issues
- Style improvements

Code:\n\n${code}\n\n
Respond only with the code review and improvement suggestions in markdown format.`;
  };

  const generateReview = async () => {
    if (!inputCode.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setError('');
    setReviewOutput('');
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
            { role: 'system', content: 'You are a helpful assistant that reviews and refactors code.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        setReviewOutput(content.trim());
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {uiLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
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
          className="w-full border p-2 rounded"
        >
          {codeLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <textarea
        rows={8}
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder={t.placeholder}
        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={generateReview}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? t.loading : t.button}
      </button>

      {reviewOutput && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm text-gray-800 border border-gray-300 prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: reviewOutput.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
}

export default CodeReview;