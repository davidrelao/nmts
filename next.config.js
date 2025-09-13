/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production-museum-reservation-2024',
  },
}

module.exports = nextConfig
