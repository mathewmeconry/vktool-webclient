import { Component } from "react";
import React from "react";

export default class Checkbox extends Component<{ id: string, checked: boolean, label: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }> {
    public render() {
        return (
            <span className="switch switch-sm">
                <input id={this.props.id} type="checkbox" className="switch" checked={this.props.checked} onChange={this.props.onChange} />
                <label htmlFor="food">{this.props.label}</label>
            </span>
        )
    }
}