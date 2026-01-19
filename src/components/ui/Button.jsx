import React from 'react'
import { cn } from '../../lib/utils'

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/30 hover:shadow-primary/40 border border-transparent',
        outline: 'bg-white/50 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-black/5'
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center px-6 py-3 rounded-xl font-display font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
