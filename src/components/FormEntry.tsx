import React, { Component } from "react"
import Row from "./Row"
import Column from "./Column"
import Input from "./Input"

interface FormEntryProps {
    id: string
    title: string
    editable?: boolean
    value?: any
    type?: string
    onChange?: (name: string, value: any) => void
}

export default class FormEntry extends Component<FormEntryProps> {
    public renderChildren() {
        if (typeof this.props.value !== 'undefined') {
            return <Input name={this.props.id} editable={this.props.editable} onChange={this.props.onChange} type={this.props.type} value={this.props.value} />
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