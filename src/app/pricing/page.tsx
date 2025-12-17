'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { createCheckoutSession, getUserProfile, type UserProfile } from '@/lib/api';
import { useState, useEffect } from 'react';

const PRICE_IDS = {
    STARTER: 'price_1SdltnRu2lPW20DirecI5Ata',
    PRO: 'price_1Sdlu6Ru2lPW20DiERsErBf5'
};

export default function PricingPage() {
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.log('User not logged in or failed to fetch profile');
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubscribe = async (priceId: string) => {
        try {
            setLoadingPriceId(priceId);
            const response = await createCheckoutSession(priceId);
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            // alert('Failed to start checkout. Please try again.');
        } finally {
            setLoadingPriceId(null);
        }
    };

    const features = [
        "Unlimited Projects",
        "Share with Team",
        "Sync across devices",
        "30 day version history"
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[40%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-6 uppercase tracking-widest">
                        <span>Plans & Pricing</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Simple, transparent <span className="text-gray-500">pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
                        Choose the plan that's right for you. Change or cancel at any time.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                    {/* Starter Plan */}
                    <CardSpotlight
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden h-full flex flex-col"
                        color="rgba(255,255,255,0.15)"
                    >
                        <h3 className="text-xl font-bold mb-2">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">Perfect for hobbyists and side projects.</p>

                        <button
                            disabled={true}
                            className={`w-full py-3 rounded-xl border font-medium mb-8 cursor-default ${userProfile?.plan === 'pro'
                                ? 'bg-white/5 border-white/10 text-gray-400'
                                : 'bg-white/10 border-white/20 text-white'
                                }`}
                        >
                            {userProfile?.plan === 'pro' ? 'Included' : 'Current Plan'}
                        </button>

                        <div className="space-y-4 flex-grow">
                            {[true, true, false, false].map((included, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    {included ? <FiCheck className="text-green-400" /> : <FiX className="text-gray-600" />}
                                    <span className={included ? "text-gray-300" : "text-gray-600"}>{features[i]}</span>
                                </div>
                            ))}
                        </div>
                    </CardSpotlight>

                    {/* Pro Plan */}
                    <CardSpotlight
                        className="p-8 rounded-3xl bg-white/5 border border-blue-500/50 relative overflow-hidden h-full flex flex-col transform md:-translate-y-4"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                        <h3 className="text-xl font-bold mb-2 text-blue-400">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$29</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">For professionals seeking power and flexibility.</p>

                        <button
                            onClick={() => handleSubscribe(PRICE_IDS.PRO)}
                            disabled={loadingPriceId === PRICE_IDS.PRO || userProfile?.plan === 'pro' || isLoadingProfile}
                            className={`w-full py-3 rounded-xl font-medium mb-8 transition-colors ${userProfile?.plan === 'pro'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        >
                            {loadingPriceId === PRICE_IDS.PRO
                                ? 'Redirecting...'
                                : isLoadingProfile
                                    ? 'Loading...'
                                    : userProfile?.plan === 'pro'
                                        ? 'Current Plan'
                                        : 'Get Started'}
                        </button>

                        <div className="space-y-4 flex-grow">
                            {[true, true, true, true].map((included, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <FiCheck className="text-blue-400" />
                                    <span className="text-gray-300">{features[i]}</span>
                                </div>
                            ))}
                        </div>
                    </CardSpotlight>

                    {/* Business Plan */}
                    <CardSpotlight
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden h-full flex flex-col"
                        color="rgba(255,255,255,0.15)"
                    >
                        <h3 className="text-xl font-bold mb-2">Business</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$99</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">For teams and organizations.</p>

                        <button
                            onClick={() => window.location.href = 'mailto:karthikrayaprolu13@gmail.com'}
                            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium mb-8"
                        >
                            Contact Sales
                        </button>

                        <div className="space-y-4 flex-grow">
                            {[true, true, true, true].map((included, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <FiCheck className="text-green-400" />
                                    <span className="text-gray-300">{features[i]}</span>
                                </div>
                            ))}
                        </div>
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}
