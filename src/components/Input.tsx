import React, { Component } from "react"
import Checkbox from "./Checkbox"
import ReactDatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

export interface InputProps {
    name: string
    value: any,
    options?: string[],
    type?: string,
    editable?: boolean
    onChange?: (name: string, value: any) => void,
    required?: boolean
    className?: string,
    prepend?: string,
    append?: string
}

export default class Input extends Component<InputProps> {
    public render() {
        let onChange = (name: string, value: any) => { }
        if (this.props.onChange) onChange = this.props.onChange
        let value: Date | null

        let input
        switch (this.props.type) {
            case 'checkbox':
                input = <Checkbox checked={this.props.value} editable={this.props.editable} onChange={(event) => onChange(this.props.name, event.target.checked)} label='' required={!!this.props.required} aria-describedby={this.props.name} className={this.props.className} />
                break
            case 'textarea':
                input = <textarea name={this.props.name} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '') + ` ${this.props.className}`} readOnly={!this.props.editable} required={!!this.props.required} aria-describedby={this.props.name} />
                break
            case 'date':
                value = this.props.value
                if (typeof this.props.value === 'string') value = new Date(this.props.value)
                if (this.props.value === '') value = null

                if (this.props.editable) {
                    input = <ReactDatePicker name={this.props.name} onChange={(date, event) => onChange(this.props.name, date)} selected={value} className={'form-entry form-control' + ` ${this.props.className}`} allowSameDay={true} required={!!this.props.required} dateFormat="dd.MM.yyyy" disabledKeyboardNavigation={true} aria-describedby={this.props.name} />
                } else {
                    if (value instanceof Date) {
                        input = value.toLocaleString()
                    } else {
                        input = ''
                    }
                }
                break
            case 'datetime':
                value = this.props.value
                if (typeof this.props.value === 'string') value = new Date(this.props.value)
                if (this.props.value === '') value = null

                if (this.props.editable) {
                    input = <ReactDatePicker name={this.props.name} onChange={(date, event) => onChange(this.props.name, date)} selected={value} showTimeSelect={true} className={'form-entry form-control' + ` ${this.props.className}`} required={!!this.props.required} timeFormat="HH:mm" dateFormat="dd.MM.yyyy HH:mm" disabledKeyboardNavigation={true} shouldCloseOnSelect={false} aria-describedby={this.props.name} />
                } else {
                    if (value instanceof Date) {
                        input = value.toLocaleString()
                    } else {
                        input = ''
                    }
                }
                break
            case 'select':
                if (this.props.options) {
                    input = (<select name={this.props.name} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '') + ` ${this.props.className}`} required={!!this.props.required} aria-describedby={this.props.name}>
                        {this.props.options.map(option => <option value={option}>{option}</option>)}
                    </select>)
                }
                break
            default:
                input = <input name={this.props.name} type={this.props.type || 'text'} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '') + ` ${this.props.className}`} readOnly={!this.props.editable} required={!!this.props.required} aria-describedby={this.props.name} />
                break
        }

        let prepend = null
        if (this.props.prepend) {
            prepend = (
                <div className="input-group-prepend">
                    <span className="input-group-text">{this.props.prepend}</span>
                </div>
            )
        }

        let append = null
        if (this.props.append) {
            append = (
                <div className="input-group-append">
                    <span className="input-group-text">{this.props.append}</span>
                </div>
            )
        }

        return (
            <div className="input-group">
                {prepend}
                {input}
                {append}
            </div>
        )
    }
}