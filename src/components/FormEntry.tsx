import React, { Component } from "react";
import Row from "./Row";
import Column from "./Column";
import Checkbox from "./Checkbox";

export default class FormEntry extends Component<{ id: string, title: string, editable?: boolean, value?: any, type?: string, onChange?: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void }> {
    public renderChildren() {
        if (typeof this.props.value !== 'undefined') {
            if (this.props.type === 'checkbox') {
                let onChange = this.props.onChange || (() => { })

                // little hack to disable the checkbox
                if (!this.props.editable) onChange = () => { return false }

                return <Checkbox id={this.props.id} checked={this.props.value} onChange={onChange} label='' />
            } else if (this.props.type === 'textarea') {
                return <textarea id={this.props.id} name={this.props.id} value={this.props.value} onChange={this.props.onChange} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '')} readOnly={!this.props.editable} />
            }

            let value = this.props.value
            if (this.props.type === 'date') {
                let date = this.props.value
                if (typeof this.props.value === 'string') date = new Date(this.props.value)

                value = `${date.getUTCFullYear()}-${('0' + date.getUTCMonth()).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)}`
            }

            return <input id={this.props.id} name={this.props.id} type={(this.props.type) ? this.props.type : 'text'} value={value} onChange={this.props.onChange} className={'form-entry form-control' + ((!this.props.editable) ? '-plaintext' : '')} readOnly={!this.props.editable} />
        }

        return this.props.children
    }

    public render() {
        return (
            <Row>
                <Column className="col-6">
                    {this.props.title}
                </Column>
                <Column className="col-6">
                    {this.renderChildren()}
                </Column>
            </Row>
        )
    }
}