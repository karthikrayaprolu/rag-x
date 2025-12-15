"use client";
import React, { useRef, useState, useEffect } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <div className="relative w-full" ref={ref}>
            <div className="flex justify-center relative">
                {/* Left Column: Text */}
                <div className="w-full lg:w-1/2 relative z-10">
                    {content.map((item, index) => (
                        <div
                            key={item.title + index}
                            className={cn(
                                "min-h-[60vh] flex flex-col justify-center px-8 transition-opacity duration-500",
                                activeCard === index ? "opacity-100" : "opacity-30"
                            )}
                        >
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-300 max-w-md leading-relaxed font-light"
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    {/* Spacer for last item scroll */}
                    <div className="h-[20vh]" />
                </div>

                {/* Right Column: Visual (Sticky) */}
                <div className="hidden lg:block w-1/2 sticky top-0 h-screen flex items-center justify-center pt-32 pb-10 px-6">
                    <div className="relative w-full max-w-[500px] aspect-[16/10]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCard}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={cn(
                                    "w-full h-full",
                                    contentClassName
                                )}
                            >
                                {content[activeCard].content ?? null}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
