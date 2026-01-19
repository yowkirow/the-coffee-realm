import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Search, Trash2, UserCog, Shield, Coffee, User } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (!search) {
            setFilteredUsers(users)
        } else {
            const lowerSearch = search.toLowerCase()
            const filtered = users.filter(u =>
                u.full_name?.toLowerCase().includes(lowerSearch) ||
                u.email?.toLowerCase().includes(lowerSearch)
            )
            setFilteredUsers(filtered)
        }
    }, [search, users])

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false }) // Assuming created_at exists, generic sort if not

        if (data) {
            setUsers(data)
            setFilteredUsers(data)
        }
        setLoading(false)
    }

    const handleRoleUpdate = async (userId, newRole) => {
        if (!confirm(`Promote this user to ${newRole}?`)) return

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
            alert(`User role updated to ${newRole}`)
        } catch (error) {
            console.error('Error updating role:', error)
            alert('Failed to update role')
        }
    }

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you SURE you want to DELETE user "${userName}"? This cannot be undone.`)) return

        try {
            const { error } = await supabase.rpc('delete_user_by_admin', { target_user_id: userId })

            if (error) throw error

            setUsers(users.filter(u => u.id !== userId))
            alert('User deleted successfully')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Failed to delete user. Ensure you are an admin.')
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4 text-purple-600" />
            case 'barista': return <Coffee className="w-4 h-4 text-orange-600" />
            default: return <User className="w-4 h-4 text-gray-500" />
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Stats</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{user.full_name || 'Unnamed'}</div>
                                        <div className="text-gray-500 text-xs">{user.email || 'No Email'}</div>
                                        <div className="text-gray-300 font-mono text-[10px]">{user.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(user.role)}
                                            <select
                                                className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer hover:underline"
                                                value={user.role || 'customer'}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="barista">Barista</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {user.points || 0} pts
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.full_name)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
                Total Users: {users.length}
            </p>
        </div>
    )
}

export default UserManagement
