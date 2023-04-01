/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_CHAIN_ID: '11155111', // Sepolia
    NEXT_PUBLIC_RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  },
}

module.exports = nextConfig
