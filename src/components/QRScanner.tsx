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
                        codeReader.stopContinuousDecode();
                        videoRef.current?.pause()
                        close()
                    }
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

    function setQRResult(result: Result, valid: boolean) {
        if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            const color = valid ? "green" : "red"

            if (ctx) {
                const points: ResultPoint[] = result.getResultPoints() as any
                const rotation = Math.atan2(
                    points[1].y - points[0].y,
                    points[1].x - points[0].x
                )
                const heightRatio =
                    canvasRef.current.height / videoRef.current.videoHeight
                const widthRation =
                    canvasRef.current.width / videoRef.current.videoWidth
                const pointsSorted = points.sort(
                    (a, b) => (a.count || 0) - (b.count || 0)
                )
                const pointCount =
                    (pointsSorted.length === 4
                        ? pointsSorted[1].count
                        : pointsSorted[0].count) || 1
                ctx.fillStyle = color
                ctx.strokeStyle = color

                points.forEach((point, index) => {
                    if (!point.count) {
                        drawPoint(
                            point.x * widthRation,
                            point.y * heightRatio,
                            point.estimatedModuleSize,
                            1,
                            rotation,
                            ctx
                        )
                        return
                    }
                    drawPoint(
                        point.x * widthRation,
                        point.y * heightRatio,
                        point.estimatedModuleSize,
                        pointCount,
                        rotation,
                        ctx
                    )
                })
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

    function drawPoint(
        x: number,
        y: number,
        pointSize: number,
        count: number,
        rotation: number,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)
        const rectSize = pointSize * count
        ctx.fillRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize)
        ctx.lineWidth = pointSize
        const strokeSize = pointSize * (4 + count)
        ctx.strokeRect(-strokeSize / 2, -strokeSize / 2, strokeSize, strokeSize)
        ctx.restore()
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
            />
            <canvas className="qrscanner-canvas" ref={canvasRef}></canvas>
            <video id="qr-video" className="qrscanner-video" ref={videoRef}></video>
        </div>
    )
}
