import React, { Component } from 'react'

export default class Loading extends Component<{ fullscreen?: boolean }> {
    public render() {
        return (
            <div className={"loading-animation " + ((this.props.fullscreen) ? 'fullscreen' : '')}>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>
            </div>
        )
    }
}