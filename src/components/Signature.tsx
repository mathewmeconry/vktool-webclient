import React, { RefObject, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignaturePad from 'react-signature-canvas'
import Button from './Button'
import { ButtonGroup } from 'react-bootstrap'

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
                width: window.outerWidth - 45,
                height: window.outerHeight - 150
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
            props.onEnd(canvasRef.current?.getTrimmedCanvas().toDataURL() || '')
        }
    }

    async function onClose() {
        if (props.onEnd) {
            props.onEnd('')
        }
        await onSave()
    }

    async function onSave() {
        await unlockScreen()
        if (props.onClose) {
            props.onClose()
        }
        screen.orientation.unlock()
    }

    async function onReset() {
        if (props.onEnd) {
            props.onEnd('')
        }
        if (canvasRef && canvasRef.current) {
            canvasRef.current.clear()
        }
    }

    return (
        <div className={`border signature-div ${props.fullscreen ? 'fullscreen' : ''} ${props.className}`} ref={divRef}>
            {props.fullscreen && <h2>Unterschrift</h2>}
            {props.fullscreen && <FontAwesomeIcon icon="times-circle" className="close" onClick={onClose} />}
            <div className='sigCanvas'>
                <SignaturePad canvasProps={{ ...canvasProps, className: '' }} ref={canvasRef} onEnd={onEnd}></SignaturePad>
            </div>
            <ButtonGroup>
                <Button block={false} size="lg" variant='info' onClick={onReset}>Löschen</Button>
                <Button block={false} size="lg" onClick={onSave}>Speichern</Button>
            </ButtonGroup>
        </div>
    )
}