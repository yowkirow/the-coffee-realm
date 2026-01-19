import React from 'react'
import { Coffee, Gift } from 'lucide-react'
import { cn } from '../../lib/utils'

const StampCard = ({ stamps = 0, maxStamps = 8 }) => {
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
                    {maxStamps - stamps} more to reward
                </span>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white h-3 rounded-full mb-6 overflow-hidden shadow-inner ring-1 ring-emerald-100">
                <div
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${(stamps / maxStamps) * 100}%` }}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: maxStamps }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "aspect-square rounded-xl flex items-center justify-center transition-all duration-300",
                            i < stamps
                                ? "bg-white shadow-md text-emerald-600 scale-100 ring-2 ring-emerald-50"
                                : "bg-emerald-900/5 text-emerald-900/20 scale-95" // Darker placeholder for visibility
                        )}
                    >
                        <Coffee
                            className={cn(
                                "w-1/2 h-1/2",
                                i < stamps && "fill-current"
                            )}
                            strokeWidth={2.5}
                        />
                    </div>
                ))}
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
