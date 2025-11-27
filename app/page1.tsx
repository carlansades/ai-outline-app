import Head from 'next/head';
import OutlineGenerator from '../components/OutlineGenerator';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI 文章大纲生成器</title>
        <meta name="description" content="输入标题，AI 自动生成内容大纲" />
      </Head>
      <main className="min-h-screen bg-gray-100 py-10 px-4">
        <OutlineGenerator></OutlineGenerator>
      </main>
    </>
  );
}