import React, { Component } from "react";

export default class Panel extends Component<{ title?: string | React.ReactNode }> {
    public render() {
        let header;
        if (this.props.title) {
            header = <div className="panel-header">{this.props.title}</div>
        }

        return (
            <div className="panel">
                {header}
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
}