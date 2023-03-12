/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_CHAIN_ID: '11155111', // Sepolia testnet
    NEXT_PUBLIC_RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    NEXT_PUBLIC_POOL_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
