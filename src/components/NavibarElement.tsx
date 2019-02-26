import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { UI } from "../actions/UIActions";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import CurrentDevice from 'current-device'
import { withRouter } from 'react-router-dom'

export interface NavibarElementProps {
    level?: number,
    leftIcon?: IconProp,
    rightIcon?: IconProp,
    to?: string,
    text: string,
    navibar_open?: boolean,
    onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void,
    onClose?: () => void,
    toggleNavibar?: () => void
}

export class _NavibarElement extends Component<NavibarElementProps> {
    private level: number

    constructor(props: NavibarElementProps) {
        super(props)

        this.onMouseUp = this.onMouseUp.bind(this)
        this.level = this.props.level || 0
    }

    private onMouseUp(event: React.MouseEvent<HTMLElement>) {
        if (this.level === 0 && this.props.onClose) this.props.onClose()
        if (this.props.onMouseUp) this.props.onMouseUp(event)
        if (CurrentDevice.mobile() && this.props.toggleNavibar && this.props.to) this.props.toggleNavibar()
    }

    private renderLinkElement(to: string, content: Array<JSX.Element>, onMouseUp: (event: React.MouseEvent<HTMLElement>) => void) {
        if (to.match(/^(http|https):\/\//)) {
            return (
                <a href={to} className="navibar-element" onMouseUp={onMouseUp} >
                    {content}
                </a>
            )
        } else {
            return (
                <NavLink exact to={to} className="navibar-element" activeClassName="navibar-element-active" onMouseUp={onMouseUp} >
                    {content}
                </ NavLink>
            )
        }
    }

    public render() {
        let leftIcon
        let rightIcon: JSX.Element = <p></p>

        if (this.props.leftIcon) leftIcon = <FontAwesomeIcon icon={this.props.leftIcon} className="navibar-element-icon" />
        if (this.props.rightIcon) rightIcon = <FontAwesomeIcon icon={this.props.rightIcon} className="navibar-element-icon navibar-element-icon-right float-right" />

        if (this.props.to) {
            return this.renderLinkElement(this.props.to, [
                <li>
                    {leftIcon}
                    <p className="navibar-element-text">{this.props.text}</p>
                    {rightIcon}
                </li>
            ], this.onMouseUp)
        } else {
            return (
                <li className="navibar-element" onMouseUp={this.onMouseUp}>
                    {leftIcon}
                    <p className="navibar-element-text">{this.props.text}</p>
                    {rightIcon}
                </li>
            )
        }
    }
}


const mapStateToProps = (state: State) => {
    return {
        navibar_open: state.ui.navibar_open
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        onClose: () => {
            dispatch(UI.collapseNavibarLevel())
        },
        toggleNavibar: () => {
            dispatch(UI.toggleNavibar())
        }
    }
}

//@ts-ignore
export const NavibarElement = withRouter(connect(mapStateToProps, mapDispatchToProps)(_NavibarElement))