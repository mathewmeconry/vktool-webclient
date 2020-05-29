import React, { Component, PropsWithChildren } from "react"
import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { UI } from "../actions/UIActions"
import Header from "./Header"
import Navibar from "./Navibar"

export interface PageProps {
    title: string,
    open: boolean,
    openNavibar?: () => void,
    closeNavibar?: () => void
}

export class _Page extends Component<PropsWithChildren<PageProps>> {
    constructor(props: PageProps) {
        super(props)
    }

    public render() {
        let className = 'navibar-open'
        if (!this.props.open) {
            className = 'navibar-collapsed'
        }

        return (
            <div className="body">
                <Header open={this.props.open} onClick={(this.props.open) ? this.props.closeNavibar : this.props.openNavibar} />
                <Navibar open={this.props.open} />
                <div className={`content ${className}`}>
                    <div className="content-top">
                        <h1 className="page-title">{this.props.title}</h1>
                    </div>
                    <div className="content-body container-fluid">
                        {this.props.children}
                    </div>
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

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        closeNavibar: () => {
            dispatch(UI.closeNavibar())
        },
        openNavibar: () => {
            dispatch(UI.openNavibar())
        }
    }
}

export const Page = connect(mapStateToProps, mapDispatchToProps)(_Page)