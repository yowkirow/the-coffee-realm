import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Card from './Card'
import { Clock, TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react'

const TransactionHistory = ({ userId }) => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) {
            fetchTransactions()
        }
    }, [userId])

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20) // Show last 20 activities

            if (error) throw error
            setTransactions(data || [])
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'EARN': return <TrendingUp className="w-4 h-4 text-emerald-600" />
            case 'REDEEM': return <TrendingDown className="w-4 h-4 text-amber-600" />
            case 'PURCHASE': return <ShoppingBag className="w-4 h-4 text-blue-600" />
            default: return <Clock className="w-4 h-4 text-gray-400" />
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    if (loading) return <div className="text-center text-xs text-gray-400 py-4">Loading history...</div>
    if (transactions.length === 0) return <div className="text-center text-xs text-gray-400 py-4">No recent activity</div>

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 px-1">Recent Activity</h3>
            <div className="space-y-2">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-gray-50`}>
                                {getIcon(tx.type)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{tx.description || tx.type}</p>
                                <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
                            </div>
                        </div>
                        <div className={`font-bold text-sm ${tx.type === 'EARN' ? 'text-emerald-600' : 'text-gray-600'}`}>
                            {tx.type === 'EARN' ? '+' : ''}{tx.amount} pts
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TransactionHistory
