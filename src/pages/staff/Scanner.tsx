import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    CheckCircle2,
    X,
    Flashlight,
    Loader2,
    Coffee,
    Plus,
    Minus
} from "lucide-react";

interface Profile {
    id: string;
    email: string;
    stamps_balance: number;
    full_name?: string;
}

export default function BaristaScanner() {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState<any | null>(null);
    const [customer, setCustomer] = useState<Profile | null>(null);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);

    const [lastTxId, setLastTxId] = useState<string | null>(null);

    const handleScan = async (data: any) => {
        if (data && !scanResult && !processing && !message) {
            try {
                const parsed = JSON.parse(data.text);
                if (parsed.id && parsed.role === 'customer') {
                    setScanResult(parsed);
                    fetchCustomer(parsed.id);
                }
            } catch (e) {
                console.error("Invalid QR", e);
            }
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    const fetchCustomer = async (id: string) => {
        const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
        setCustomer(data);
    };

    const addStamp = async () => {
        if (!customer?.id) return;
        setProcessing(true);

        try {
            const newBalance = (customer.stamps_balance || 0) + 1;
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ stamps_balance: newBalance })
                .eq("id", customer.id);

            if (profileError) throw profileError;

            const { data: txData, error: txError } = await supabase
                .from("transactions")
                .insert([{
                    customer_id: customer.id,
                    type: 'earn',
                    amount: 1
                }])
                .select();

            if (txError) throw txError;
            if (txData && txData[0]) setLastTxId(txData[0].id);

            // Refetch customer for updated balance
            await fetchCustomer(customer.id);
            setMessage({ type: 'success', text: `Scan Successful!` });
            setProcessing(false);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
            setProcessing(false);
        }
    };

    const handleUndo = async () => {
        if (!customer?.id || !lastTxId) return;
        setProcessing(true);

        try {
            // Revert stamp
            const newBalance = Math.max(0, (customer.stamps_balance || 0) - 1);
            await supabase.from("profiles").update({ stamps_balance: newBalance }).eq("id", customer.id);

            // Delete transaction
            await supabase.from("transactions").delete().eq("id", lastTxId);

            setLastTxId(null);
            setMessage(null);
            setScanResult(null);
            setCustomer(null);
            setProcessing(false);
        } catch (err) {
            console.error("Undo failed", err);
            setProcessing(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setCustomer(null);
        setMessage(null);
        setLastTxId(null);
    };

    const renderStampCard = () => {
        const total = 10;
        const current = customer?.stamps_balance || 0;
        const stamps = [];

        for (let i = 0; i < total; i++) {
            const isFilled = i < current;
            const isLast = i === total - 1;

            stamps.push(
                <div
                    key={i}
                    className={`aspect-square rounded-full flex items-center justify-center border-2 transition-all duration-500
                        ${isFilled
                            ? "bg-[#17cf63]/20 border-[#17cf63] scale-100"
                            : "bg-gray-100 border-dashed border-gray-300 scale-95"}`}
                >
                    {isFilled ? (
                        <Coffee className="w-5 h-5 text-[#17cf63]" />
                    ) : isLast ? (
                        <div className="opacity-40">
                            <span className="text-[10px] font-bold">FREE</span>
                        </div>
                    ) : null}
                </div>
            );
        }
        return stamps;
    };

    return (
        <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#f8faf9] font-display">
            {/* Viewfinder Layer */}
            <div className="absolute inset-0 z-0 bg-black">
                {!message && !scanResult && (
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                        constraints={{
                            video: { facingMode: 'environment' }
                        }}
                    />
                )}
            </div>

            {/* Scanning Overlay UI */}
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between w-full px-6 py-6 pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                            <img src="/brand/logo.png" className="size-8 object-contain" alt="Logo" />
                        </div>
                        <span className={`font-bold text-lg tracking-tight ${message ? 'text-[#1b4332]' : 'text-white'}`}>The Coffee Realm</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsFlashlightOn(!isFlashlightOn)}
                            className={`flex items-center justify-center size-12 rounded-full backdrop-blur-md border border-white/20 transition-all pointer-events-auto
                                ${isFlashlightOn ? 'bg-[#17cf63] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            <Flashlight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all pointer-events-auto"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {!message && !scanResult && (
                    <>
                        {/* Centered Scanning Hole and Frame */}
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Instruction Header */}
                            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                                <h4 className="text-[#17cf63] text-sm font-bold leading-normal tracking-[0.2em] uppercase mb-2">[ Scanning Active ]</h4>
                                <h2 className="text-white text-2xl font-bold max-w-md px-4">Ready to capture QR code</h2>
                            </div>

                            {/* The Frame */}
                            <div className="relative size-64 sm:size-80 md:size-96">
                                <div className="absolute top-0 left-0 size-12 border-t-4 border-l-4 border-[#17cf63] rounded-tl-xl"></div>
                                <div className="absolute top-0 right-0 size-12 border-t-4 border-r-4 border-[#17cf63] rounded-tr-xl"></div>
                                <div className="absolute bottom-0 left-0 size-12 border-b-4 border-l-4 border-[#17cf63] rounded-bl-xl"></div>
                                <div className="absolute bottom-0 right-0 size-12 border-b-4 border-r-4 border-[#17cf63] rounded-br-xl"></div>

                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#17cf63] to-transparent opacity-50 shadow-[0_0_15px_rgba(23,207,99,0.8)] animate-scan-line"></div>
                            </div>

                            {/* Instructions and Zoom */}
                            <div className="mt-12 flex flex-col items-center gap-6 pointer-events-auto">
                                <div className="bg-black/40 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10">
                                    <p className="text-white text-sm md:text-base font-medium">Align the customer's QR code within the frame</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10">
                                    <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white">
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <div className="w-[1px] h-6 bg-white/20"></div>
                                    <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Background Dimmer Layer */}
                        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center bg-black/40 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.7)]">
                                <div className="size-64 sm:size-80 md:size-96 bg-transparent"></div>
                            </div>
                        </div>
                    </>
                )}

                {/* Confirm Scan View */}
                {scanResult && !message && (
                    <div className="flex-1 flex items-center justify-center px-4 pointer-events-auto bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                            <div className="p-8 text-center">
                                {customer ? (
                                    <div className="space-y-6">
                                        <div className="size-24 rounded-full mx-auto border-4 border-[#17cf63]/20 overflow-hidden bg-slate-50 shadow-inner">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.email}`} alt="Avatar" className="w-full h-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold text-[#1b4332]">{customer.full_name || customer.email.split('@')[0]}</h2>
                                            <p className="text-slate-400 text-sm">{customer.email}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <button onClick={resetScan} className="py-4 rounded-xl font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                                            <button onClick={addStamp} disabled={processing} className="py-4 rounded-xl font-bold bg-[#17cf63] text-white shadow-lg shadow-[#17cf63]/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                                {processing ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />} Add Stamp
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin w-12 h-12 text-[#17cf63]" />
                                        <p className="text-slate-400">Loading Customer...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Success View */}
                {message?.type === 'success' && (
                    <div className="fixed inset-0 z-[100] bg-[#f8faf9] flex items-center justify-center p-4 pointer-events-auto animate-in fade-in duration-500">
                        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                            <div className="pt-12 pb-8 flex flex-col items-center text-center px-6">
                                <div className="mb-6 flex items-center justify-center size-24 bg-green-50 rounded-full">
                                    <div className="flex items-center justify-center size-16 bg-[#17cf63] rounded-full text-white shadow-lg shadow-[#17cf63]/20">
                                        <CheckCircle2 className="w-10 h-10 font-bold" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-[#1b4332] tracking-tight mb-2">Scan Successful!</h1>
                                <p className="text-gray-500 font-medium">The Coffee Realm Loyalty Program</p>
                            </div>

                            <div className="px-6 pb-8">
                                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-6">
                                    <div className="grid grid-cols-2 gap-4 border-b border-gray-200/60 pb-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Customer</p>
                                            <p className="text-[#1b4332] font-bold text-lg">{customer?.full_name || customer?.email.split('@')[0]}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Action</p>
                                            <p className="text-[#17cf63] font-bold text-lg">+1 Stamp added</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm font-bold text-[#1b4332]">Updated Stamp Card</p>
                                            <span className="text-sm font-bold bg-[#1b4332] text-white px-3 py-1 rounded-full">
                                                {customer?.stamps_balance} / 10
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-3">
                                            {renderStampCard()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-10 space-y-3">
                                <button onClick={resetScan} className="w-full bg-[#1b4332] hover:bg-[#153427] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
                                    Done
                                </button>
                                <button onClick={handleUndo} disabled={processing} className="w-full bg-white hover:bg-gray-50 text-red-600 font-semibold py-4 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 active:scale-95">
                                    <Loader2 className={`w-5 h-5 animate-spin ${processing ? 'block' : 'hidden'}`} />
                                    <span className={processing ? 'hidden' : 'block'}>Undo Scan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Branding */}
                <footer className="w-full py-8 px-6 text-center mt-auto">
                    <div className="flex flex-col items-center gap-1 opacity-60">
                        <p className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase">The Coffee Realm</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
