import React from 'react'
import { cn } from '../../lib/utils'

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-primary text-black hover:bg-primary-hover shadow-lg hover:shadow-primary/20',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
        ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-white/5'
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center px-6 py-3 rounded-xl font-display font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
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
