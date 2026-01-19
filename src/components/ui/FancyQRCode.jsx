import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

const FancyQRCode = ({ value, size = 200 }) => {
    const ref = useRef(null)
    const qrCode = useRef(null)

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            type: 'svg',
            data: value,
            image: '/react.svg', // using React logo as placeholder for coffee cup
            dotsOptions: {
                color: '#047857', // emerald-700
                type: 'rounded'
            },
            cornersSquareOptions: {
                color: '#064e3b', // emerald-900
                type: 'extra-rounded'
            },
            cornersDotOptions: {
                color: '#064e3b',
                type: 'dot'
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 5
            }
        })

        if (ref.current) {
            qrCode.current.append(ref.current)
        }
    }, [])

    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                data: value
            })
        }
    }, [value])

    return (
        <div ref={ref} className="flex justify-center items-center" />
    )
}

export default FancyQRCode
