import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    QrCode,
    Clock,
    LogOut,
    Settings,
    Users,
    CheckCircle2,
    CreditCard,
    Loader2
} from "lucide-react";

interface Transaction {
    id: string;
    created_at: string;
    type: 'earn' | 'redeem';
    amount: number;
    customer: {
        email: string;
        full_name?: string;
    }
}

interface Profile {
    full_name?: string;
    role: string;
    email: string;
}

export default function BaristaHome() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [recentScans, setRecentScans] = useState<Transaction[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Subscribe to transactions for real-time activity feed
        const channel = supabase
            .channel('public:transactions')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'transactions' },
                () => {
                    fetchRecentScans();
                }
            )
            .subscribe();

        return () => {
            clearInterval(timer);
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, role, email')
                .eq('id', user.id)
                .single();
            setProfile(profileData);
            await fetchRecentScans();
        }
        setLoading(false);
    };

    const fetchRecentScans = async () => {
        const { data } = await supabase
            .from('transactions')
            .select(`
                id,
                created_at,
                type,
                amount,
                customer:profiles (
                    email,
                    full_name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (data) setRecentScans(data as any);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7]">
            <Loader2 className="animate-spin text-[#11d462] w-10 h-10" />
        </div>
    );

    return (
        <div className="bg-[#f6f8f7] min-h-screen flex flex-col font-sans">
            {/* Header / Top Nav */}
            <header className="flex items-center justify-between border-b border-primary/10 bg-[#0d1b13] px-6 md:px-10 py-4 shadow-lg sticky top-0 z-50">
                <Link to="/staff/home" className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
                    <img src="/brand/logo.png" className="size-8 object-contain" alt="Logo" />
                    <h2 className="text-white text-xl font-bold tracking-tight">The Coffee Realm</h2>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 bg-[#11d462]/20 text-[#11d462] border border-[#11d462]/30 text-sm font-bold">
                        Station 04
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                        <div className="text-right">
                            <p className="text-white text-sm font-bold leading-none">{profile?.full_name || 'Barista'}</p>
                            <p className="text-[#11d462] text-xs font-medium uppercase tracking-wider mt-1">
                                {profile?.role === 'staff' || profile?.role === 'barista' ? 'Barista' : profile?.role}
                            </p>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#11d462]"
                            style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}")` }}></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center py-8 md:py-12 px-4">
                <div className="w-full max-w-[640px] flex flex-col gap-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-2">
                        <h1 className="text-[#0d1b13] text-[32px] md:text-[42px] font-extrabold tracking-tight leading-tight">Barista Scan Home</h1>
                        <p className="text-slate-500 text-base md:text-lg">Ready to scan customer rewards and loyalty codes</p>
                    </div>

                    {/* Scan Portal */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-8">
                        <div className="size-40 md:size-48 rounded-full bg-[#11d462]/10 flex items-center justify-center border-2 border-dashed border-[#11d462] animate-pulse">
                            <QrCode className="text-[#11d462] w-20 h-20 md:w-24 md:h-24" />
                        </div>

                        <Link
                            to="/staff/scanner"
                            className="w-full max-w-sm flex items-center justify-center rounded-2xl h-16 bg-[#11d462] text-[#0d1b13] hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 text-xl font-bold shadow-lg shadow-[#11d462]/20"
                        >
                            <QrCode className="w-8 h-8" />
                            Scan Customer Code
                        </Link>

                        <p className="text-slate-400 text-sm font-medium">Position the customer's QR code in front of the camera</p>
                    </div>

                    {/* Recent scnas */}
                    <div className="w-full">
                        <div className="flex items-center justify-between px-4 pb-4">
                            <h3 className="text-[#0d1b13] text-xl font-bold">Recent Activity</h3>
                            <Link to="/staff/history" className="text-[#11d462] text-sm font-bold hover:underline">View All</Link>
                        </div>

                        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl divide-y divide-slate-50">
                            {recentScans.length > 0 ? recentScans.map((scan) => (
                                <div key={scan.id} className="flex items-center gap-4 px-6 min-h-[80px] py-4 justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 
                                            ${scan.type === 'earn' ? 'bg-[#11d462]/10 text-[#11d462]' : 'bg-blue-50 text-blue-500'}`}>
                                            {scan.type === 'earn' ? <CheckCircle2 className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-[#0d1b13] text-base font-bold truncate max-w-[180px]">
                                                {scan.customer?.full_name || scan.customer?.email?.split('@')[0]}
                                            </p>
                                            <p className={`text-sm font-medium ${scan.type === 'earn' ? 'text-[#11d462]' : 'text-blue-500'}`}>
                                                {scan.type === 'earn' ? `+${scan.amount} Stamp Added` : `Reward Redeemed`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-slate-500 text-sm font-medium">
                                            {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-slate-400 text-xs mt-1">ID: #{scan.id.slice(0, 4)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-slate-400 italic">
                                    No recent activity to show
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer / Controls */}
            <footer className="w-full max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between px-10 py-8 gap-6 border-t border-slate-200 mt-auto">
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Users className="w-4 h-4" />
                        Switch Barista
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Settings className="w-4 h-4" />
                        Terminal Settings
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    End Shift & Log Out
                </button>
            </footer>
        </div>
    );
}
