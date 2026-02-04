import { rateLimit } from './rate-limit';

describe('Rate Limiter', () => {
  test('allows requests within limit', () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 3 });

    expect(limiter('user1').success).toBe(true);
    expect(limiter('user1').success).toBe(true);
    expect(limiter('user1').success).toBe(true);
  });

  test('blocks requests over limit', () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 2 });

    limiter('user2');
    limiter('user2');
    expect(limiter('user2').success).toBe(false);
    expect(limiter('user2').remaining).toBe(0);
  });

  test('tracks different identifiers separately', () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 1 });

    expect(limiter('userA').success).toBe(true);
    expect(limiter('userB').success).toBe(true);
    expect(limiter('userA').success).toBe(false);
  });

  test('returns remaining count', () => {
    const limiter = rateLimit({ windowMs: 60000, maxRequests: 5 });

    expect(limiter('user3').remaining).toBe(4);
    expect(limiter('user3').remaining).toBe(3);
    expect(limiter('user3').remaining).toBe(2);
  });
});
