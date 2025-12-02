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
    title: 'AI 内容运营文章生成器',
    placeholder: '请输入文章标题，例如：如何快速做副业',
    selectLanguage: '操作语言',
    button: '生成文章',
    loading: '生成中...',
    errorEmpty: '请输入标题',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: 'AI 內容營運文章產生器',
    placeholder: '請輸入文章標題，例如：如何快速做副業',
    selectLanguage: '操作語言',
    button: '產生文章',
    loading: '生成中...',
    errorEmpty: '請輸入標題',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'AI Content Marketing Article Generator',
    placeholder: 'Enter article title, e.g. How to start a side hustle',
    selectLanguage: 'UI Language',
    button: 'Generate Article',
    loading: 'Generating...',
    errorEmpty: 'Please enter a title',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Générateur d'articles marketing IA",
    placeholder: "Entrez le titre de l'article, ex : Comment démarrer un business",
    selectLanguage: 'Langue de l’interface',
    button: 'Générer l’article',
    loading: 'Génération...',
    errorEmpty: 'Veuillez entrer un titre',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Generador de artículos de marketing con IA',
    placeholder: 'Ingrese el título del artículo, ej: Cómo iniciar un ingreso extra',
    selectLanguage: 'Idioma de la interfaz',
    button: 'Generar artículo',
    loading: 'Generando...',
    errorEmpty: 'Por favor ingresa un título',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function OutlineGenerator() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('en');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[language];

  const getPromptByLanguage = (lang, title) => {
    switch (lang) {
      case 'en':
        return `You are a professional content marketer and writer. Based on the given title, write a complete, engaging, SEO-optimized article with a clear introduction, structured body sections with subheadings, and a conclusion. Use a friendly and informative tone.

Title: ${title}`;
      case 'fr':
        return `Vous êtes un expert en marketing de contenu. Rédigez un article complet, structuré, engageant et optimisé pour le SEO basé sur ce titre :

Titre : ${title}`;
      case 'es':
        return `Eres un redactor experto en marketing de contenidos. Escribe un artículo completo, estructurado y optimizado para SEO con el siguiente título:

Título: ${title}`;
      case 'zh-TW':
        return `你是一位內容營運與行銷專家。請根據下方標題，撰寫一篇完整、有條理、具吸引力的文章，包含開頭、段落標題與結尾，風格親切、口語化，並優化 SEO。

標題：${title}`;
      default:
        return `你是一位内容运营专家。请根据下面的标题，撰写一篇完整、结构清晰、引人入胜、适合发布在公众号或知乎的文章。文章应包含引言、正文小标题段落、结尾总结，语言风格亲切，适合SEO优化。

标题：${title}`;
    }
  };

  const generateArticle = async () => {
    if (!title.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setLoading(true);
    setArticle('');
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
            { role: 'system', content: '你是一个多语言内容创作者，擅长撰写内容营销文章。' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        setArticle(data.choices[0].message.content.trim());
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
        onClick={generateArticle}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? t.loading : t.button}
      </button>

      {article && (
        <div className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-gray-800 prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
}

export default OutlineGenerator;