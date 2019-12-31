import { Component } from "react";
import React from "react";

export default class Checkbox extends Component<{ onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean, label?: string, id?: string }, { checked: boolean }> {
    public componentDidUpdate(prevProps: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean, label?: string, id?: string }) {
        if (this.props.hasOwnProperty('checked')) {
            if (this.props.checked !== prevProps.checked) {
                this.setState({
                    checked: this.props.checked || false
                })
            }
        }
    }

    public render() {
        return (
            <span>
                <input id={this.props.id || ''} type="checkbox" checked={this.props.checked || false} onChange={this.props.onChange} />
                <label htmlFor="food">{this.props.label || ''}</label>
            </span>
        )
    }
}