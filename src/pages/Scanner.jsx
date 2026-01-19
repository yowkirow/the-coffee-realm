import React, { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const Scanner = () => {
    const [scanResult, setScanResult] = useState(null)
    const [status, setStatus] = useState('idle') // idle, starting, scanning, processing, success, error
    const navigate = useNavigate()
    const scannerRef = useRef(null)
    const isProcessing = useRef(false)

    const onScanSuccess = async (decodedText, decodedResult) => {
        if (isProcessing.current) return

        console.log("QR Code Detected:", decodedText)
        isProcessing.current = true
        setStatus('processing')

        // Pause scanning
        if (scannerRef.current) {
            try {
                await scannerRef.current.pause(true)
            } catch (e) {
                console.warn("Failed to pause scanner", e)
            }
        }

        try {
            const userId = decodedText

            const { data, error } = await supabase.rpc('increment_points', {
                target_user_id: userId,
                points_to_add: 50
            })

            if (error) throw error

            setScanResult(`Added stamp to user!`)
            setStatus('success')

            setTimeout(async () => {
                setStatus('scanning')
                setScanResult(null)
                isProcessing.current = false
                if (scannerRef.current) {
                    try {
                        await scannerRef.current.resume()
                    } catch (e) {
                        console.warn("Resume failed", e)
                    }
                }
            }, 3000)

        } catch (error) {
            console.error("Scan Logic Error:", error)
            setScanResult("Failed to add points.")
            setStatus('error')
            setTimeout(async () => {
                setStatus('scanning')
                isProcessing.current = false
                if (scannerRef.current) {
                    try {
                        await scannerRef.current.resume()
                    } catch (e) { }
                }
            }, 3000)
        }
    }

    useEffect(() => {
        // Safe check for element
        const elementId = "reader"
        if (!document.getElementById(elementId)) {
            console.warn("Scanner element 'reader' not found")
            return
        }

        const startScanner = async () => {
            setStatus('starting')
            try {
                // Use Core Class instead of Scanner Widget
                const html5QrCode = new Html5Qrcode(elementId)
                scannerRef.current = html5QrCode

                const config = {
                    fps: 10,
                    aspectRatio: 1.0,
                    qrbox: { width: 250, height: 250 } // Restore box for focus
                }

                // Start immediately
                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    onScanSuccess,
                    (errorMessage) => {
                        // Ignore noise
                    }
                )

                setStatus('scanning')
            } catch (err) {
                console.error("Error starting scanner:", err)
                setScanResult('Could not start camera. Check permissions.')
                setStatus('error')
            }
        }

        startScanner()

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err))
            }
        }
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 max-w-md animate-fade-in text-center">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-bold">Barista Scanner</h1>
            </div>

            <Card className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-black/5 overflow-hidden relative">
                {/* Scanner Viewport */}
                <div id="reader" className={`w-full h-full rounded-lg overflow-hidden ${status === 'success' || status === 'error' ? 'opacity-0 absolute' : 'opacity-100'}`} />

                {/* Overlays */}
                {status === 'starting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
                        <p className="text-sm font-medium text-emerald-800">Starting Camera...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 animate-fade-in">
                        <CheckCircle className="w-20 h-20 mb-4 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-emerald-800">Success!</h2>
                        <p className="text-emerald-600">{scanResult}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 animate-fade-in">
                        <XCircle className="w-20 h-20 mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold text-red-800">Error</h2>
                        <p className="text-red-600">{scanResult}</p>
                    </div>
                )}
            </Card>

            <p className="mt-6 text-sm text-text-muted">
                Point camera at customer's unique QR code to add stamps.
            </p>
        </div>
    )
}

export default Scanner
