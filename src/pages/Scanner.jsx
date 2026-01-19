import React, { useEffect, useState, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

const Scanner = () => {
    const [scanResult, setScanResult] = useState(null)
    const [status, setStatus] = useState('idle') // idle, scanning, processing, success, error
    const navigate = useNavigate()
    const scannerRef = useRef(null)
    const isProcessing = useRef(false) // Use ref to avoid stale closure in callback

    const onScanSuccess = async (decodedText, decodedResult) => {
        if (isProcessing.current) return

        console.log("QR Code Detected:", decodedText) // Debug log
        isProcessing.current = true
        setStatus('processing')

        try {
            const userId = decodedText

            const { data, error } = await supabase.rpc('increment_points', {
                target_user_id: userId,
                points_to_add: 50
            })

            if (error) throw error

            setScanResult(`Added stamp to user!`)
            setStatus('success')

            setTimeout(() => {
                setStatus('idle')
                setScanResult(null)
                isProcessing.current = false // Reset lock
            }, 3000)

        } catch (error) {
            console.error("Scan Logic Error:", error)
            setScanResult("Failed to add points.")
            setStatus('error')
            setTimeout(() => {
                setStatus('idle')
                isProcessing.current = false
            }, 3000)
        }
    }

    useEffect(() => {
        // Safe check for element
        if (!document.getElementById('reader')) {
            console.warn("Scanner element 'reader' not found")
            return
        }

        const config = {
            fps: 10,
            // qrbox: { width: 250, height: 250 }, // Removed to allow full-screen scanning
            aspectRatio: 1,
            videoConstraints: {
                facingMode: { exact: "environment" }
            }
        }

        const failureCallback = (errorMessage) => {
            // Filter out common noise errors to keep UI/Console clean
            const noise = [
                "No MultiFormat Readers",
                "NotFoundException",
                "No barcode or QR code detected"
            ]
            if (!noise.some(n => errorMessage?.includes(n))) {
                console.warn(`Scan error: ${errorMessage}`)
            }
        }

        const initScanner = async () => {
            try {
                // Initialize scanner instance
                scannerRef.current = new Html5QrcodeScanner("reader", config, false)

                // Start rendering
                scannerRef.current.render(onScanSuccess, failureCallback)
            } catch (e) {
                console.warn("Back camera constraint failed, retrying without exact...", e)

                // Fallback: Remove strict facial requirement
                try {
                    // Cleanup if partially initialized
                    if (scannerRef.current) {
                        await scannerRef.current.clear().catch(() => { })
                    }

                    // Modify config for fallback
                    delete config.videoConstraints.facingMode.exact
                    config.videoConstraints.facingMode = "environment"

                    scannerRef.current = new Html5QrcodeScanner("reader", config, false)
                    scannerRef.current.render(onScanSuccess, failureCallback)
                } catch (retryError) {
                    console.error("Scanner Retry Failed:", retryError)
                    setScanResult('Camera failed to start.')
                    setStatus('error')
                }
            }
        }

        initScanner()

        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear().catch(e => console.warn("Clear failed", e))
                } catch (e) {
                    console.error("Failed to clear scanner", e)
                }
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

            <Card className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-black/5">
                {status === 'success' ? (
                    <div className="flex flex-col items-center text-primary animate-fade-in">
                        <CheckCircle className="w-20 h-20 mb-4" />
                        <h2 className="text-2xl font-bold">Success!</h2>
                        <p>{scanResult}</p>
                    </div>
                ) : status === 'error' ? (
                    <div className="flex flex-col items-center text-red-500 animate-fade-in">
                        <XCircle className="w-20 h-20 mb-4" />
                        <h2 className="text-2xl font-bold">Error</h2>
                        <p>{scanResult}</p>
                    </div>
                ) : (
                    <div id="reader" className="w-full"></div>
                )}
            </Card>

            <p className="mt-6 text-sm text-text-muted">
                Point camera at customer's unique QR code to add stamps.
            </p>
        </div>
    )
}

export default Scanner
