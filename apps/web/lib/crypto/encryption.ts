'use client';

import { CRYPTO_CONFIG } from '@ai-sales-trainer/config';
import type { EncryptedData } from '@ai-sales-trainer/shared-types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: CRYPTO_CONFIG.pbkdf2Iterations,
      hash: CRYPTO_CONFIG.hashAlgorithm,
    },
    keyMaterial,
    { name: CRYPTO_CONFIG.algorithm, length: CRYPTO_CONFIG.keyLength },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptApiKey(
  apiKey: string,
  password: string
): Promise<EncryptedData> {
  const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.saltLength));
  const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: CRYPTO_CONFIG.algorithm, iv },
    key,
    encoder.encode(apiKey)
  );

  return { encrypted, iv, salt };
}

export async function decryptApiKey(
  encrypted: ArrayBuffer,
  iv: Uint8Array,
  salt: Uint8Array,
  password: string
): Promise<string> {
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: CRYPTO_CONFIG.algorithm, iv },
    key,
    encrypted
  );

  return decoder.decode(decrypted);
}
