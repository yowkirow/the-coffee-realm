import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        )

        scanner.render(onScanSuccess, onScanFailure)

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error)
            })
        }
    }, [])

    const onScanSuccess = async (decodedText, decodedResult) => {
        if (status === 'processing' || status === 'success') return

        setStatus('processing')
        try {
            // decodedText should be the User UUID
            const userId = decodedText

            const { data, error } = await supabase.rpc('increment_points', {
                target_user_id: userId,
                points_to_add: 50 // Default 50 points (1 stamp)
            })

            if (error) throw error

            setScanResult(`Added stamp to user!`)
            setStatus('success')

            // Refocus for next scan after 3 seconds
            setTimeout(() => {
                setStatus('idle')
                setScanResult(null)
            }, 3000)

        } catch (error) {
            console.error(error)
            setScanResult("Failed to add points. Invalid QR?")
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    const onScanFailure = (error) => {
        // Handle scan failure, usually better to ignore frame errors
    }

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
