/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BOLT_PUBLIC_KEY: process.env.NEXT_PUBLIC_BOLT_PUBLIC_KEY,
    NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_N8N_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
    BOLT_API_KEY: process.env.BOLT_API_KEY,
    HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig