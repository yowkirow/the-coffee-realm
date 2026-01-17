import { cn } from "@/lib/utils"

const Button = ({ className, variant = "default", size = "default", ...props }) => {
    const variants = {
        default: "bg-coffee-600 text-white hover:bg-coffee-700",
        outline: "border border-coffee-600 text-coffee-600 hover:bg-coffee-50",
        ghost: "hover:bg-coffee-100 text-coffee-800",
        link: "text-coffee-600 underline-offset-4 hover:underline",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                "inline-flex ITEMS-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}

export { Button }
