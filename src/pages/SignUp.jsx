import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Loader2, Coffee } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

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
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in relative z-10">
            <Card className="w-full max-w-sm p-8 border-none shadow-xl">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center mb-3 text-primary">
                        <Coffee className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-bold mb-1 text-text">Create Account</h1>
                    <p className="text-xs text-text-muted">Start earning rewards today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted ml-1">Full Name</label>
                        <Input
                            name="fullName"
                            placeholder="John Doe"
                            className="bg-white border-border focus:border-primary focus:ring-primary/20 text-text"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted ml-1">Email</label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="bg-white border-border focus:border-primary focus:ring-primary/20 text-text"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted ml-1">Password</label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="******"
                            className="bg-white border-border focus:border-primary focus:ring-primary/20 text-text"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 mt-4" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-hover font-bold">
                            Log In
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default SignUp
