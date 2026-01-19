import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

const FancyQRCode = ({ value, size = 200 }) => {
    const ref = useRef(null)
    const qrCode = useRef(null)

    useEffect(() => {
        // Initialize logic
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            type: 'svg', // Keeping SVG for crispness, but handled better
            data: value,
            // image: '/vite.svg', // Temporarily removing image to isolate the issue
            dotsOptions: {
                color: '#047857',
                type: 'rounded'
            },
            cornersSquareOptions: {
                color: '#064e3b',
                type: 'extra-rounded'
            },
            cornersDotOptions: {
                color: '#064e3b',
                type: 'dot'
            },
            backgroundOptions: {
                color: 'transparent', // Transparent to blend with container
            }
        })

        // Append to DOM
        if (ref.current) {
            ref.current.innerHTML = '' // Clear previous renders (Strict Mode fix)
            qrCode.current.append(ref.current)
        }
    }, [size]) // Re-run if size changes only

    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                data: value
            })
        }
    }, [value])

    return (
        <div ref={ref} className="flex justify-center items-center w-full h-full" />
    )
}

export default FancyQRCode
