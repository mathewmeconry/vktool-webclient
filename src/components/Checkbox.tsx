import { Component } from "react"
import React from "react"

interface CheckboxProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    checked?: boolean
    label?: string
    id?: string
    required?: boolean
}

export default class Checkbox extends Component<CheckboxProps, { checked: boolean }> {
    public componentDidUpdate(prevProps: CheckboxProps) {
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
                <input id={this.props.id || ''} type="checkbox" checked={this.props.checked || false} onChange={this.props.onChange} required={!!this.props.required}/>
                <label htmlFor="food">{this.props.label || ''}</label>
            </span>
        )
    }
}