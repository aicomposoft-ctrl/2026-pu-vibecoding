# Security Rules
DO: Use Web Crypto API for encryption. PBKDF2 100k+ iterations. Bcrypt cost 10.
DO: Validate all inputs with Zod. Rate limit API routes. Set security headers.
DON'T: Store API keys on server. Use localStorage for secrets. Skip input validation.
WHY: Client-side encryption = zero-knowledge. Defense in depth prevents breaches.
