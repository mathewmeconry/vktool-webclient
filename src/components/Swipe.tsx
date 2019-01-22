import React, { Component, HTMLAttributes, SyntheticEvent, MouseEvent } from "react";

export interface SwipeProps extends HTMLAttributes<{}> {
    minThreshold?: number,
    maxThreshold?: number,
    minDurationThreshold?: number,
    maxDurationThreshold?: number,
    mouseMove?: boolean,
    swipingRight?: (event: any) => void
    swipingLeft?: (event: any) => void
    swipingUp?: (event: any) => void
    swipingDown?: (event: any) => void
    swipedRight?: (event: any) => void
    swipedLeft?: (event: any) => void
    swipedUp?: (event: any) => void
    swipedDown?: (event: any) => void
}

interface Coordinates {
    x: number,
    y: number
}

interface SwipeState {
    capturing: boolean
    start: Coordinates,
    startTime?: Date,
    end?: Coordinates,
    endTime?: Date,
    current?: Coordinates
}

export default class Swipe extends Component<SwipeProps, SwipeState> {
    private scrolling: boolean = false
    private scrollTimeout: NodeJS.Timeout
    private minThreshold: number
    private maxThreshold: number
    private minDurationThreshold: number
    private maxDurationThreshold: number

    constructor(props: SwipeProps) {
        super(props)

        this.minThreshold = props.minThreshold || 10
        this.maxThreshold = props.maxThreshold || 100
        this.minDurationThreshold = props.minDurationThreshold || 0
        this.maxDurationThreshold = props.maxDurationThreshold || 100

        this.onStart = this.onStart.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onEnd = this.onEnd.bind(this)
        this.onScroll = this.onScroll.bind(this)

        this.state = {
            capturing: false,
            start: { x: -1, y: -1 }
        }
    }

    private onStart(event: any): void {
        if (!this.scrolling && ((event.clientX && this.props.mouseMove) || event.touches)) {
            let x = 0, y = 0
            if (event.clientX) {
                x = event.clientX
                y = event.clientY
            } else if (event.touches) {
                x = event.touches[0].clientX
                y = event.touches[0].clientY
            }

            this.setState({
                capturing: true,
                start: { x: x, y: y },
                startTime: new Date(),
                current: undefined,
                end: undefined
            })
        }
    }

    private onMove(event: any): void {
        if (this.state.capturing) {
            let x = 0, y = 0
            if (event.clientX) {
                x = event.clientX
                y = event.clientY
            } else if (event.touches) {
                x = event.touches[0].clientX
                y = event.touches[0].clientY
            }

            this.setState({
                current: { x: x, y: y }
            })

            this.fireRunningEvents(this.calculateDirection(this.state.start, { x: x, y: y }), event)
        }
    }

    private onEnd(event: any): void {
        if (this.state.capturing && this.state.start && this.state.startTime) {
            let x = 0, y = 0
            if (event.clientX) {
                x = event.clientX
                y = event.clientY
            } else if (event.touches) {
                x = event.changedTouches[0].clientX
                y = event.changedTouches[0].clientY
            }

            this.setState({
                capturing: false,
                end: { x: x, y: y },
                endTime: new Date()
            })

            this.fireFinishEvents(this.calculateDirection(this.state.start, { x: x, y: y }), new Date().getTime() - this.state.startTime.getTime(), event)
        }
    }

    private onScroll(event: SyntheticEvent): void {
        this.scrolling = true
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout)
        }

        this.scrollTimeout = setTimeout(() => { this.scrolling = false }, 150)
    }

    private calculateDirection(start: Coordinates, end: Coordinates): string {
        let x = Math.abs(start.x - end.x)
        let y = Math.abs(start.y - end.y)

        if (x > y) {
            if (x > this.minThreshold && x < this.maxThreshold) {
                if (start.x > end.x) {
                    return 'left'
                }
                return 'right'
            }
        } else {
            if (y > this.minThreshold && y < this.maxThreshold) {
                if (start.y > end.y) {
                    return 'up'
                }
                return 'down'
            }
        }

        return ''
    }

    private fireFinishEvents(direction: string, duration: number, event: any): void {
        if (duration > this.minDurationThreshold && duration < this.maxDurationThreshold) {
            switch (direction) {
                case 'up':
                    if (this.props.swipedUp) this.props.swipedUp(event)
                    break
                case 'right':
                    if (this.props.swipedRight) this.props.swipedRight(event)
                    break
                case 'down':
                    if (this.props.swipedDown) this.props.swipedDown(event)
                    break
                case 'left':
                    if (this.props.swipedLeft) this.props.swipedLeft(event)
                    break
            }
        }
    }

    private fireRunningEvents(direction: string, event: any): void {
        switch (direction) {
            case 'up':
                if (this.props.swipingUp) this.props.swipingUp(event)
                break
            case 'right':
                if (this.props.swipingRight) this.props.swipingRight(event)
                break
            case 'down':
                if (this.props.swipingDown) this.props.swipingDown(event)
                break
            case 'left':
                if (this.props.swipingLeft) this.props.swipingLeft(event)
                break
        }
    }

    public render() {
        return (
            <div
                onScroll={this.onScroll}
                onTouchStart={this.onStart}
                onTouchMove={this.onMove}
                onTouchEnd={this.onEnd}
                onMouseDown={this.onStart}
                onMouseMove={this.onMove}
                onMouseUp={this.onEnd}
                className={this.props.className}
            >
                {this.props.children}
            </div>
        )
    }
}