'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiUser, FiSave, FiImage, FiCheck, FiLoader, FiUpload, FiX } from 'react-icons/fi';
import { updateUserProfile, getUploadStats, deleteDocument, deleteAllDocuments } from '@/lib/api';
import Image from 'next/image';


const DEFAULT_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Buster',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lola',
    'https://api.dicebear.com/7.x/bottts/svg?seed=123',
    'https://api.dicebear.com/7.x/shapes/svg?seed=Cool',
];

export default function SettingsPage() {
    const { user, userProfile, refreshProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }

        if (userProfile) {
            setDisplayName(userProfile.display_name || '');
            setPhotoUrl(userProfile.photo_url || '');
        }
    }, [user, userProfile, router]);

    const handleSave = async () => {
        setLoading(true);
        setSuccessMessage(null);
        try {
            console.log('Saving profile with data:', {
                display_name: displayName,
                photo_url: photoUrl ? `${photoUrl.substring(0, 50)}...` : 'null'
            });

            const result = await updateUserProfile({
                display_name: displayName,
                photo_url: photoUrl
            });

            console.log('Profile update result:', result);

            await refreshProfile(); // Refresh context
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            setSuccessMessage(`Error: ${error.message || 'Failed to update profile'}`);
            setTimeout(() => setSuccessMessage(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomUrl(e.target.value);
        if (e.target.value) {
            setPhotoUrl(e.target.value);
            setImageError(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file');
            return;
        }

        // Validate file size (max 2MB for base64)
        if (file.size > 2 * 1024 * 1024) {
            setImageError('Image size must be less than 2MB');
            return;
        }

        setUploadingImage(true);
        setImageError(null);

        try {
            // Create a compressed version
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const reader = new FileReader();
            reader.onload = (event) => {
                img.onload = () => {
                    // Resize to max 400x400 to keep base64 small
                    const maxSize = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const base64String = canvas.toDataURL('image/jpeg', 0.8);
                    console.log('Image size:', (base64String.length / 1024).toFixed(2) + 'KB');

                    setPhotoUrl(base64String);
                    setCustomUrl('');
                    setUploadingImage(false);
                };
                img.src = event.target?.result as string;
            };
            reader.onerror = () => {
                setImageError('Failed to read image file');
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Image upload error:', error);
            setImageError('Failed to upload image');
            setUploadingImage(false);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoUrl('');
        setCustomUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30">


            <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Account Settings
                    </h1>
                    <p className="text-gray-400">Manage your profile and preferences.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Settings Panel */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FiUser className="text-gray-400" />
                                Profile Information
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-600 mt-2">Email address cannot be changed.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Avatar Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FiImage className="text-gray-400" />
                                Profile Picture
                            </h2>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Current Avatar Preview */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/30 bg-white/5 p-1">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                            {photoUrl ? (
                                                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-white/20 text-purple-400">
                                                    <FiUser className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">Current Avatar</span>
                                </div>

                                {/* Custom URL & Defaults */}
                                <div className="flex-1 space-y-6">
                                    {/* Upload from Local Storage */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Upload from Device
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {uploadingImage ? (
                                                    <>
                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiUpload className="w-4 h-4" />
                                                        Choose File
                                                    </>
                                                )}
                                            </button>
                                            {photoUrl && !customUrl && photoUrl.startsWith('data:') && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex items-center gap-1"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        {imageError && (
                                            <p className="text-red-400 text-xs mt-2">{imageError}</p>
                                        )}
                                        <p className="text-xs text-gray-600 mt-2">Max 2MB. Image will be resized to 400x400. Supports JPG, PNG, GIF, WebP</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Or enter Image URL
                                        </label>
                                        <input
                                            type="text"
                                            value={customUrl}
                                            onChange={handleCustomUrlChange}
                                            placeholder="https://example.com/avatar.png"
                                            className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3">
                                            Or choose a default avatar
                                        </label>
                                        <div className="grid grid-cols-5 gap-3">
                                            {DEFAULT_AVATARS.map((url, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setPhotoUrl(url);
                                                        setCustomUrl('');
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    className={`aspect-square rounded-full overflow-hidden border-2 transition-all ${photoUrl === url
                                                        ? 'border-white scale-110 shadow-lg shadow-white/20'
                                                        : 'border-transparent hover:border-white/20 hover:scale-105'
                                                        }`}
                                                >
                                                    <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover bg-black" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Save Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-8 py-3 rounded-full bg-white hover:bg-gray-200 text-black font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>

                            <AnimatePresence>
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                        className="px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.15)] backdrop-blur-md"
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        {successMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                    </div>

                    {/* Sidebar/Stats (Optional) */}
                    <div className="hidden md:block">
                        <div className="sticky top-32 space-y-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold mb-2 text-white">Your Plan</h3>
                                <p className="text-3xl font-bold text-white capitalize mb-4">
                                    {userProfile?.plan || 'Free'}
                                </p>
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="text-sm text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all"
                                >
                                    Manage Subscription
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
