import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | undefined>("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email);
        })
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/auth/login");
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <h1 className="text-2xl font-display font-bold text-glow">Profile</h1>

            <GlassCard className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="font-medium text-lg">{email}</p>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                <Button onClick={logout} variant="ghost" className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                    Sign Out
                </Button>
            </GlassCard>
        </div>
    );
}
