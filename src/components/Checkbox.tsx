import { Component } from "react";
import React from "react";

export default class Checkbox extends Component<{ onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean, label?: string, id?: string }, { checked: boolean }> {
    constructor(props: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean, label?: string, id?: string }) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: this.props.checked || false
        }
    }

    public onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            checked: !this.state.checked
        })
        this.props.onChange(event)
    }

    public componentWillReceiveProps(nextProps: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked?: boolean, label?: string, id?: string }) {
        if (nextProps.hasOwnProperty('checked')) {
            if (nextProps.checked !== this.state.checked) {
                this.setState({
                    checked: nextProps.checked || false
                })
            }
        }
    }

    public render() {
        return (
            <span>
                <input id={this.props.id || ''} type="checkbox" checked={this.state.checked} onChange={this.onChange} />
                <label htmlFor="food">{this.props.label || ''}</label>
            </span>
        )
    }
}