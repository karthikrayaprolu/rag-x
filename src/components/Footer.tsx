import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-xl font-bold text-white tracking-tight">RAGx</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6 leading-normal text-sm">
                            The complete platform for parsing, embedding, and retrieving knowledge.
                            Built for developers who demand control and performance.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/karthikrayaprolu/rag-x" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <FiGithub className="w-5 h-5" />
                            </a>
                            <a href="https://x.com/lowend_13" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/karthikrayaprolu/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <FiLinkedin className="w-5 h-5" />
                            </a>
                            <a href="mailto:karthikrayaprolu13@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <FiMail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/platform/ingestion" className="hover:text-white transition-colors">Ingestion</Link></li>
                            <li><Link href="/platform/chat" className="hover:text-white transition-colors">Chat</Link></li>
                            <li><Link href="/platform/security" className="hover:text-white transition-colors">Security</Link></li>
                            <li><Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
                            <li><Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="/documentation" className="hover:text-white transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="mailto:karthikrayaprolu13@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <div>&copy; {new Date().getFullYear()} RAGx Inc. All rights reserved.</div>
                    {/* <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link> */}
                </div>
            </div>
        </footer>
    );
}
