import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, ChevronRight, User } from 'lucide-react'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'

const Landing = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center animate-fade-in">
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Coffee className="w-20 h-20 text-primary relative z-10" strokeWidth={1.5} />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-sm">
                The <span className="text-primary italic">Coffee</span> Realm
            </h1>

            <p className="text-xl text-text-muted mb-10 max-w-md mx-auto leading-relaxed">
                Experience coffee like never before. Join our loyalty program and unlock exclusive rewards.
            </p>

            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <Button
                    className="w-full text-lg h-14"
                    onClick={() => navigate('/dashboard')}
                >
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                </Button>

                <p className="text-sm text-text-muted mt-4">
                    Don't have an account? <span className="text-primary hover:underline cursor-pointer">Join now</span>
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                {[
                    { title: "Earn Points", desc: "Get rewarded for every sip." },
                    { title: "Exclusive Perks", desc: "Access members-only menu items." },
                    { title: "Skip the Line", desc: "Order ahead and save time." }
                ].map((item, i) => (
                    <GlassCard key={i} className="flex flex-col items-center p-6 bg-surface/40 hover:bg-surface/60">
                        <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                        <p className="text-sm text-text-muted">{item.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}

export default Landing
