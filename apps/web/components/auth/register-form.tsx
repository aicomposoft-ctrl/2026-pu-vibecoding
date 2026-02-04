'use client';

import { useState } from 'react';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';

interface Props {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: Props) {
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: RegisterInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.error || 'Registration failed');
      return;
    }

    onSuccess();
  }

  function fieldError(field: string): string | undefined {
    return fieldErrors[field]?.[0];
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className="label">Full Name</label>
        <input id="reg-name" name="name" type="text" required className="input" placeholder="John Smith" />
        {fieldError('name') && <p className="mt-1 text-xs text-red-600">{fieldError('name')}</p>}
      </div>

      <div>
        <label htmlFor="reg-email" className="label">Email</label>
        <input id="reg-email" name="email" type="email" required className="input" placeholder="you@company.com" />
        {fieldError('email') && <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p>}
      </div>

      <div>
        <label htmlFor="reg-password" className="label">Password</label>
        <input id="reg-password" name="password" type="password" required className="input" placeholder="Min 8 characters" />
        {fieldError('password') && <p className="mt-1 text-xs text-red-600">{fieldError('password')}</p>}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="label">Confirm Password</label>
        <input id="reg-confirm" name="confirmPassword" type="password" required className="input" placeholder="Repeat your password" />
        {fieldError('confirmPassword') && <p className="mt-1 text-xs text-red-600">{fieldError('confirmPassword')}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
