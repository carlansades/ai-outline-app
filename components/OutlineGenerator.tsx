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
    title: '多语言 AI 文章大纲生成器',
    placeholder: '请输入文章标题，例如：如何快速做副业',
    selectLanguage: '操作语言',
    button: '生成大纲',
    loading: '生成中...',
    errorEmpty: '请输入标题',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: '多語言 AI 文章大綱產生器',
    placeholder: '請輸入文章標題，例如：如何快速做副業',
    selectLanguage: '操作語言',
    button: '生成大綱',
    loading: '生成中...',
    errorEmpty: '請輸入標題',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'Multi-language AI Outline Generator',
    placeholder: 'Enter article title, e.g. How to start a side hustle',
    selectLanguage: 'UI Language',
    button: 'Generate Outline',
    loading: 'Generating...',
    errorEmpty: 'Please enter a title',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Générateur de plans IA multilingue",
    placeholder: "Entrez le titre de l'article, ex : Comment démarrer un business",
    selectLanguage: 'Langue de l’interface',
    button: 'Générer le plan',
    loading: 'Génération...',
    errorEmpty: 'Veuillez entrer un titre',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Generador de esquemas IA multilingüe',
    placeholder: 'Ingrese el título del artículo, ej: Cómo iniciar un ingreso extra',
    selectLanguage: 'Idioma de la interfaz',
    button: 'Generar esquema',
    loading: 'Generando...',
    errorEmpty: 'Por favor ingresa un título',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function OutlineGenerator() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('en');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[language];

  const getPromptByLanguage = (lang, title) => {
    switch (lang) {
      case 'en':
        return `You are a content strategist. Based on the title below, generate a 5-point outline. Each point should be a clear sentence for article or video script creation.\n\nTitle: ${title}\n\nFormat:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...`;
      case 'fr':
        return `Vous êtes un expert en stratégie de contenu. À partir du titre ci-dessous, générez un plan en 5 points.\n\nTitre : ${title}\n\nFormat :\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...`;
      case 'es':
        return `Eres un experto en estrategias de contenido. Con base en el siguiente título, genera un esquema de 5 puntos.\n\nTítulo: ${title}\n\nFormato:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...`;
      case 'zh-TW':
        return `你是一位內容策略專家。請根據以下標題產出 5 點式的大綱。\n\n標題：${title}\n\n格式：\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...`;
      default:
        return `你是一位内容运营专家。请根据下面的标题生成一份 5 点式的大纲。\n\n标题：${title}\n\n格式：\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...`;
    }
  };

  const generateOutline = async () => {
    if (!title.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setLoading(true);
    setOutline('');
    setError('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const prompt = getPromptByLanguage(language, title);

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一个内容策划专家，擅长多语言内容生成。' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        setOutline(data.choices[0].message.content.trim());
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        rows={3}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t.placeholder}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <button
        onClick={generateOutline}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? t.loading : t.button}
      </button>

      {outline && (
        <div className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-gray-800">
          {outline}
        </div>
      )}
    </div>
  );
}

export default OutlineGenerator;