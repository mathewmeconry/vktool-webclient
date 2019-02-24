import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { Dispatch } from "redux";
import { UI } from "../actions/UIActions";
import User from "../entities/User";
import { RouterProps } from "react-router";
import Config from "../Config";

export class _Header extends Component<{ open: boolean, user: User, onClick: () => {} } & RouterProps, {}> {
    constructor(props: { open: boolean, user: User, onClick: () => {} } & RouterProps) {
        super(props)

        this.logout = this.logout.bind(this)
    }

    private logout() {
        document.location.href = Config.apiEndpoint + '/api/logout'
    }

    public render() {
        let className = 'navibar-open'
        if (!this.props.open) {
            className = 'navibar-collapsed'
        }

        if (this.props.user) {
            return (
                <div id="header">
                    <div id="header-title" className={className}>
                        <div id="user">
                            {this.props.user.displayName}
                        </div>
                    </div>
                    <div id="header-bars" onClick={this.props.onClick}>
                        <span>
                            <FontAwesomeIcon icon="bars" />
                        </span>
                    </div>
                    <div id="header-logout" onClick={this.logout}>
                        <span>
                            <FontAwesomeIcon icon="power-off" />
                        </span>
                    </div>
                </div>
            )
        }

        return (
            <div></div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        open: state.ui.navibar_open,
        user: state.data.user.data
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onClick: () => {
            dispatch(UI.toggleNavibar())
        }
    }
}

//@ts-ignore
export const Header = connect(mapStateToProps, mapDispatchToProps)(_Header)