import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Check role to redirect
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user?.id)
                .single();

            const isStaffOrAdmin = profile?.role === "barista" || profile?.role === "staff" || profile?.role === "admin";
            if (isStaffOrAdmin) {
                navigate("/staff/home");
            } else {
                navigate("/customer/dashboard");
            }
        }
    };

    return (
        <div className="bg-[#f1f7f4] min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="layout-container flex h-full grow flex-col items-center justify-center w-full">
                <div className="layout-content-container flex flex-col w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e7f3ec]">
                    <div className="flex flex-col items-center pt-12 pb-6 px-8 text-center">
                        <div className="mb-6">
                            <div className="flex flex-col items-center">
                                <div className="text-[#31512A]">
                                    <img src="/brand/logo.png" className="w-32 h-32 object-contain" alt="The Coffee Realm Logo" />
                                </div>
                                <h1 className="text-[#31512A] text-2xl font-bold tracking-tight uppercase mt-2">The Coffee Realm</h1>
                            </div>
                        </div>
                        <h2 className="text-[#31512A] tracking-tight text-3xl font-bold leading-tight">
                            Welcome Back
                        </h2>
                        <p className="text-[#5c7a56] text-base font-normal leading-normal pt-2">
                            Freshly brewed coffee is just a sign-in away.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="px-8 pb-10 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="flex flex-col flex-1">
                                <p className="text-[#31512A] text-sm font-semibold leading-normal pb-1.5">Email</p>
                                <div className="relative flex items-center">
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#31512A] focus:outline-0 focus:ring-2 focus:ring-[#31512A] border border-[#d0e7d9] bg-white h-14 placeholder:text-[#94bda6] px-4 text-base font-normal leading-normal transition-all"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <p className="text-[#31512A] text-sm font-semibold leading-normal pb-1.5">Password</p>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#31512A] focus:outline-0 focus:ring-2 focus:ring-[#31512A] border border-[#d0e7d9] bg-white h-14 placeholder:text-[#94bda6] px-4 text-base font-normal leading-normal transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div className="flex justify-end -mt-2">
                            <button type="button" className="text-[#31512A] text-sm font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                                Forgot Password?
                            </button>
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-[#31512A] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                            >
                                <span>{loading ? "Signing In..." : "Sign In"}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 py-4">
                            <div className="h-[1px] bg-[#d0e7d9] grow"></div>
                            <span className="text-[#94bda6] text-xs font-medium uppercase tracking-wider">or</span>
                            <div className="h-[1px] bg-[#d0e7d9] grow"></div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[#5c7a56] text-sm">Don't have an account?</p>
                            <Link to="/auth/register" className="text-[#31512A] text-base font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">
                                Create an Account
                            </Link>
                        </div>
                    </form>

                    <div className="w-full h-24 bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden opacity-90"
                        style={{
                            backgroundImage: `linear-gradient(to top, rgba(49, 81, 42, 0.2), transparent), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUunouhkLg_3hK1xXnXOCjKveH0vQoYvhKd6h_RqPhTxJY4rQ5LJD2jPRJNA5Uog2gm6Iq4fxZpB3A115Y7FkSp3W3_cwFNXRK3-Xk03G_F_0bikRjZx-enz05d0x0UhM1uMso-gpzD20nfqQX3I9fHpAkaoJ2vz9LUzcz8kooQCMsSHYCrHMoLifQvxEDkfC16_twDqsFrLXmQ1EYMiRc_UOLbR4wXYkF31uPkGbFa2grJ-jG8vWevLJuTNtE1kmoL2aTJP_S1bXT")`
                        }}>
                    </div>
                </div>
            </div>
        </div>
    );
}
