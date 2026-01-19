import React from 'react'
import { LayoutDashboard, LogOut, QrCode, Coffee } from 'lucide-react'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const navigate = useNavigate()
    const { profile, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="md:col-span-2 bg-gradient-to-br from-primary/20 to-surface border-primary/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Welcome back, {profile?.full_name?.split(' ')[0] || 'Coffee Lover'}!
                            </h2>
                            <p className="text-text-muted">You have <span className="text-primary font-bold text-lg">{profile?.points || 0}</span> points</p>
                        </div>
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-primary/20">
                            {profile?.points || 0}
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="w-full bg-surface-hover h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-1000"
                                style={{ width: `${Math.min(((profile?.points || 0) / 100) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-right mt-2 text-text-muted">
                            {Math.max(100 - (profile?.points || 0), 0)} points to next reward
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col items-center justify-center text-center hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-white p-2 mb-4 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-shadow duration-300">
                        {/* QR Placeholder */}
                        <QrCode className="w-full h-full text-black" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">My Membership</h3>
                    <p className="text-sm text-text-muted">Scan to earn points</p>
                </GlassCard>
            </div>

            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <GlassCard key={i} className="flex items-center justify-between py-4 px-6 hover:bg-surface-hover/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Iced Americano</p>
                                <p className="text-xs text-text-muted">Today, 10:23 AM</p>
                            </div>
                        </div>
                        <span className="text-primary font-bold">+50 pts</span>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
