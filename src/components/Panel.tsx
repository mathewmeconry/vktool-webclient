import React, { Component } from "react";

export default class Panel extends Component<{ title?: string | React.ReactNode, actions?: Array<any> }> {
    public render() {
        let header;
        let actions = this.props.actions || []

        if (this.props.title) {
            header = <div className="panel-header"><span className="panel-title">{this.props.title}</span>
                <div className="panel-actions">
                    {actions.map(el => el)}
                </div>
            </div>
        } else if(this.props.actions && this.props.actions.length > 0) {
            header = <div className="panel-header">
                <div className="panel-actions">
                    {actions.map(el => el)}
                </div>
            </div>
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