import React from 'react'
import { cn } from '../../lib/utils'

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-surface shadow-lg rounded-3xl p-6 border border-border/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
