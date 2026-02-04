'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { LoginInput } from '@/lib/validators/auth';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push('/trainer');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="label">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="label">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          className="input"
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
