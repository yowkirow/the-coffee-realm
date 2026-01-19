import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-bg text-text font-sans selection:bg-primary/30">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {children || <Outlet />}
            </div>
        </div>
    )
}

export default AppLayout
