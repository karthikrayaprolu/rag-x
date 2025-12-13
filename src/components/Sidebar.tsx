'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/chat', label: 'Chat', icon: '💬' },
    { href: '/upload', label: 'Upload', icon: '⬆️' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  return (
    <aside className="w-64 bg-black/30 backdrop-blur-md border-r border-white/10 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Menu</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
