import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, Coffee } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')

        try {
            const { error } = await signIn({ email, password })
            if (error) throw error
            navigate('/dashboard')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in relative z-10">
            <Card className="w-full max-w-sm p-8 border border-white/40 shadow-2xl bg-white/70 backdrop-blur-md">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-sm">
                        <Coffee className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-bold mb-1 text-text">The Coffee Realm</h1>
                    <p className="text-sm text-text-muted">Loyalty Rewards</p>
                </div>

                {/* Demo Credentials Box */}
                <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Demo Accounts</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-left">
                        <div className="bg-white p-2 rounded border border-emerald-100">
                            <span className="font-bold block text-emerald-700">Admin</span>
                            <span className="text-gray-500 block">admin@demo.com</span>
                            <span className="text-gray-400">pass123</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-emerald-100">
                            <span className="font-bold block text-emerald-700">Barista</span>
                            <span className="text-gray-500 block">barista@demo.com</span>
                            <span className="text-gray-400">pass123</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-emerald-100">
                            <span className="font-bold block text-emerald-700">User</span>
                            <span className="text-gray-500 block">user@demo.com</span>
                            <span className="text-gray-400">pass123</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted ml-1">Email</label>
                        <Input
                            name="email"
                            type="email"
                            className="bg-white border-border focus:border-primary focus:ring-primary/20 text-text"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted ml-1">Password</label>
                        <Input
                            name="password"
                            type="password"
                            className="bg-white border-border focus:border-primary focus:ring-primary/20 text-text"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 mt-4" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/signup" className="text-primary hover:text-primary-hover font-bold text-sm">
                        Create Account
                    </Link>
                </div>
            </Card>
        </div>
    )
}

export default Login
