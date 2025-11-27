// next.config.ts

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_KEY:'sk-8d928cfbd699402eae553b5263e81a9e', // 替换为你的 API Key
  },
};

export default nextConfig;