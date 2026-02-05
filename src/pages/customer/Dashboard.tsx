import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Coffee, CakeSlice, Cookie, Soup, Loader2, Star, QrCode, Scan } from "lucide-react";

interface Profile {
    id: string;
    email: string;
    stamps_balance: number;
    full_name?: string;
    points?: number;
}

export default function CustomerDashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        fetchProfile();
        fetchConfig();

        // Subscribe to realtime changes for the profile
        let channel: any;
        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            channel = supabase
                .channel('public:profiles')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
                    (payload) => {
                        setProfile(payload.new as Profile);
                    }
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (channel) supabase.removeChannel(channel);
        }
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile(data);
        }
        setLoading(false);
    };

    const fetchConfig = async () => {
        const { data } = await supabase.from('loyalty_config').select('*').single();
        if (data) setConfig(data);
    };

    const totalStamps = config?.total_stamps_required || 10;
    const currentStamps = profile?.stamps_balance || 0;
    const progressPercentage = Math.min((currentStamps / totalStamps) * 100, 100);

    const getStampIcon = (index: number) => {
        if (index < 6) return <Coffee className="w-7 h-7" />;
        if (index < 8) return <CakeSlice className="w-7 h-7" />;
        if (index < 9) return <Cookie className="w-7 h-7" />;
        return <Soup className="w-7 h-7" />;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7]">
            <Loader2 className="animate-spin text-[#335e31] w-10 h-10" />
        </div>
    );

    return (
        <main className="flex flex-col gap-6 py-8 px-4 max-w-[600px] mx-auto">
            {/* Welcome Section */}
            {/* Welcome Section */}
            <div className="flex items-center gap-5 p-2">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 ring-4 ring-[#335e31]/20 shadow-lg"
                    style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}")` }}></div>
                <div className="flex flex-col justify-center">
                    <p className="text-2xl font-bold leading-tight tracking-tight">Welcome Back, {profile?.full_name || profile?.email?.split('@')[0]}!</p>
                    <p className="text-[#335e31] font-semibold text-base mt-1 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {profile?.points || 0} loyalty points
                    </p>
                </div>
            </div>

            {/* Stamp Card Section */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xl font-bold">Stamp Card</p>
                            <p className="text-gray-500 text-sm">Collect {totalStamps} to get a free coffee</p>
                        </div>
                        <div className="bg-[#335e31]/10 text-[#335e31] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Active
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {Array.from({ length: totalStamps }).map((_, i) => {
                            const isStamped = i < currentStamps;
                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
                                                ${isStamped
                                            ? "bg-[#335e31] text-white shadow-[#335e31]/30 scale-105"
                                            : "border-2 border-dashed border-gray-200 text-gray-200"}`}
                                >
                                    <div className={isStamped ? "" : "opacity-50"}>
                                        {getStampIcon(i)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-baseline">
                            <p className="font-bold text-lg">{totalStamps - currentStamps} stamps to go</p>
                            <p className="text-[#335e31] font-bold">{Math.round(progressPercentage)}%</p>
                        </div>
                        <div className="rounded-full bg-gray-100 h-3 w-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#335e31] transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium italic">
                            {currentStamps >= totalStamps
                                ? "You've earned a free coffee! Visit us to redeem."
                                : `You're ${Math.round(progressPercentage)}% of the way to a free coffee on us!`}
                        </p>
                    </div>
                </div>

                {/* Show My Reward Code Invitation Card */}
                <div className="bg-[#f1f7f4] rounded-3xl p-8 flex flex-col items-center gap-6 shadow-sm border border-[#e7f3ec]">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <QrCode className="w-8 h-8 text-[#335e31]" />
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-[#335e31] text-xl font-bold leading-tight">
                            Ready to collect points or redeem?
                        </p>
                        <p className="text-gray-500 text-sm max-w-[280px] mx-auto">
                            Present your unique code to the barista at the checkout counter.
                        </p>
                    </div>

                    <Link
                        to="/customer/code"
                        className="w-full bg-[#335e31] hover:bg-[#2c522a] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#335e31]/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    >
                        <Scan className="w-6 h-6" />
                        Show My Reward Code
                    </Link>
                </div>
            </div>

            {/* Special Offers Section */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Special Offers</h3>
                    <button className="text-[#335e31] font-bold text-sm hover:underline bg-transparent border-none p-0 cursor-pointer">
                        View all
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
                    <div className="min-w-[280px] bg-white rounded-xl shadow-md flex flex-col snap-start overflow-hidden border border-gray-100">
                        <div className="h-32 w-full bg-center bg-cover"
                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCc3ee1HgRTXtWJu_BYu5W4HSn-bsnF5q398dEKqV3ey05ha2taStTfV4bWqouW6MBKznq_ajiR4hOSkd6OTGzSlDBK56wlZbY_O3WDqNf7sBwL7bvu5hASp_Hn9t5Y4Kk5r-GuolwjcOpw4EzvgT97ergDl7jYwVVQwbxFm_OYlQfrxrWt7qzNaMAw5PXYctNWkh5qrie70n4fvD88Ap8p_nMaz0_4o-Pxu9ZxwQjnnLO37R6iXjPPXdtEQXyFYPATYyVGIctbLi4d")` }}>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <p className="font-bold text-[#335e31]">Double Stamp Tuesday</p>
                            <p className="text-sm text-gray-500">Get 2 stamps for every drink purchased today!</p>
                        </div>
                    </div>
                    <div className="min-w-[280px] bg-white rounded-xl shadow-md flex flex-col snap-start overflow-hidden border border-gray-100">
                        <div className="h-32 w-full bg-center bg-cover"
                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDHzjKn8uyw_6yPUb5a2rpOXu3x9grWu-dltxW86_0DKv9Rrewx-CpCX51jBeREv-8-7Vhz8gknrmn0SKeR7Wxc3JnY-u0Q8TPkHp3wRNmwfvjY4Kyglk1BfaCccm3LvgfVTU64tJKK8EgqJOT5xCEvuaCr6x1loAeA8fzVwqskB23mgrAmd6zaZkxNBNQV9nhAC9fC6BZ79kDl4D_ZEVI-2Roti3lAKi_6sDEoLAaGXXXv7Savr5WxvLBtslTARY--Qqxy39q08RQ")` }}>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <p className="font-bold text-[#335e31]">20% Off Pastries</p>
                            <p className="text-sm text-gray-500">Pair your coffee with a fresh croissant for less.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
