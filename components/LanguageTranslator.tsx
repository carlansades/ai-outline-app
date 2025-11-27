'use client';

import React, { useState } from 'react';

const languages = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const i18n = {
  'zh-CN': {
    title: 'AI 多语言翻译器',
    placeholder: '请输入要翻译的内容，例如：你好，世界！',
    selectLanguage: '目标语言（可多选）',
    selectUILanguage: '操作语言',
    button: '翻译',
    loading: '翻译中...',
    errorEmpty: '请输入内容',
    errorNoTarget: '请至少选择一个目标语言',
    errorFail: '翻译失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: 'AI 多語言翻譯器',
    placeholder: '請輸入要翻譯的內容，例如：你好，世界！',
    selectLanguage: '目標語言（可多選）',
    selectUILanguage: '操作語言',
    button: '翻譯',
    loading: '翻譯中...',
    errorEmpty: '請輸入內容',
    errorNoTarget: '請至少選擇一個目標語言',
    errorFail: '翻譯失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'AI Multilingual Translator',
    placeholder: 'Enter text to translate, e.g. Hello, world!',
    selectLanguage: 'Target languages (multi-select)',
    selectUILanguage: 'UI Language',
    button: 'Translate',
    loading: 'Translating...',
    errorEmpty: 'Please enter content',
    errorNoTarget: 'Please select at least one target language',
    errorFail: 'Translation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: 'Traducteur IA multilingue',
    placeholder: 'Entrez le texte à traduire, ex : Bonjour le monde !',
    selectLanguage: 'Langues cibles (multi-sélection)',
    selectUILanguage: 'Langue de l\'interface',
    button: 'Traduire',
    loading: 'Traduction...',
    errorEmpty: 'Veuillez entrer du contenu',
    errorNoTarget: 'Veuillez sélectionner au moins une langue cible',
    errorFail: 'La traduction a échoué. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Traductor IA multilingüe',
    placeholder: 'Introduce el texto a traducir, ej: ¡Hola, mundo!',
    selectLanguage: 'Idiomas de destino (múltiples)',
    selectUILanguage: 'Idioma de la interfaz',
    button: 'Traducir',
    loading: 'Traduciendo...',
    errorEmpty: 'Por favor ingresa contenido',
    errorNoTarget: 'Selecciona al menos un idioma de destino',
    errorFail: 'La traducción falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function Translator() {
  const [text, setText] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [uiLanguage, setUiLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[uiLanguage];

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const generatePrompt = (langCode: string): string => {
    const label = languages.find((l) => l.code === langCode)?.label || '目标语言';
    return `请将以下内容翻译成 ${label}：\n\n${text}`;
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError(t.errorEmpty);
      return;
    }

    if (selectedLanguages.length === 0) {
      setError(t.errorNoTarget);
      return;
    }

    setLoading(true);
    setError('');
    setTranslations({});

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const results: Record<string, string> = {};

      for (const lang of selectedLanguages) {
        const prompt = generatePrompt(lang);

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: '你是一个专业翻译助手，擅长多语言翻译。' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.5,
          }),
        });

        const data = await response.json();

        if (data.choices && data.choices[0]?.message?.content) {
          results[lang] = data.choices[0].message.content.trim();
        } else {
          results[lang] = t.errorFail;
        }
      }

      setTranslations(results);
    } catch (err) {
      console.error(err);
      setError(t.errorCall);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
        <select
          value={uiLanguage}
          onChange={(e) => setUiLanguage(e.target.value)}
          className="border border-gray-300 rounded p-1 text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.selectLanguage}：</label>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <label key={lang.code} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang.code)}
                onChange={() => handleLanguageToggle(lang.code)}
              />
              <span>{lang.label}</span>
            </label>
          ))}
        </div>
      </div>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <button
        onClick={handleTranslate}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? t.loading : t.button}
      </button>

      {Object.keys(translations).length > 0 && (
        <div className="mt-6 space-y-4">
          {selectedLanguages.map((lang) => (
            <div
              key={lang}
              className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-gray-800"
            >
              <p className="font-semibold mb-2">{languages.find((l) => l.code === lang)?.label}：</p>
              <p>{translations[lang]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Translator;