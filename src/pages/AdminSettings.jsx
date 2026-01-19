import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, ShieldAlert, Gift, Trash2, Plus } from 'lucide-react'
import UserManagement from '../components/admin/UserManagement'

const AdminSettings = () => {
    const { profile } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('config') // 'config' or 'users'
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        stamps_required: 8,
        reward_name: 'Free Coffee'
    })
    const [milestones, setMilestones] = useState([])
    const [newMilestone, setNewMilestone] = useState({ stamps: '', name: '' })
    const [message, setMessage] = useState(null)

    // Verify Admin Access
    useEffect(() => {
        if (profile && profile.role !== 'admin') {
            navigate('/dashboard')
        }
    }, [profile, navigate])

    useEffect(() => {
        fetchSettings()
        fetchMilestones()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('loyalty_settings')
                .select('*')
                .single()

            if (error && error.code !== 'PGRST116') throw error // Ignore 'no rows' initially
            if (data) setSettings(data)
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMilestones = async () => {
        const { data } = await supabase.from('loyalty_milestones').select('*').order('stamps_required', { ascending: true })
        if (data) setMilestones(data)
    }

    const handleAddMilestone = async () => {
        if (!newMilestone.stamps || !newMilestone.name) return

        try {
            const { error } = await supabase.from('loyalty_milestones').insert({
                stamps_required: parseInt(newMilestone.stamps),
                reward_name: newMilestone.name
            })
            if (error) throw error

            setNewMilestone({ stamps: '', name: '' })
            fetchMilestones()
        } catch (error) {
            console.error('Error adding milestone:', error)
            alert('Failed to add milestone')
        }
    }

    const handleDeleteMilestone = async (id) => {
        try {
            const { error } = await supabase.from('loyalty_milestones').delete().eq('id', id)
            if (error) throw error
            fetchMilestones()
        } catch (error) {
            console.error('Error deleting milestone:', error)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('loyalty_settings')
                .upsert({ id: 1, ...settings })

            if (error) throw error
            setMessage({ type: 'success', text: 'Settings updated successfully!' })
        } catch (error) {
            console.error('Error saving settings:', error)
            setMessage({ type: 'error', text: 'Failed to save settings. Are you an admin?' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading settings...</div>

    return (
        <div className="container mx-auto px-4 py-6 max-w-md animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-emerald-700" />
                    <h1 className="text-2xl font-bold">Admin Portal</h1>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('config')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'config'
                            ? 'bg-white text-emerald-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Loyalty Config
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'users'
                            ? 'bg-white text-emerald-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    User Management
                </button>
            </div>

            {activeTab === 'users' ? (
                <UserManagement />
            ) : (
                <>
                    <Card className="bg-white border-emerald-100 shadow-lg">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Stamps Required for Reward
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={settings.stamps_required}
                                    onChange={(e) => setSettings({ ...settings, stamps_required: parseInt(e.target.value) })}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    How many stamps does a user need to collect?
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Reward Name
                                </label>
                                <Input
                                    type="text"
                                    value={settings.reward_name}
                                    onChange={(e) => setSettings({ ...settings, reward_name: e.target.value })}
                                    className="bg-gray-50 border-gray-200"
                                    placeholder="e.g. Free Small Coffee"
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-900/20"
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Configuration
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    {/* Milestones Section */}
                    <Card className="bg-white border-emerald-100 shadow-lg mt-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Gift className="w-5 h-5 text-emerald-700" />
                            <h2 className="text-xl font-bold">Intermediate Rewards</h2>
                        </div>

                        <div className="space-y-4">
                            {milestones.map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div>
                                        <span className="font-bold text-emerald-800">Stamp {m.stamps_required}:</span>
                                        <span className="ml-2 text-gray-700">{m.reward_name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteMilestone(m.id)}
                                        className="text-red-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {milestones.length === 0 && (
                                <p className="text-gray-400 text-sm italic">No intermediate rewards set.</p>
                            )}

                            {/* Add New Milestone */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <Input
                                    type="number"
                                    placeholder="Stamp #"
                                    className="w-24 bg-gray-50"
                                    value={newMilestone.stamps}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, stamps: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    placeholder="Reward Name (e.g. Free Cookie)"
                                    className="flex-1 bg-gray-50"
                                    value={newMilestone.name}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddMilestone}
                                    className="bg-emerald-600 hover:bg-emerald-700 w-auto px-4"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}

export default AdminSettings
