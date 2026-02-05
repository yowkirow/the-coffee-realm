import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    gradient?: boolean;
}

export function GlassCard({ className, children, gradient, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "glass rounded-2xl p-6 relative overflow-hidden",
                gradient && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-secondary/10 before:opacity-50",
                className
            )}
            {...props}
        >
            <div className="relative z-10">{children as any}</div>
        </motion.div>
    );
}
