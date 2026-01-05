'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground() {
    // Track global scroll
    const { scrollYProgress } = useScroll()

    // Transform values for parallax effect
    // As we scroll down (progress 0 -> 1), move these elements
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-[#050505]">
            {/* Subtle Texture - Using CSS pattern instead of image */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                backgroundSize: '4px 4px'
            }}></div>

            {/* Top Left Subtle Light */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-zinc-800/20 blur-[120px]"
            />

            {/* Bottom Right Subtle Light */}
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-zinc-800/20 blur-[120px]"
            />
        </div>
    )
}
