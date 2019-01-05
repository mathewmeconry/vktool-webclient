import React, { Component } from "react";
import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";

export class _Page extends Component<{ title: string, open: boolean }> {
    public render() {
        let className = 'navibar-open'
        if (!this.props.open) {
            className = 'navibar-collapsed'
        }

        return (
            <div className={className + ' content'}>
                <div className="content-top">
                    <h1 className="page-title">{this.props.title}</h1>
                </div>
                <div className="content-body container-fluid">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        open: state.ui.navibar_open
    }
}

export const Page = connect(mapStateToProps)(_Page)