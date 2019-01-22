import { NavibarElement } from "./NavibarElement";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React, { Component, Children, cloneElement, ReactElement } from "react";
import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { UI } from "../actions/UIActions";

export interface NavibarLevelHeaderProps {
    leftIcon?: IconProp,
    text: string,
    id: string,
    level: number,
    open_level: string,
    onOpen: (id: string) => void,
    onClose: () => void
}

export default class _NavibarLevelHeader extends Component<NavibarLevelHeaderProps> {

    constructor(props: NavibarLevelHeaderProps) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    private onClick(event: React.MouseEvent<HTMLElement>) {
        if (this.props.open_level === this.props.id) {
            this.props.onClose()
        } else {
            this.props.onOpen(this.props.id)
        }
    }

    public render() {
        let openClass = ''
        let rightIcon: IconProp = 'angle-up'

        if (this.props.id !== this.props.open_level) {
            openClass = ' level-collapsed'
            rightIcon = 'angle-down'
        }

        return (
            <div>
                <NavibarElement leftIcon={this.props.leftIcon} rightIcon={rightIcon} text={this.props.text} onMouseUp={this.onClick} />
                <div key={"levelContainer-" + this.props.id} className={"level-container" + " level-" + this.props.level.toString() + openClass}>
                    {
                        Children.map(this.props.children, child => {
                            return cloneElement(child as ReactElement<any>, { level: this.props.level })
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        open_level: state.ui.navibar_level
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        onOpen: (id: string) => {
            dispatch(UI.openNavibarLevel(id))
        },
        onClose: () => {
            dispatch(UI.collapseNavibarLevel())
        },
    }
}


//@ts-ignore
export const NavibarLevelHeader = connect(mapStateToProps, mapDispatchToProps)(_NavibarLevelHeader)