import React, { Component } from "react";
import Row from "./Row";
import Column from "./Column";

export default class FormEntry extends Component<{ id: string, title: string, readOnly?: boolean }> {
    public render() {
        return (
            <Row>
                <Column className="col-6">
                    {this.props.title}
                </Column>
                <Column className="col-6">
                    {this.props.children}
                </Column>
            </Row>
        )
    }
}