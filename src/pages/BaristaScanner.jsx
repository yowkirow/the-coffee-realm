import { useEffect, useState, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Link } from 'react-router-dom'
import { cn } from "@/lib/utils"

export default function BaristaScanner() {
    const [scanResult, setScanResult] = useState(null)
    const [stampsToAdd, setStampsToAdd] = useState(1)
    const [message, setMessage] = useState("")
    const scannerRef = useRef(null)
    const { addStamps } = useAuth()

    useEffect(() => {
        if (scanResult) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        function onScanSuccess(decodedText) {
            scanner.clear().then(() => {
                setScanResult(decodedText);
            }).catch(console.error);
        }

        function onScanFailure(error) {
            // ignore
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        }
    }, [scanResult]);

    function handleAddStamps() {
        addStamps(stampsToAdd);
        setMessage(`Successfully added ${stampsToAdd} stamp(s)!`);
        setTimeout(() => {
            setScanResult(null);
            setMessage("");
            setStampsToAdd(1);
        }, 2000);
    }

    function handleReset() {
        setScanResult(null);
        setMessage("");
    }

    return (
        <div className="min-h-screen bg-mint-50 p-6 flex flex-col items-center font-sans">
            <div className="w-full max-w-md space-y-6">
                <Link to="/" className="text-primary-600 flex items-center gap-2 mb-4 hover:underline font-medium text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                {!scanResult ? (
                    <Card className="bg-white border-none shadow-md overflow-hidden rounded-3xl">
                        <CardHeader className="bg-primary-600 text-white p-6">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Coffee className="h-6 w-6" />
                                Scan Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div id="reader" className="w-full rounded-xl overflow-hidden border-4 border-gray-100"></div>
                            <p className="text-center text-sm text-gray-500 mt-4">Point camera at customer's QR code</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-white border-none shadow-xl overflow-hidden rounded-3xl">
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-primary-600">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Customer Found!</h2>
                                <p className="text-sm text-gray-400 mt-1 font-mono">{scanResult}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Add Stamps</label>
                                <div className="flex gap-3 justify-center">
                                    {[1, 2, 3].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setStampsToAdd(num)}
                                            className={cn(
                                                "h-12 w-12 rounded-xl text-lg font-bold transition-all border-2",
                                                stampsToAdd === num
                                                    ? "border-primary-600 bg-primary-50 text-primary-700 shadow-inner"
                                                    : "border-gray-100 text-gray-400 hover:border-primary-200"
                                            )}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {message && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                                    {message}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button variant="ghost" onClick={handleReset} className="text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                                    Cancel
                                </Button>
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-200" onClick={handleAddStamps}>
                                    Confirm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
