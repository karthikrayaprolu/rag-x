"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface GlowingEffectProps {
    blur?: number;
    inactiveZone?: number;
    proximity?: number;
    spread?: number;
    variant?: "default" | "white";
    glow?: boolean;
    className?: string;
    disabled?: boolean;
    movementDuration?: number;
    borderWidth?: number;
}

export const GlowingEffect = memo(
    ({
        blur = 0,
        inactiveZone = 0.7,
        proximity = 0,
        spread = 20,
        variant = "default",
        glow = false,
        className,
        movementDuration = 2,
        borderWidth = 1,
        disabled = false,
    }: GlowingEffectProps) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const [visible, setVisible] = useState(false);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const { x, y } = position;

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const updatePosition = (e: MouseEvent) => {
                if (disabled) return;

                const rect = container.getBoundingClientRect();
                const clientX = e.clientX;
                const clientY = e.clientY;

                // Calculate position relative to the container
                const relativeX = clientX - rect.left;
                const relativeY = clientY - rect.top;

                setPosition({
                    x: relativeX,
                    y: relativeY,
                });

                // Check if mouse is within the proximity area
                const inProximity =
                    clientX >= rect.left - proximity &&
                    clientX <= rect.right + proximity &&
                    clientY >= rect.top - proximity &&
                    clientY <= rect.bottom + proximity;

                setVisible(inProximity);
            };

            window.addEventListener("mousemove", updatePosition);

            return () => {
                window.removeEventListener("mousemove", updatePosition);
            };
        }, [proximity, disabled]);

        // Calculate the radial gradient style
        const style = {
            "--x": `${x}px`,
            "--y": `${y}px`,
            "--spread": `${spread}px`,
            "--blur": `${blur}px`,
            "--border-width": `${borderWidth}px`,
            "--color": variant === "white"
                ? "rgba(255,255,255,0.8)"
                : "rgba(120,119,198,0.3)", // Default purple-ish glow
        } as React.CSSProperties;

        return (
            <div
                ref={containerRef}
                className={cn(
                    "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
                    className
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-[inherit]",
                        "opacity-0 transition-opacity",
                        (visible || glow) && !disabled ? "opacity-100" : ""
                    )}
                    style={{
                        ...style,
                        backgroundImage: `radial-gradient(
                circle var(--spread) at var(--x) var(--y), 
                var(--color), 
                transparent
            )`,
                        filter: `blur(var(--blur))`,
                        transitionDuration: visible ? "50ms" : "300ms", // Fast response when moving, slow fade out
                    }}
                />
            </div>
        );
    });

GlowingEffect.displayName = "GlowingEffect";
