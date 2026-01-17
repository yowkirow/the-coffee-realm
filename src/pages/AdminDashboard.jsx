import { useState } from "react"
import { useRewards } from "../context/RewardsContext"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Save, ArrowLeft, Coffee, Plus, Trash2, Gift } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
    const { rewardsConfig, updateConfig, addMilestone, removeMilestone } = useRewards()
    const { userStamps, updateUserStamps, resetRewards } = useAuth()

    const [formData, setFormData] = useState({
        maxStamps: rewardsConfig.maxStamps,
        rewardName: rewardsConfig.rewardName
    })

    // New milestone inputs
    const [newMilestoneStamps, setNewMilestoneStamps] = useState("")
    const [newMilestoneReward, setNewMilestoneReward] = useState("")

    const [saved, setSaved] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxStamps' ? parseInt(value) || 0 : value
        }))
        setSaved(false)
    }

    const handleSave = (e) => {
        e.preventDefault()
        updateConfig(formData)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleAddMilestone = () => {
        if (newMilestoneStamps && newMilestoneReward) {
            addMilestone(newMilestoneStamps, newMilestoneReward);
            setNewMilestoneStamps("");
            setNewMilestoneReward("");
        }
    }

    return (
        <div className="min-h-screen bg-mint-50 p-6 font-sans">
            <div className="max-w-md mx-auto space-y-6">
                <Link to="/" className="text-primary-600 flex items-center gap-2 mb-4 hover:underline font-medium text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                {/* Global Settings */}
                <Card className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-3 bg-primary-100 rounded-2xl text-primary-600 shadow-sm">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900">Program Settings</CardTitle>
                            <p className="text-sm text-gray-500">Configure loyalty rules</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Total Stamps Required (Card Size)</label>
                                <Input
                                    type="number"
                                    name="maxStamps"
                                    value={formData.maxStamps}
                                    onChange={handleChange}
                                    min="4"
                                    max="16"
                                    className="bg-white/50 border-gray-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Final Reward Name</label>
                                <Input
                                    type="text"
                                    name="rewardName"
                                    value={formData.rewardName}
                                    onChange={handleChange}
                                    className="bg-white/50 border-gray-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white gap-2 rounded-xl h-10 shadow-lg shadow-primary-200">
                                <Save className="h-4 w-4" />
                                {saved ? "Saved!" : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Milestones Editor */}
                <Card className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary-600" />
                            Milestones
                        </CardTitle>
                        <p className="text-xs text-gray-500">Add rewards at specific stamp counts</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Stamp #"
                                    type="number"
                                    className="w-24 rounded-xl bg-white/50"
                                    value={newMilestoneStamps}
                                    onChange={(e) => setNewMilestoneStamps(e.target.value)}
                                />
                                <Input
                                    placeholder="Reward (e.g. Free Drink)"
                                    className="flex-1 rounded-xl bg-white/50"
                                    value={newMilestoneReward}
                                    onChange={(e) => setNewMilestoneReward(e.target.value)}
                                />
                                <Button size="icon" className="rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md" onClick={handleAddMilestone}>
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {rewardsConfig.milestones?.map((milestone, index) => (
                                <div key={index} className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white/50 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                                            {milestone.stamps}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{milestone.reward}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeMilestone(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {(!rewardsConfig.milestones || rewardsConfig.milestones.length === 0) && <p className="text-center text-sm text-gray-400 italic py-2">No milestones set</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* User Debugger */}
                <Card className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                            User Data Debugger
                        </CardTitle>
                        <p className="text-xs text-gray-500">Manually edit the current user's state</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white/50">
                            <div className="text-sm font-medium text-gray-700">Current Stamps</div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-8 w-8 rounded-full" onClick={() => updateUserStamps(Math.max(0, userStamps - 1))}>-</Button>
                                <span className="font-bold w-6 text-center">{userStamps}</span>
                                <Button size="sm" variant="outline" className="h-8 w-8 rounded-full" onClick={() => updateUserStamps(userStamps + 1)}>+</Button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white/50">
                            <div className="text-sm font-medium text-gray-700">Rewards Earned</div>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={resetRewards}>
                                Reset to 0
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Live Preview */}
                <div className="space-y-2 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide ml-1">Glassmorphism Preview</h3>
                    <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                        {/* Glass Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[1px]"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="font-bold text-lg">Loyalty Card</h2>
                                    <p className="text-primary-100 text-xs">The Coffee Realm</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[...Array(formData.maxStamps)].map((_, i) => {
                                    const milestone = rewardsConfig.milestones?.find(m => m.stamps === i + 1);
                                    return (
                                        <div key={i} className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center relative",
                                            "bg-white/20 border border-white/10"
                                        )}>
                                            {milestone ? (
                                                <Gift className="h-4 w-4 text-yellow-300 drop-shadow-sm" />
                                            ) : (
                                                <Coffee className="h-3 w-3 text-white/50" />
                                            )}
                                            {milestone && <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full shadow-sm animate-pulse"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
