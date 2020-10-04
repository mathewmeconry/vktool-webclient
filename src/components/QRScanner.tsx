import React, { RefObject, useEffect, useRef } from "react"
import { BrowserQRCodeReader, Result } from "@zxing/library"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ResultPoint {
    x: number
    y: number
    estimatedModuleSize: number
    count?: number
}

export interface QRScannerProps {
    onClose?: (results: Result[]) => void
    className?: string
    validate: (result: Result, previousResults: Result[]) => boolean
    alreadyScanned?: (result: Result, previousResults: Result[]) => boolean
    onData?: (result: Result) => void
    continous?: boolean
}

export default function QRScanner(props: QRScannerProps) {
    const codeReader = new BrowserQRCodeReader(100)
    const divRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const results: Result[] = []

    codeReader.decodeFromVideoDevice(null, "qr-video", (result) => {
        resetCanvas()
        if (result) {
            try {
                if (props.validate(result, results)) {
                    if (props.onData) {
                        props.onData(result)
                    }
                    results.push(result)
                    setQRResult(result, true)
                    if (!props.continous) {
                        console.log('Done')
                        codeReader.stopContinuousDecode()
                        videoRef.current?.pause()
                        close()
                    }
                    return
                }
                if (props.alreadyScanned && props.alreadyScanned(result, results)) {
                    setQRResult(result, true)
                    return
                }
            } catch (e) {
                console.error(`QRCode validation error ${result.getText()}`)
            }
            setQRResult(result, false)
        }
    })

    function updateCanvasSize() {
        if (canvasRef.current && divRef.current) {
            canvasRef.current.width = divRef.current.clientWidth
            canvasRef.current.height = divRef.current.clientHeight
        }
    }

    function setQRResult(result: Result, success: boolean) {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                const points: ResultPoint[] = result.getResultPoints() as any
                const heightRatio =
                    canvasRef.current.height / videoRef.current.videoHeight
                const widthRatio =
                    canvasRef.current.width / videoRef.current.videoWidth
                const lowestX = points.sort((a, b) => a.x - b.x)[0].x
                const lowestY = points.sort((a, b) => a.y - b.y)[0].y

                ctx.save()
                ctx.translate(lowestX * widthRatio, lowestY * heightRatio)
                ctx.scale(0.15, 0.15)
                if (success) {
                    ctx.fillStyle = 'green'
                    const checkBox = new Path2D('M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z')
                    ctx.fill(checkBox, 'evenodd')
                } else {
                    ctx.fillStyle = 'red'
                    const cross = new Path2D('M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z')
                    ctx.fill(cross, 'evenodd')
                }
                ctx.restore()
            }
        }
    }

    function resetCanvas() {
        if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            }
        }
    }

    async function lockScreen(ref: RefObject<HTMLElement>) {
        if (ref.current?.requestFullscreen) {
            try {
                await ref.current?.requestFullscreen()
                await screen.orientation.lock("landscape")
            } catch (e) {
                // ignore error here
            }
        }
    }

    async function unlockScreen() {
        try {
            await document.exitFullscreen()
            await screen.orientation.unlock()
        } catch (e) {
            // ignore error here
        }
    }

    async function close() {
        if (props.onClose) {
            props.onClose(results)
        }
    }

    useEffect(() => {
        updateCanvasSize()
        window.addEventListener("resize", updateCanvasSize)
    }, [false])

    useEffect(() => {
        if (divRef) {
            lockScreen(divRef)
        }
    }, [divRef])

    useEffect(() => {
        codeReader.reset()
        unlockScreen()
    }, [])

    return (
        <div className={`qrscanner ${props.className}`} ref={divRef}>
            <FontAwesomeIcon
                icon="times-circle"
                className="close"
                onClick={close}
                size="5x"
            />
            <canvas className="qrscanner-canvas" ref={canvasRef}></canvas>
            <video id="qr-video" className="qrscanner-video" ref={videoRef}></video>
        </div>
    )
}
