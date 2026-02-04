---
name: Security Patterns
description: Client-side encryption, auth, secure API design
---

# Security Patterns

## Client-Side Encryption
```typescript
// Key derivation
const key = await deriveKey(password, salt); // PBKDF2 100k

// Encrypt
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

// Store
await indexedDB.put('api-keys', { encrypted, iv, salt });
```

## Auth
```typescript
const session = await getServerSession();
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
```

## Validation
```typescript
const schema = z.object({ email: z.string().email() });
const validated = schema.parse(body);
```
