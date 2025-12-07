'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground() {
    // Track global scroll
    const { scrollYProgress } = useScroll()

    // Transform values for parallax effect
    // As we scroll down (progress 0 -> 1), move these elements
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
    const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
            {/* Top Left Orb */}
            <motion.div
                style={{ y: y1, rotate: rotate1 }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/10 blur-[100px] opacity-70"
            />

            {/* Bottom Right Orb */}
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-900/20 to-cyan-900/10 blur-[120px] opacity-60"
            />

            {/* Middle Floating Orb */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-900/10 blur-[90px]"
            />
        </div>
    )
}
