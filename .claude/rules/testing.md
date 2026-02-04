# Testing Rules

## Test-Driven Development (TDD)

### Process
1. Write failing test
2. Implement minimum code to pass
3. Refactor

### Coverage Requirements
- Unit tests: ≥80%
- E2E tests: Critical user flows

## Unit Tests (Jest)
```typescript
// lib/crypto/encryption.test.ts
test('encrypt and decrypt roundtrip', async () => {
  const key = 'sk-test-12345';
  const password = 'pass';
  const { encrypted, iv, salt } = await encryptApiKey(key, password);
  const decrypted = await decryptApiKey(encrypted, iv, salt, password);
  expect(decrypted).toBe(key);
});
```

## E2E Tests (Playwright)
```typescript
test('conversation flow', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('text=Login');
  await expect(page).toHaveURL('/trainer');
});
```

## Commands
```bash
pnpm test        # Unit tests
pnpm test:e2e    # E2E tests
pnpm test:watch  # Watch mode
```
