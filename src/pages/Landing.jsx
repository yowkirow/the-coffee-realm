import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, ChevronRight, User } from 'lucide-react'
import Button from '../components/ui/Button'


const Landing = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center animate-fade-in relative z-10">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 rotate-3 transition-transform hover:rotate-0 duration-300">
                    <Coffee className="w-12 h-12 text-primary" strokeWidth={2} />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-text">
                The Coffee Realm
            </h1>
            <p className="text-lg text-primary font-medium mb-2">Loyalty Rewards</p>

            <p className="text-text-muted mb-10 max-w-xs mx-auto leading-relaxed">
                Collect stamps, earn rewards, and enjoy exclusive perks.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button
                    className="w-full text-lg h-14"
                    onClick={() => navigate('/login')}
                >
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                </Button>

                <Button
                    variant="outline"
                    className="w-full text-lg h-14"
                    onClick={() => navigate('/signup')}
                >
                    Create Account
                </Button>
            </div>
        </div>
    )
}

export default Landing
