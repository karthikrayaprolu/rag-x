'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiDatabase,
    FiMessageSquare,
    FiKey,
    FiSettings,
    FiBookOpen,
    FiLogOut
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: FiHome },
    { name: 'Knowledge Base', href: '/dashboard/documents', icon: FiDatabase },
    { name: 'Playground', href: '/chat', icon: FiMessageSquare },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: FiKey },
    { name: 'Settings', href: '/settings', icon: FiSettings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="w-64 h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">RAGx</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">PRO</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <div className="mb-6">
                    <p className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Platform</p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div>
                    <p className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Resources</p>
                    <Link
                        href="/documentation"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <FiBookOpen className="w-4 h-4 text-gray-500" />
                        Documentation
                    </Link>
                </div>
            </nav>

            {/* User / Logout Area */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
