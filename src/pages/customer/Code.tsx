import { useEffect, useState } from "react";
import { QRCode } from 'react-qrcode-logo';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Loader2, QrCode } from "lucide-react";

interface Profile {
    id: string;
    email: string;
}

export default function RewardCode() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("id, email")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7]">
            <Loader2 className="animate-spin text-[#335e31] w-10 h-10" />
        </div>
    );

    return (
        <div className="bg-[#f6f8f7] min-h-screen flex flex-col items-center px-4 py-8">
            <header className="w-full max-w-[600px] flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-[#335e31]" />
                </button>
                <h1 className="flex-grow text-center text-xl font-bold text-[#335e31]">My Reward Code</h1>
                <div className="w-10"></div> {/* Spacer for balance */}
            </header>

            <main className="w-full max-w-[400px] flex flex-col items-center">
                <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col items-center w-full">
                    <div className="mb-8 p-6 bg-[#f1f7f4] rounded-3xl">
                        <QrCode className="w-12 h-12 text-[#335e31]" />
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-8">
                        {profile?.id && (
                            <QRCode
                                value={JSON.stringify({ id: profile.id, role: 'customer' })}
                                size={250}
                                qrStyle="dots"
                                eyeRadius={15}
                                fgColor="#335e31"
                                bgColor="#ffffff"
                                ecLevel="H"
                            />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-2">Ready to Scan</h2>
                    <p className="text-gray-500 text-center mb-8 max-w-[250px]">
                        Present this code to the barista to collect or redeem your stamps.
                    </p>

                    <div className="w-full bg-[#f1f7f4] py-4 px-6 rounded-2xl flex items-center justify-center gap-3">
                        <span className="text-[#335e31] font-bold">Member ID:</span>
                        <span className="text-gray-600 font-mono text-sm">{profile?.id.slice(0, 8).toUpperCase()}...</span>
                    </div>
                </div>

                <p className="mt-8 text-sm text-gray-400 text-center italic">
                    Keep your screen brightness high for easier scanning at the counter.
                </p>
            </main>
        </div>
    );
}
