import React, { Component } from "react"
import Row from "./Row"
import Column from "./Column"
import Input from "./Input"

interface FormEntryProps {
    id: string
    title: string
    unsecure?: boolean
    editable?: boolean
    value?: any
    type?: string
    required?: boolean
    onChange?: (name: string, value: any) => void,
    prepend?: string,
    append?: string
}

export default class FormEntry extends Component<FormEntryProps> {

    private decodeHTML(html: string): string {
        let txt = document.createElement('textarea')
        txt.innerHTML = html.toString()
        return txt.value
    };

    public renderChildren() {
        if (!this.props.editable && typeof this.props.value !== 'undefined' && (this.props.prepend || this.props.append)) {
            return `${this.props.prepend || ''} ${this.props.value || ''} ${this.props.append || ''}`
        }

        if (typeof this.props.value !== 'undefined') {
            return <Input name={this.props.id} editable={this.props.editable} onChange={this.props.onChange} type={this.props.type} value={this.props.value} required={!!this.props.required} prepend={this.props.prepend} append={this.props.append} />
        }

        if (this.props.unsecure) {
            return <div dangerouslySetInnerHTML={{ __html: this.decodeHTML(this.props.children?.toString() || '') }}></div>
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