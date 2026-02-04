/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ai-sales-trainer/database',
    '@ai-sales-trainer/shared-types',
    '@ai-sales-trainer/config',
  ],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://*.elevenlabs.io https://*.elevenlabs.io https://api.openai.com;",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
