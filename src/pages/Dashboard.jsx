import React from 'react'
import { LogOut, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StampCard from '../components/ui/StampCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const navigate = useNavigate()
    const { profile, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
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
                        // <QRCodeSVG
                        //     value={profile.id}
                        //     size={192}
                        //     fgColor="#047857" // emerald-700
                        //     className="w-full h-full"
                        // />
                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">QR CODE HERE</div>
                    ) : (
                        <QrCode className="w-full h-full text-gray-300" />
                    )}
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg mb-2 border border-gray-100">
                    <code className="text-sm font-mono text-gray-500">{profile?.id ? `ID: ${profile.id.slice(0, 8)}...` : 'Loading...'}</code>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Show this to barista</p>
            </Card>

            <div className="mt-8">
                <Button className="w-full h-14 text-lg shadow-xl shadow-emerald-900/20 bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate('/menu')}>
                    Browse Menu & Order
                </Button>
            </div>
        </div>
    )
}

export default Dashboard
