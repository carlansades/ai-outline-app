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
    selectLanguage: '选择语言',
    button: '生成大纲',
    loading: '生成中...',
    errorEmpty: '请输入标题',
    errorFail: '生成失败，请稍后再试',
    errorCall: '调用失败，请检查 API Key 或网络',
  },
  'zh-TW': {
    title: '多語言 AI 文章大綱產生器',
    placeholder: '請輸入文章標題，例如：如何快速做副業',
    selectLanguage: '選擇語言',
    button: '生成大綱',
    loading: '生成中...',
    errorEmpty: '請輸入標題',
    errorFail: '生成失敗，請稍後再試',
    errorCall: '呼叫失敗，請檢查 API Key 或網路',
  },
  en: {
    title: 'Multi-language AI Outline Generator',
    placeholder: 'Enter article title, e.g. How to start a side hustle',
    selectLanguage: 'Select Language',
    button: 'Generate Outline',
    loading: 'Generating...',
    errorEmpty: 'Please enter a title',
    errorFail: 'Generation failed, please try again later',
    errorCall: 'API call failed. Check your API Key and network',
  },
  fr: {
    title: "Générateur de plan d'article IA multilingue",
    placeholder: "Entrez le titre de l'article, ex : Comment lancer un side business",
    selectLanguage: 'Choisir la langue',
    button: 'Générer un plan',
    loading: 'Génération...',
    errorEmpty: 'Veuillez entrer un titre',
    errorFail: 'Échec de la génération. Réessayez plus tard',
    errorCall: "Échec de l'appel API. Vérifiez votre clé API",
  },
  es: {
    title: 'Generador de esquemas IA multilingüe',
    placeholder: 'Ingrese el título del artículo, ej: Cómo iniciar un ingreso extra',
    selectLanguage: 'Selecciona el idioma',
    button: 'Generar esquema',
    loading: 'Generando...',
    errorEmpty: 'Por favor ingresa un título',
    errorFail: 'La generación falló. Inténtalo más tarde',
    errorCall: 'Error de API. Verifica tu clave y conexión',
  },
};

function OutlineGenerator() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('zh-CN');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[language];

  const getPromptByLanguage = (lang, title) => {
    switch (lang) {
      case 'en':
        return `You are a content strategist. Based on the title below, generate a 5-point outline. Each point should be a clear sentence for article or video script creation.

Title: ${title}

Format:
1. ...
2. ...
3. ...
4. ...
5. ...`;
      case 'fr':
        return `Vous êtes un expert en stratégie de contenu. À partir du titre ci-dessous, générez un plan en 5 points. Chaque point doit être une phrase claire adaptée à un article ou à un script vidéo.

Titre : ${title}

Format :
1. ...
2. ...
3. ...
4. ...
5. ...`;
      case 'es':
        return `Eres un experto en estrategias de contenido. Con base en el siguiente título, genera un esquema de 5 puntos. Cada punto debe ser una frase clara para un artículo o guion de video.

Título: ${title}

Formato:
1. ...
2. ...
3. ...
4. ...
5. ...`;
      case 'zh-TW':
        return `你是一位內容策略專家。請根據以下標題產出 5 點式的大綱，每點一句話，適合用於寫文章或影片腳本。

標題：${title}

格式：
1. ...
2. ...
3. ...
4. ...
5. ...`;
      default:
        return `你是一位内容运营专家。请根据下面的标题，生成一份 5 点式的内容大纲，每一点用一句话概括，适合用于写文章或制作视频脚本。

标题：${title}

输出格式：
1. ...
2. ...
3. ...
4. ...
5. ...`;
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
      const apiKey = 'sk-8d928cfbd699402eae553b5263e81a9e'; // 替换为你的 API Key
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
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">{t.title}</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.selectLanguage}：</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
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