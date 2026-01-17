import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const RewardsContext = createContext();

export function useRewards() {
    return useContext(RewardsContext);
}

export function RewardsProvider({ children }) {
    // Default Config
    const defaultConfig = {
        maxStamps: 8,
        rewardName: "Free Premium Roast",
        milestones: [
            { stamps: 4, reward: "Free Drink" },
            { stamps: 6, reward: "Free Food" },
            { stamps: 8, reward: "Free Premium Roast" }
        ]
    };

    const [rewardsConfig, setRewardsConfig] = useState(defaultConfig);
    const [loading, setLoading] = useState(true);

    // Fetch config from Supabase
    async function fetchConfig() {
        try {
            const { data, error } = await supabase
                .from('rewards_config')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching config:', error);
                setLoading(false);
                return;
            }

            if (data) {
                // Fetch milestones
                const { data: milestonesData } = await supabase
                    .from('milestones')
                    .select('*')
                    .order('stamps', { ascending: true });

                setRewardsConfig({
                    maxStamps: data.max_stamps,
                    rewardName: data.reward_name,
                    milestones: milestonesData || []
                });
            } else {
                // Initialize default config in database
                await supabase.from('rewards_config').insert([{
                    max_stamps: defaultConfig.maxStamps,
                    reward_name: defaultConfig.rewardName
                }]);

                // Initialize default milestones
                const milestonesToInsert = defaultConfig.milestones.map(m => ({
                    stamps: m.stamps,
                    reward: m.reward
                }));
                await supabase.from('milestones').insert(milestonesToInsert);
            }
        } catch (err) {
            console.error('Error in fetchConfig:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchConfig();
    }, []);

    const updateConfig = async (newConfig) => {
        const updatedConfig = { ...rewardsConfig, ...newConfig };
        setRewardsConfig(updatedConfig);

        // Update in Supabase
        await supabase
            .from('rewards_config')
            .update({
                max_stamps: updatedConfig.maxStamps,
                reward_name: updatedConfig.rewardName
            })
            .eq('id', 1); // Assuming single config row
    };

    const addMilestone = async (stamps, reward) => {
        const newMilestone = { stamps: parseInt(stamps), reward };

        // Insert into Supabase
        const { error } = await supabase
            .from('milestones')
            .insert([newMilestone]);

        if (!error) {
            const newMilestones = [...rewardsConfig.milestones, newMilestone]
                .sort((a, b) => a.stamps - b.stamps);
            setRewardsConfig(prev => ({ ...prev, milestones: newMilestones }));
        }
    };

    const removeMilestone = async (index) => {
        const milestoneToRemove = rewardsConfig.milestones[index];

        // Delete from Supabase
        const { error } = await supabase
            .from('milestones')
            .delete()
            .eq('stamps', milestoneToRemove.stamps)
            .eq('reward', milestoneToRemove.reward);

        if (!error) {
            setRewardsConfig(prev => ({
                ...prev,
                milestones: prev.milestones.filter((_, i) => i !== index)
            }));
        }
    };

    const value = {
        rewardsConfig,
        updateConfig,
        addMilestone,
        removeMilestone,
        loading
    };

    if (loading) {
        return <div className="min-h-screen bg-mint-50 flex items-center justify-center">
            <div className="text-primary-600 font-semibold">Loading...</div>
        </div>;
    }

    return (
        <RewardsContext.Provider value={value}>
            {children}
        </RewardsContext.Provider>
    );
}
