import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Persistent User Data from Supabase
    const [userStamps, setUserStamps] = useState(0);
    const [rewardsEarned, setRewardsEarned] = useState(0);

    // Fetch user stamps from Supabase
    async function fetchUserData(userId) {
        try {
            const { data, error } = await supabase
                .from('user_stamps')
                .select('stamps, rewards_earned')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error fetching user data:', error);
                return;
            }

            if (data) {
                setUserStamps(data.stamps || 0);
                setRewardsEarned(data.rewards_earned || 0);
            } else {
                // Create initial record for new user
                await supabase
                    .from('user_stamps')
                    .insert([{ user_id: userId, stamps: 0, rewards_earned: 0 }]);
            }
        } catch (err) {
            console.error('Error in fetchUserData:', err);
        }
    }

    // Supabase login function
    async function login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    }

    // Supabase signup function
    async function signup(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    }

    // Logout
    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setCurrentUser(null);
        setUserStamps(0);
        setRewardsEarned(0);
    }

    // Data Mutations
    async function addStamps(amount) {
        if (!currentUser) return;

        const newStamps = userStamps + amount;
        setUserStamps(newStamps);

        // Update in Supabase
        const { error } = await supabase
            .from('user_stamps')
            .update({ stamps: newStamps })
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error updating stamps:', error);
            // Revert on error
            setUserStamps(userStamps);
        }
    }

    async function updateUserStamps(newCount) {
        if (!currentUser) return;

        setUserStamps(newCount);

        // Update in Supabase
        const { error } = await supabase
            .from('user_stamps')
            .update({ stamps: newCount })
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error updating stamps:', error);
            setUserStamps(userStamps);
        }
    }

    async function resetRewards() {
        if (!currentUser) return;

        setRewardsEarned(0);

        const { error } = await supabase
            .from('user_stamps')
            .update({ rewards_earned: 0 })
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error resetting rewards:', error);
        }
    }

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUser(session?.user ?? null);
            if (session?.user) {
                fetchUserData(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
            if (session?.user) {
                fetchUserData(session.user.id);
            } else {
                setUserStamps(0);
                setRewardsEarned(0);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        userStamps,
        rewardsEarned,
        addStamps,
        updateUserStamps,
        resetRewards
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
