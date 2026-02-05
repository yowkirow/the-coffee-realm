import { Outlet, Link, useLocation } from "react-router-dom";
import { Receipt, Star, Map, User, Settings, Scan, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
    id: string;
    email: string;
    role: string;
}

export default function MobileLayout() {
    const location = useLocation();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile(data);
            }
        };
        fetchProfile();
    }, []);

    const isBarista = profile?.role === 'barista' || profile?.role === 'staff' || profile?.role === 'admin';
    const isAdmin = profile?.role === 'admin';

    // Desktop Header Navigation Links
    const deskNavItems = isBarista
        ? [
            { label: "Home", path: "/staff/home" },
            { label: "Scanner", path: "/staff/scanner" },
            { label: "Profile", path: "/staff/profile" },
        ]
        : [
            { label: "Orders", path: "/customer/orders" },
            { label: "Rewards", path: "/customer/dashboard" },
            { label: "Locations", path: "/customer/locations" },
            { label: "Profile", path: "/customer/profile" },
        ];

    if (isAdmin) {
        deskNavItems.push({ label: "Admin Settings", path: "/admin/settings" });
    }

    return (
        <div className="bg-[#f1f7f4] min-h-screen text-[#0e1b13] font-sans transition-colors duration-200">
            <div className="layout-container flex flex-col items-center">
                {/* Fixed Header (Stitch Design) */}
                <header className="w-full max-w-[960px] flex items-center justify-between border-b border-solid border-[#e7f3ec] px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/brand/logo.png" className="h-10 w-auto object-contain" alt="The Coffee Realm Logo" />
                        <h2 className="text-xl font-bold tracking-tight text-[#335e31] uppercase sr-only md:not-sr-only">The Coffee Realm</h2>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-1 justify-end gap-8 px-8">
                        {deskNavItems.map((item) => (
                            <Link
                                key={item.path}
                                className={`text-sm font-medium transition-colors hover:text-[#335e31] ${location.pathname === item.path ? "text-[#335e31] underline underline-offset-4" : "text-gray-500"}`}
                                to={item.path}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Avatar */}
                    <Link to={isBarista ? "/staff/profile" : "/customer/profile"} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#335e31]"
                        style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}")` }}>
                    </Link>
                </header>

                {/* Main Content Area */}
                <main className="w-full flex-grow">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation (Stitch Design) */}
                <div className="md:hidden">
                    <footer className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#e7f3ec] z-50">
                        <div className="flex justify-around items-center py-3">
                            {isBarista ? (
                                <>
                                    <Link to="/staff/home" className={`flex flex-col items-center transition-colors ${location.pathname === "/staff/home" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <Home className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Home</span>
                                    </Link>
                                    <Link to="/staff/scanner" className={`flex flex-col items-center transition-colors ${location.pathname === "/staff/scanner" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <Scan className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Scanner</span>
                                    </Link>
                                    <Link to="/staff/profile" className={`flex flex-col items-center transition-colors ${location.pathname === "/staff/profile" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <User className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Profile</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/customer/orders" className={`flex flex-col items-center transition-colors ${location.pathname === "/customer/orders" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <Receipt className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Orders</span>
                                    </Link>
                                    <Link to="/customer/dashboard" className={`flex flex-col items-center transition-colors ${location.pathname === "/customer/dashboard" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <Star className={`w-6 h-6 ${location.pathname === "/customer/dashboard" ? "fill-current" : ""}`} />
                                        <span className="text-[10px] font-bold mt-1">Rewards</span>
                                    </Link>

                                    {/* Integrated FAB */}
                                    <Link to="/customer/code" className="relative -top-6 flex flex-col items-center group">
                                        <div className="bg-[#335e31] p-4 rounded-full shadow-xl group-hover:bg-[#2c522a] group-hover:scale-110 active:scale-95 transition-all outline outline-4 outline-[#f1f7f4]">
                                            <Scan className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-bold mt-1 text-[#335e31] absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity">Scan</span>
                                    </Link>

                                    <Link to="/customer/locations" className={`flex flex-col items-center transition-colors ${location.pathname === "/customer/locations" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <Map className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Find Us</span>
                                    </Link>
                                    <Link to="/customer/profile" className={`flex flex-col items-center transition-colors ${location.pathname === "/customer/profile" ? "text-[#335e31]" : "text-gray-400"}`}>
                                        <User className="w-6 h-6" />
                                        <span className="text-[10px] font-bold mt-1">Profile</span>
                                    </Link>
                                </>
                            )}
                            {isAdmin && (
                                <Link to="/admin/settings" className={`flex flex-col items-center transition-colors ${location.pathname === "/admin/settings" ? "text-[#335e31]" : "text-gray-400"}`}>
                                    <Settings className="w-6 h-6" />
                                    <span className="text-[10px] font-bold mt-1">Admin</span>
                                </Link>
                            )}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
