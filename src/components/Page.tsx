import React, { Component, PropsWithChildren } from "react"
import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { UI } from "../actions/UIActions"
import Swipe from "./Swipe"
import { Header } from "./Header"
import { Navibar } from "./Navibar"
import { WorkingIndicator } from "./WorkingIndicator"

export interface PageProps {
    title: string,
    open: boolean,
    openNavibar?: () => void,
    closeNavibar?: () => void
}

export class _Page extends Component<PropsWithChildren<PageProps>> {
    constructor(props: PageProps) {
        super(props)

        this.swipedRight = this.swipedRight.bind(this)
        this.swipedLeft = this.swipedLeft.bind(this)
    }

    public swipedRight() {
        if (this.props.openNavibar) this.props.openNavibar()
    }

    public swipedLeft() {
        if (this.props.closeNavibar) this.props.closeNavibar()
    }

    public render() {
        let className = 'navibar-open'
        if (!this.props.open) {
            className = 'navibar-collapsed'
        }

        return (
            <div className="body">
                <Header />
                <Navibar />
                <Swipe className={className + ' content'} mouseMove={true} swipedRight={this.swipedRight} swipedLeft={this.swipedLeft}>
                    <div className="content-top">
                        <h1 className="page-title">{this.props.title}</h1>
                    </div>
                    <div className="content-body container-fluid">
                        {this.props.children}
                    </div>
                </Swipe>
                <WorkingIndicator />
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