import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-xl font-display font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none tracking-wide",
                    {
                        "bg-primary text-black shadow-lg hover:shadow-neon hover:translate-y-[-2px]": variant === "primary",
                        "bg-secondary text-black shadow-lg hover:shadow-neon-pink hover:translate-y-[-2px]": variant === "secondary",
                        "bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-white/20": variant === "ghost",
                        "bg-transparent border border-black/10 hover:bg-black/5 text-black": variant === "outline",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-12 px-6 text-base": size === "md",
                        "h-14 px-8 text-lg": size === "lg",
                        "size-10 p-0 flex items-center justify-center": size === "icon",
                    },
                    className
                )}
                {...(props as any)}
            />
        );
    }
);
Button.displayName = "Button";
