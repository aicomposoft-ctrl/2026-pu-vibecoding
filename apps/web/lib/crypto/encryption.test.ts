/**
 * @jest-environment jsdom
 */

import { encryptApiKey, decryptApiKey } from './encryption';

// Polyfill Web Crypto for Node/jsdom
if (!globalThis.crypto?.subtle) {
  const { webcrypto } = require('crypto');
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

describe('Client-Side Encryption', () => {
  test('encrypt and decrypt roundtrip', async () => {
    const apiKey = 'sk-test-1234567890abcdef';
    const password = 'securePassword123';

    const { encrypted, iv, salt } = await encryptApiKey(apiKey, password);

    expect(encrypted).toBeInstanceOf(ArrayBuffer);
    expect(iv).toBeInstanceOf(Uint8Array);
    expect(iv.length).toBe(12);
    expect(salt).toBeInstanceOf(Uint8Array);
    expect(salt.length).toBe(16);

    const decrypted = await decryptApiKey(encrypted, iv, salt, password);
    expect(decrypted).toBe(apiKey);
  });

  test('decrypt fails with wrong password', async () => {
    const apiKey = 'sk-test-secret-key';
    const password = 'correctPassword';
    const wrongPassword = 'wrongPassword';

    const { encrypted, iv, salt } = await encryptApiKey(apiKey, password);

    await expect(
      decryptApiKey(encrypted, iv, salt, wrongPassword)
    ).rejects.toThrow();
  });

  test('generates unique IV per encryption', async () => {
    const apiKey = 'sk-test-key';
    const password = 'password123';

    const result1 = await encryptApiKey(apiKey, password);
    const result2 = await encryptApiKey(apiKey, password);

    const iv1 = Array.from(result1.iv);
    const iv2 = Array.from(result2.iv);

    expect(iv1).not.toEqual(iv2);
  });

  test('generates unique salt per encryption', async () => {
    const apiKey = 'sk-test-key';
    const password = 'password123';

    const result1 = await encryptApiKey(apiKey, password);
    const result2 = await encryptApiKey(apiKey, password);

    const salt1 = Array.from(result1.salt);
    const salt2 = Array.from(result2.salt);

    expect(salt1).not.toEqual(salt2);
  });
});
