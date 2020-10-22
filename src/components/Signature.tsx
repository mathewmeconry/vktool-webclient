import React, { RefObject, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignaturePad from 'react-signature-canvas'

export interface SignatureProps {
    fullscreen?: boolean
    onClose?: () => void
    onEnd?: (data: string) => void
    className?: string
    data?: string
}

export default function Signature(props: SignatureProps) {
    const divRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<SignaturePad>(null)
    const [canvasProps, setCanvasProps] = useState<React.CanvasHTMLAttributes<HTMLCanvasElement>>({})

    async function lockScreen(ref: RefObject<HTMLElement>) {
        if (ref.current?.requestFullscreen && props.fullscreen) {
            try {
                await ref.current?.requestFullscreen()
                await screen.orientation.lock('landscape')
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

    useEffect(() => {
        updateCanvas()
        window.addEventListener('resize', updateCanvas)
        if (props.data) {
            canvasRef.current?.fromDataURL(props.data)
        }
    }, [false])

    useEffect(() => {
        if (divRef) {
            lockScreen(divRef)
        }
    }, [divRef])

    function updateCanvas() {
        if (props.fullscreen) {
            setCanvasProps({
                width: window.outerWidth - 40,
                height: window.outerHeight - 100
            })
            return
        }
        setCanvasProps({
            width: divRef.current?.clientWidth,
            height: divRef.current?.clientHeight,
        })
    }

    function onEnd() {
        if (props.onEnd) {
            props.onEnd(canvasRef.current?.toDataURL() || '')
        }
    }

    return (
        <div className={`border signature-div ${props.fullscreen ? 'fullscreen' : ''} ${props.className}`} ref={divRef}>
            {props.fullscreen && <h2>Unterschrift</h2>}
            {props.fullscreen && <FontAwesomeIcon icon="times-circle" className="close" onClick={async () => {
                await unlockScreen()
                if (props.onClose) {
                    props.onClose()
                }
                screen.orientation.unlock()
            }} />}
            <SignaturePad canvasProps={{ ...canvasProps, className: 'sigCanvas' }} ref={canvasRef} onEnd={onEnd}></SignaturePad>
        </div>
    )
}