import React from 'react'
import { cn } from '../../lib/utils'

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-[#15803d] text-white hover:bg-[#166534] shadow-lg shadow-green-900/20 border border-transparent',
        outline: 'bg-white/80 backdrop-blur-sm border-2 border-[#15803d] text-[#15803d] hover:bg-[#15803d] hover:text-white',
        ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-black/5'
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
