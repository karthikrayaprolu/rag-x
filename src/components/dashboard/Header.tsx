'use client';

import { useAuth } from '@/contexts/AuthContext';
import { FiUser } from 'react-icons/fi';

import { usePathname } from 'next/navigation';

export default function Header() {
    const { user, userProfile } = useAuth();
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        switch (path) {
            case '/dashboard': return 'Overview';
            case '/dashboard/documents': return 'Knowledge Base';
            case '/dashboard/api-keys': return 'API Keys';
            case '/settings': return 'Settings';
            case '/chat': return 'Playground';
            default: return 'Overview';
        }
    };

    return (
        <header className="h-16 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-30 backdrop-blur-xl bg-opacity-80">
            {/* Dynamic Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500">
                <span className="hover:text-white transition-colors cursor-pointer">Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-white">{getPageTitle(pathname)}</span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-white">{userProfile?.display_name || 'User'}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                        {userProfile?.photo_url ? (
                            <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="w-4 h-4 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
