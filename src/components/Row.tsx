import React, { Component } from "react"

export default class Row extends Component<{ className?: string, style?: React.CSSProperties }> {
    public render() {
        return (
            <div className={"row " + this.props.className} style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
}