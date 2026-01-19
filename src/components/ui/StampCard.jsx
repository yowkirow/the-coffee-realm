import React, { useEffect, useState } from 'react'
import { Coffee, Gift } from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabaseClient'

const StampCard = ({ stamps = 0 }) => {
    const [maxStamps, setMaxStamps] = useState(8)
    const [rewardName, setRewardName] = useState('Free Coffee')
    const [milestones, setMilestones] = useState([])

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('loyalty_settings').select('*').single()
            if (data) {
                setMaxStamps(data.stamps_required)
                setRewardName(data.reward_name)
            }

            const { data: mData } = await supabase.from('loyalty_milestones').select('*')
            if (mData) setMilestones(mData)
        }
        fetchSettings()
    }, [])

    return (
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-emerald-800 font-bold text-lg">Loyalty Card</h3>
                <Coffee className="w-6 h-6 text-emerald-600" />
            </div>

            <p className="text-sm text-gray-500 mb-4 font-semibold">
                <span className="text-emerald-700 font-bold text-lg mr-1">{stamps}</span>
                <span className="text-gray-400">/ {maxStamps} stamps</span>
                <span className="float-right text-emerald-600 text-xs font-normal bg-emerald-100 px-2 py-1 rounded-full">
                    {Math.max(0, maxStamps - stamps)} more to {rewardName}
                </span>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white h-3 rounded-full mb-6 overflow-hidden shadow-inner ring-1 ring-emerald-100">
                <div
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (stamps / maxStamps) * 100)}%` }}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 relative">
                {Array.from({ length: maxStamps }).map((_, i) => {
                    const milestone = milestones.find(m => m.stamps_required === i + 1)
                    return (
                        <div
                            key={i}
                            className={cn(
                                "aspect-square rounded-xl flex items-center justify-center transition-all duration-300 relative group",
                                i < stamps
                                    ? "bg-white shadow-md text-emerald-600 scale-100 ring-2 ring-emerald-50"
                                    : "bg-emerald-900/5 text-emerald-900/20 scale-95"
                            )}
                        >
                            <Coffee
                                className={cn(
                                    "w-1/2 h-1/2",
                                    i < stamps && "fill-current"
                                )}
                                strokeWidth={2.5}
                            />

                            {/* Milestone Marker */}
                            {milestone && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full shadow-sm z-10 animate-pulse group-hover:animate-none">
                                    <Gift className="w-3 h-3" />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {milestone.reward_name}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-6 bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-500/50">
                <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6" />
                    <span className="font-bold">Total Rewards Earned</span>
                </div>
                <span className="font-display font-bold text-2xl">
                    {Math.floor(stamps / maxStamps) + 2} {/* Mock data from image: '2' */}
                </span>
            </div>
        </div>
    )
}

export default StampCard
