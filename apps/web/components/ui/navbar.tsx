'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Mic, BarChart3, LogOut } from 'lucide-react';

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  } | undefined;
}

export function Navbar({ user }: Props) {
  const pathname = usePathname();

  const links = [
    { href: '/trainer', label: 'Trainer', icon: Mic },
    { href: '/results', label: 'Results', icon: BarChart3 },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/trainer" className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-gray-900">AI Sales Trainer</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name || user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
