import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, ShieldAlert } from 'lucide-react'

const AdminSettings = () => {
    const { profile } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        stamps_required: 8,
        reward_name: 'Free Coffee'
    })
    const [message, setMessage] = useState(null)

    // Verify Admin Access
    useEffect(() => {
        if (profile && profile.role !== 'admin') {
            navigate('/dashboard')
        }
    }, [profile, navigate])

    useEffect(() => {
        fetchSettings()
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
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-emerald-700" />
                    <h1 className="text-2xl font-bold">Admin Config</h1>
                </div>
            </div>

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
        </div>
    )
}

export default AdminSettings
