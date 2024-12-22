import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // 启用严格模式
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'platform-user.oss-cn-guangzhou.aliyuncs.com', // 替换为你使用的图片域名
    //     port: '',                // 如果需要指定端口
    //     pathname: '/path/**',    // 替换为图片路径的模式
    //   },
    // ],
    domains: ['platform-user.oss-cn-guangzhou.aliyuncs.com'],  // 允许加载来自阿里云 OSS 的图片
  },
};

export default nextConfig;
