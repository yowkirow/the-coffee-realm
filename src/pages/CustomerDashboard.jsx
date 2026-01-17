import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"
import { useRewards } from "../context/RewardsContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Coffee, Gift, Camera, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CustomerDashboard() {
    const { currentUser, logout, userStamps, rewardsEarned } = useAuth()
    const { rewardsConfig } = useRewards()

    // Stamp Logic
    const maxStamps = rewardsConfig.maxStamps;
    const currentStamps = userStamps;
    // Rewards logic - in a real app this would be calculated from history
    // For this mock we just use the simple persisted number

    const stampsRemaining = Math.max(0, maxStamps - currentStamps);
    const progressPercent = Math.min(100, (currentStamps / maxStamps) * 100);

    return (
        <div className="min-h-screen bg-mint-50 p-6 space-y-6 max-w-md mx-auto font-sans">

            {/* Header Section */}
            <Card className="rounded-3xl border-white/40 shadow-xl bg-white/70 backdrop-blur-lg overflow-hidden">
                <CardContent className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Hello, {currentUser?.displayName?.split(' ')[0] || 'Guest'}!</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Welcome back <span className="text-lg">👋</span>
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-red-500">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>

            {/* Loyalty Card Section - Glassmorphism */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-teal-400 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Card className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl border border-white/10 text-white shadow-2xl overflow-hidden relative z-10">

                    {/* Visual Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-16 -translate-x-16 pointer-events-none"></div>

                    <CardContent className="p-6 pb-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="font-bold text-lg tracking-tight">Loyalty Card</h2>
                                <p className="text-primary-100 text-xs font-medium opacity-80 uppercase tracking-widest">{rewardsConfig.rewardName}</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Coffee className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <div className="flex justify-between text-sm mb-2 font-medium px-1">
                            <span className="text-primary-50">{currentStamps} / {maxStamps} stamps</span>
                            <span className="text-primary-50">{stampsRemaining} more to reward</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-black/20 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/5">
                            <div className="h-full bg-gradient-to-r from-white/80 to-white rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        {/* Stamp Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {[...Array(maxStamps)].map((_, i) => {
                                const milestone = rewardsConfig.milestones?.find(m => m.stamps === i + 1);
                                const isAchieved = i < currentStamps;
                                const isNext = i === currentStamps;

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group/slot",
                                            isAchieved
                                                ? "bg-white text-primary-600 shadow-lg scale-100"
                                                : "bg-white/10 text-white/30 border border-white/10 hover:bg-white/20",
                                            isNext && "ring-2 ring-white/50 ring-offset-2 ring-offset-primary-700 animate-pulse"
                                        )}
                                    >
                                        {milestone ? (
                                            <>
                                                <Gift className={cn("h-5 w-5 mb-0.5", isAchieved ? "text-primary-600" : "text-yellow-300")} />
                                                {isAchieved && <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full border-2 border-primary-600"></div>}
                                            </>
                                        ) : (
                                            <Coffee className={cn("h-5 w-5", isAchieved && "opacity-100")} />
                                        )}

                                        {/* Milestone Tooltip */}
                                        {milestone && (
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/slot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                                {milestone.reward}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Rewards Banner */}
                        <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-400/20 p-2 rounded-full text-yellow-300">
                                    <Star className="h-4 w-4 fill-yellow-300" />
                                </div>
                                <span className="font-medium text-sm text-white/90">Rewards Earned</span>
                            </div>
                            <span className="font-bold text-2xl text-white">{rewardsEarned}</span>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* QR Code Section */}
            <Card className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden text-center">
                <CardContent className="p-10 flex flex-col items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <QRCodeSVG
                            value={currentUser?.uid || "guest"}
                            size={180}
                            level={"H"}
                            fgColor="#16a34a" // Primary-600
                            bgColor="#FFFFFF"
                        />
                    </div>

                    <div className="w-full">
                        <div className="bg-gray-50/50 border border-gray-200/50 py-3 px-4 rounded-lg font-mono text-xs text-gray-500 truncate w-full max-w-[250px] mx-auto select-all">
                            {currentUser?.email || "sample@coffeelover.com"}
                        </div>
                        <p className="text-gray-400 text-xs mt-3">Show this to barista</p>
                    </div>
                </CardContent>
            </Card>

            {/* Barista & Admin Access Links */}
            <div className="flex justify-between items-center px-2">
                <Link to="/admin" className="text-xs text-gray-400 hover:text-primary-600 font-medium transition-colors">
                    Admin Area
                </Link>
                <Link to="/scanner">
                    <Button variant="outline" className="rounded-full bg-white/80 border-primary-100 text-primary-700 hover:bg-primary-50 gap-2 shadow-sm text-xs h-9 backdrop-blur-sm">
                        <Camera className="h-3 w-3" /> Barista Mode
                    </Button>
                </Link>
            </div>

        </div>
    )
}
