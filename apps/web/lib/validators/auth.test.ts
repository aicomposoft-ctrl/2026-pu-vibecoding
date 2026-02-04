import { loginSchema, registerSchema } from './auth';

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    test('accepts valid input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    test('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    test('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    test('accepts valid input', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepass123',
        confirmPassword: 'securepass123',
      });
      expect(result.success).toBe(true);
    });

    test('rejects short password', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        confirmPassword: '123',
      });
      expect(result.success).toBe(false);
    });

    test('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepass123',
        confirmPassword: 'differentpass',
      });
      expect(result.success).toBe(false);
    });

    test('rejects short name', () => {
      const result = registerSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: 'securepass123',
        confirmPassword: 'securepass123',
      });
      expect(result.success).toBe(false);
    });
  });
});
