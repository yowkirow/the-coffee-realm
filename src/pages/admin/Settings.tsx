import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Save, ArrowLeft, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [milestones, setMilestones] = useState<{ count: number, reward: string }[]>([]);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const { data } = await supabase
            .from('loyalty_config')
            .select('*')
            .single();

        if (data) {
            setConfig(data);
            // Parse milestones from JSONB
            // Expected format: { "6": "Coffee", "12": "Free" }
            if (data.reward_milestones) {
                const parsed = Object.entries(data.reward_milestones).map(([k, v]) => ({
                    count: parseInt(k),
                    reward: v as string
                })).sort((a, b) => a.count - b.count);
                setMilestones(parsed);
            }
        }
        setLoading(false);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Convert milestones array back to object
        const milestonesObj = milestones.reduce((acc, curr) => {
            if (curr.count > 0 && curr.reward.trim() !== "") {
                acc[curr.count] = curr.reward;
            }
            return acc;
        }, {} as Record<string, string>);

        const { error } = await supabase
            .from('loyalty_config')
            .update({
                total_stamps_required: config.total_stamps_required,
                program_name: config.program_name,
                reward_milestones: milestonesObj
            })
            .eq('id', 1);

        if (error) {
            alert('Error updating settings');
        } else {
            alert('Settings saved!');
        }
        setSaving(false);
    };

    const addMilestone = () => {
        setMilestones([...milestones, { count: 0, reward: '' }]);
    };

    const removeMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const updateMilestone = (index: number, field: 'count' | 'reward', value: string | number) => {
        const newMilestones = [...milestones];
        if (field === 'count') newMilestones[index].count = parseInt(value as string) || 0;
        else newMilestones[index].reward = value as string;
        setMilestones(newMilestones);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-display font-bold text-primary">Admin Settings</h1>
            </div>

            <GlassCard className="p-6 bg-white/50 border-black/5">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">General Config</h3>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Program Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-lg border border-black/10 bg-white"
                                value={config?.program_name || ''}
                                onChange={e => setConfig({ ...config, program_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Total Stamps Required
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 rounded-lg border border-black/10 bg-white"
                                value={config?.total_stamps_required || 12}
                                onChange={e => setConfig({ ...config, total_stamps_required: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Reward Milestones</h3>
                            <Button type="button" size="sm" variant="outline" onClick={addMilestone}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {milestones.map((m, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <div className="w-20">
                                        <input
                                            type="number"
                                            placeholder="#"
                                            className="w-full p-2 rounded-lg border border-black/10 bg-white"
                                            value={m.count}
                                            onChange={e => updateMilestone(i, 'count', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Reward Description (e.g. Free Coffee)"
                                            className="w-full p-2 rounded-lg border border-black/10 bg-white"
                                            value={m.reward}
                                            onChange={e => updateMilestone(i, 'reward', e.target.value)}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeMilestone(i)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {milestones.length === 0 && (
                                <p className="text-sm text-gray-500 italic text-center py-2">No specific milestones set.</p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
