import { Component } from "react"
import React from "react"

interface CheckboxProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    checked?: boolean
    label?: string
    id?: string
    required?: boolean
    className?: string
    editable?: boolean
}

export default class Checkbox extends Component<CheckboxProps, { checked: boolean }> {
    constructor(props: CheckboxProps) {
        super(props)

        this.onCheck = this.onCheck.bind(this)

        this.state = { checked: this.props.checked || false }
    }

    private onCheck(event: React.ChangeEvent<HTMLInputElement>): void {
        if (this.props.editable) {
            this.setState({
                checked: !this.state.checked
            })

            this.props.onChange(event)
        }
    }

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
            <span className={this.props.className}>
                <input id={this.props.id || ''} type="checkbox" checked={this.state.checked || false} onChange={this.onCheck} required={!!this.props.required} />
                <label htmlFor="food">{this.props.label || ''}</label>
            </span>
        )
    }
}