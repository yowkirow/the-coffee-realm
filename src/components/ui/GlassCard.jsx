import React from 'react'
import { cn } from '../../lib/utils'

const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "backdrop-blur-md bg-surface/80 border border-white/5 shadow-xl rounded-2xl p-6",
                "hover:border-white/10 transition-colors duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default GlassCard
