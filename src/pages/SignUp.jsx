import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Coffee } from "lucide-react"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(email, password)
            navigate("/")
        } catch (err) {
            setError("Failed to create an account: " + err.message)
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-mint-50 font-sans">
            <Card className="w-full max-w-md bg-white border-none shadow-xl rounded-3xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary-600 rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-2 shadow-lg shadow-primary-200">
                        <Coffee className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Join The Realm</CardTitle>
                    <p className="text-gray-500">Start earning rewards today</p>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="coffee@lover.com"
                                className="bg-gray-50 border-gray-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border-gray-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <Input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-50 border-gray-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                            />
                        </div>
                        <Button disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary-200" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
