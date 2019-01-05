import React, { Component } from "react";

export default class Row extends Component<{ className?: string }> {
    public render() {
        return (
            <div className={"row " + this.props.className}>
                {this.props.children}
            </div>
        )
    }
}