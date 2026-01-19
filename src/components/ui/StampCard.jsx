import React from 'react'
import { Coffee, Gift } from 'lucide-react'
import { cn } from '../../lib/utils'

const StampCard = ({ stamps = 0, maxStamps = 8 }) => {
    return (
        <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-primary font-bold text-lg">Loyalty Card</h3>
                <Coffee className="w-6 h-6 text-primary" />
            </div>

            <p className="text-sm text-text-muted mb-4 font-semibold">
                {stamps} / {maxStamps} stamps
                <span className="float-right text-primary text-xs font-normal">
                    {maxStamps - stamps} more to reward
                </span>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white h-3 rounded-full mb-6 overflow-hidden shadow-inner">
                <div
                    className="bg-primary h-full transition-all duration-1000 ease-out"
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
                                ? "bg-white shadow-md text-primary scale-100"
                                : "bg-primary/5 text-primary/20 scale-95"
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

            <div className="mt-6 bg-primary text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-primary/20">
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
