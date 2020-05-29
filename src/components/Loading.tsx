import React, { Component } from 'react'
import LoadingDots from './LoadingDots'

export default class Loading extends Component<{ fullscreen?: boolean }> {
    public render() {
        return (
            <div className={"loading-animation " + ((this.props.fullscreen) ? 'fullscreen' : '')}>
                <LoadingDots />
                {this.props.children}
            </div>
        )
    }
}