import React, { useEffect } from 'react'
import { LogOut, QrCode, Settings } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StampCard from '../components/ui/StampCard'
import FancyQRCode from '../components/ui/FancyQRCode'
import TransactionHistory from '../components/ui/TransactionHistory'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const navigate = useNavigate()
    const { user, profile, signOut, loading, fetchProfile } = useAuth()

    // Retry fetching profile if missing (Recovery Logic)
    useEffect(() => {
        if (user && !profile && !loading) {
            console.log('User loaded but profile missing. Attempting refetch...')
            fetchProfile(user.id)
        }
    }, [user, profile, loading, fetchProfile])

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Logout failed:", error)
            // Force manual cleanup if API fails
            localStorage.clear()
        } finally {
            navigate('/')
            window.location.reload() // Hard refresh to ensure clean state
        }
    }

    // Mocking stamps from points (e.g., 50 points = 1 stamp)
    const stamps = profile?.points ? Math.floor((profile.points % 400) / 50) : 3

    return (
        <div className="container mx-auto px-4 py-6 max-w-md animate-fade-in pb-20">
            <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                <div>
                    <h1 className="text-xl font-bold text-text">Hello, {profile?.full_name?.split(' ')[0] || 'Guest'}!</h1>
                    <p className="text-sm text-text-muted">Welcome back ☕</p>
                </div>
                <Button variant="ghost" className="p-2" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 text-text-muted hover:text-red-500" />
                </Button>
            </header>

            <div className="mb-8">
                <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-none shadow-xl shadow-emerald-900/20 p-1">
                    <StampCard stamps={stamps} />
                </Card>
            </div>


            <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-emerald-200 bg-white shadow-sm">
                <div className="w-48 h-48 mb-4">
                    {profile?.id ? (
                        <FancyQRCode
                            value={profile.id}
                            size={192}
                        />
                    ) : (
                        <QrCode className="w-full h-full text-gray-300" />
                    )}
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg mb-2 border border-gray-100">
                    <code className="text-sm font-mono text-gray-500">{profile?.id ? `ID: ${profile.id.slice(0, 8)}...` : 'Loading...'}</code>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Show this to barista</p>
            </Card>

            <div className="mt-8 space-y-3">
                <Button className="w-full h-14 text-lg shadow-xl shadow-emerald-900/20 bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate('/menu')}>
                    Browse Menu & Order
                </Button>

                <div className="flex gap-2">
                    {/* Barista & Admin: Scan */}
                    {['admin', 'barista'].includes(profile?.role) && (
                        <Button
                            className="flex-1 h-12 text-base bg-emerald-800 text-white hover:bg-emerald-900"
                            onClick={() => navigate('/scanner')}
                        >
                            <QrCode className="w-5 h-5 mr-2" />
                            Scan
                        </Button>
                    )}

                    {/* Admin Only: Settings */}
                    {profile?.role === 'admin' && (
                        <Button
                            className="flex-1 h-12 text-base border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50"
                            variant="outline"
                            onClick={() => navigate('/admin')}
                        >
                            <Settings className="w-5 h-5 mr-2" />
                            Settings
                        </Button>
                    )}
                </div>
            </div>

            {/* Transaction History */}
            <div className="mt-8">
                {profile?.id && <TransactionHistory userId={profile.id} />}
            </div>

            {/* Debug Info - Remove later */}
            <div className="mt-8 text-center opacity-50">
                <p className="text-[10px] text-gray-400 font-mono">
                    Current Role: <span className="font-bold">{profile?.role || 'null'}</span>
                    <br />
                    ID: {profile?.id?.slice(0, 6)}...
                </p>
            </div>
        </div>
    )
}

export default Dashboard
