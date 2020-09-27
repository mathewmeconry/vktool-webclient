import React, { useEffect, useRef, useState } from 'react'
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

    useEffect(() => {
        updateCanvas()
        window.addEventListener('resize', updateCanvas)
        if (props.data) {
            canvasRef.current?.fromDataURL(props.data)
        }
    }, [false])

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
            {props.fullscreen && <FontAwesomeIcon icon="times-circle" className="close" onClick={() => {
                if (props.onClose) {
                    props.onClose()
                }
                screen.orientation.unlock()
            }} />}
            <SignaturePad canvasProps={{ ...canvasProps, className: 'sigCanvas' }} ref={canvasRef} onEnd={onEnd}></SignaturePad>
        </div>
    )
}