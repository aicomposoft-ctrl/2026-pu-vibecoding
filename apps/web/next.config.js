/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self' wss://*.elevenlabs.io https://*.elevenlabs.io https://api.openai.com",
            "media-src 'self' blob:",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      ],
    },
  ],
};

module.exports = nextConfig;
