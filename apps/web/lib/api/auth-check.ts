import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { authorized: false as const, error: 'Unauthorized' };
  }

  return { authorized: true as const, user: session.user };
}
