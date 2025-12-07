'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ParallaxElementProps {
    children: ReactNode
    offset?: number // Pixels to move. Positive = faster than scroll? No, useTransform logic.
    // If we move y from -offset to +offset as we scroll down:
    // We scroll down, element enters from bottom (start end) to top (end start).
    // scrollYProgress 0 -> 1.
    // y goes -50 -> +50.
    // So as we scroll down (content moves up), the element moves DOWN relative to its container.
    // This creates a "slower" move effect (background depth).
    // If offset is negative, it moves UP relative to container (faster/foreground depth).
    className?: string
}

export default function ParallaxElement({
    children,
    offset = 50,
    className = ""
}: ParallaxElementProps) {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div style={{ y }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    )
}
