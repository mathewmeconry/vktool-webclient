import React, { Component } from "react";
import { PageTemplateProps } from "@progress/kendo-react-pdf";

export interface DefaultPDFTemplateProps {
    title: string
}

export default class DefaultPDFTemplate extends Component<DefaultPDFTemplateProps & Partial<PageTemplateProps>> {
    public render() {
        return (
            <div className="template">
                <div className="header-left">
                    <img src="/logo.png" height="60mm"/>
                </div>
                <div className="header-center">
                    <p className="title">{this.props.title}</p>
                </div>
                <div className="footer-left">
                    {new Date().toLocaleDateString()}
                </div>
                <div className="footer-right">
                    Seite {this.props.pageNum} von {this.props.totalPages}
                </div>
            </div>
        )
    }
}