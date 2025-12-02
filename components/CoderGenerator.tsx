'use client';

import React, { useState } from 'react';

type UILanguage = {
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

const uiLanguages: UILanguage[] = [
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
    title: '多语言 AI 代码生成器',
    placeholder: '请输入你想实现的功能，例如：读取一个 JSON 文件并打印内容',
    selectLanguage: '界面语言',
    selectCodeLang: '生成的编程语言',
    button: '生成代码',
    loading: '生成中...',
    errorEmpty: '请输入功能描述',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: '多語言 AI 程式碼產生器',
    placeholder: '請輸入你想實現的功能，例如：讀取一個 JSON 檔並顯示內容',
    selectLanguage: '界面語言',
    selectCodeLang: '目標程式語言',
    button: '生成程式碼',
    loading: '生成中...',
    errorEmpty: '請輸入功能描述',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'Multi-language AI Code Generator',
    placeholder: 'Describe the function, e.g. Read a JSON file and print its content',
    selectLanguage: 'UI Language',
    selectCodeLang: 'Target Programming Language',
    button: 'Generate Code',
    loading: 'Generating...',
    errorEmpty: 'Please enter a description',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Générateur de code IA multilingue",
    placeholder: "Décrivez la fonction, ex : Lire un fichier JSON et afficher son contenu",
    selectLanguage: 'Langue de l’interface',
    selectCodeLang: 'Langage de programmation cible',
    button: 'Générer le code',
    loading: 'Génération...',
    errorEmpty: 'Veuillez entrer une description',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Generador de código IA multilingüe',
    placeholder: 'Describe la función, ej: Leer un archivo JSON y mostrar su contenido',
    selectLanguage: 'Idioma de la interfaz',
    selectCodeLang: 'Lenguaje de programación objetivo',
    button: 'Generar código',
    loading: 'Generando...',
    errorEmpty: 'Por favor ingresa una descripción',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function CodeGenerator() {
  const [language, setLanguage] = useState<string>('en');
  const [codeLang, setCodeLang] = useState<string>('Python');
  const [description, setDescription] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const t = i18n[language];

  const generatePrompt = (desc: string, lang: string): string => {
    return `You are a senior ${lang} developer. Write code that does the following:\n\n"${desc}"\n\nOnly return code. No explanation.`;
  };

  const generateCode = async () => {
    if (!description.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setError('');
    setCode('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const prompt = generatePrompt(description, codeLang);

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: [
            { role: 'system', content: 'You are a helpful AI code assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const content: string | undefined = data.choices?.[0]?.message?.content;

      if (content) {
        setCode(content.trim());
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
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 mt-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
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
            className="w-full border p-2 rounded text-sm"
          >
            {codeLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={generateCode}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 transition"
        >
          {loading ? t.loading : t.button}
        </button>

        {code && (
          <pre className="mt-6 bg-gray-100 p-4 rounded text-sm text-gray-800 border border-gray-300 overflow-x-auto whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default CodeGenerator;