import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import GlassCard from '../components/ui/GlassCard'

const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')
        const fullName = formData.get('fullName')

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const { error } = await signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`
                    },
                },
            })
            if (error) throw error
            navigate('/dashboard')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
            <GlassCard className="w-full max-w-md p-8 border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-text-muted">Join The Coffee Realm rewards program</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                            <Input
                                name="fullName"
                                placeholder="Full Name"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                    </Button>
                </form>

                <p className="text-center mt-6 text-sm text-text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-semibold">
                        Sign In
                    </Link>
                </p>
            </GlassCard>
        </div>
    )
}

export default SignUp
