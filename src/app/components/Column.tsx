import React, { Component } from "react";

export default class Column extends Component<{ className?: string }> {
    private className = 'col'

    constructor(props: { className?: string }) {
        super(props)

        if (this.props.className && this.props.className.indexOf('col') > -1) {
            this.className = this.props.className
        } else if (this.props.className) {
            this.className += ' ' + this.props.className
        }
    }

    public render() {
        return (
            <div className={this.className}>
                {this.props.children}
            </div>
        )
    }
}