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
}

export default class Input extends Component<InputProps> {
    public render() {
        let onChange = (name: string, value: any) => { }
        if (this.props.onChange) onChange = this.props.onChange
        let value: Date | null

        switch (this.props.type) {
            case 'checkbox':
                if (!!this.props.editable) onChange = () => { return false }
                return <Checkbox checked={this.props.value} onChange={(event) => onChange(this.props.name, event.target.checked)} label='' required={!!this.props.required} aria-describedby={this.props.name} />
            case 'textarea':
                return <textarea name={this.props.name} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '')} readOnly={!this.props.editable} required={!!this.props.required} aria-describedby={this.props.name} />
            case 'date':
                value = this.props.value
                if (typeof this.props.value === 'string') value = new Date(this.props.value)
                if (this.props.value === '') value = null

                if (this.props.editable) {
                    return <ReactDatePicker name={this.props.name} onChange={(date, event) => onChange(this.props.name, date)} selected={value} className={'form-entry form-control'} allowSameDay={true} required={!!this.props.required} dateFormat="dd.MM.yyyy" disabledKeyboardNavigation={true} aria-describedby={this.props.name} />
                } else {
                    if (value instanceof Date) return value.toLocaleDateString()
                    return ''
                }
            case 'datetime':
                value = this.props.value
                if (typeof this.props.value === 'string') value = new Date(this.props.value)
                if (this.props.value === '') value = null

                if (this.props.editable) {
                    return <ReactDatePicker name={this.props.name} onChange={(date, event) => onChange(this.props.name, date)} selected={value} showTimeSelect={true} className={'form-entry form-control'} required={!!this.props.required} timeFormat="HH:mm" dateFormat="dd.MM.yyyy HH:mm" disabledKeyboardNavigation={true} shouldCloseOnSelect={false} aria-describedby={this.props.name} />
                } else {
                    if (value instanceof Date) return value.toLocaleString()
                    return ''
                }
            case 'select':
                if (this.props.options) {
                    return (<select name={this.props.name} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '')} required={!!this.props.required} aria-describedby={this.props.name}>
                        {this.props.options.map(option => <option value={option}>{option}</option>)}
                    </select>)
                }
            default:
                return <input name={this.props.name} type={this.props.type || 'text'} value={this.props.value} onChange={(event) => onChange(this.props.name, event.target.value)} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '')} readOnly={!this.props.editable} required={!!this.props.required} aria-describedby={this.props.name} />

        }
    }
}