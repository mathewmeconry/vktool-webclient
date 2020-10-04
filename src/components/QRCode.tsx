import React, { useEffect, useRef } from 'react'
import { BrowserQRCodeSvgWriter } from "@zxing/library"
import Canvg from 'canvg'

interface QRCodeProps {
    content?: QRCodePayload,
    width: number,
    height: number
}

export enum QRCodeType {
    MEMBER = 'member',
    SUPPLIER = 'supplier',
    WAREHOUSE = 'warehouse',
    PRODUCT = 'product'
}

export interface QRCodePayload {
    type: QRCodeType
    id: number
    [key: string]: any
}

export default function QRCode(props: QRCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const codeWriter = new BrowserQRCodeSvgWriter()
    useEffect(() => {
        if (props.content) {
            const clean = cleanContent(props.content)
            const svg = codeWriter.write(JSON.stringify(clean), props.width, props.height)
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttributeNS(null, "font-size", "9")
            text.setAttributeNS(null, 'x', (props.width / 2).toString())
            text.setAttributeNS(null, 'y', (props.height - 10).toString())
            text.setAttributeNS(null, 'text-anchor', 'middle')
            text.textContent = JSON.stringify(clean)
            svg.append(text)
            writeCode(svg)
            return
        }
        writeCode(document.createElement('svg') as any as SVGSVGElement)
    }, [props])

    function cleanContent(content: QRCodePayload): QRCodePayload {
        const clean: QRCodePayload = { id: content.id, type: content.type }
        for (const i in content) {
            if (content[i] !== "" && content[i] !== undefined && content[i] !== null) {
                clean[i] = content[i]
            }
        }
        return clean
    }

    async function writeCode(svg: SVGSVGElement) {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
                const v = await Canvg.from(ctx, svg.outerHTML)

                // Start SVG rendering with animations and mouse handling.
                v.start({ ignoreAnimation: true })
            }
        }
    }

    return <canvas id="qr-code" ref={canvasRef} ></canvas>
}