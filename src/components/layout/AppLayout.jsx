import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-bg text-text font-sans selection:bg-primary/20">
            {/* Subtle Background Gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/40 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {children || <Outlet />}
            </div>
        </div>
    )
}

export default AppLayout
