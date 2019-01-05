import React, { Component } from "react";
import NavibarElement from "./NavibarElement";
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer'
import { NavibarLevelHeader } from "./NavibarLevelHeader";
import UserModel from "../../shared/models/UserModel";
import { AuthRoles } from "../../shared/AuthRoles";

export class _Navibar extends Component<{ open: boolean, user?: UserModel }> {
    public renderElement(element: JSX.Element, role?: AuthRoles) {
        if (role) {
            if (this.props.user && (this.props.user.roles.indexOf(role) > -1 || this.props.user.roles.indexOf(AuthRoles.ADMIN) > -1)) {
                return element
            }
        } else {
            return element
        }
    }

    public render() {
        let className = 'navibar-open'
        if (!this.props.open) {
            className = 'navibar-collapsed'
        }

        if (this.props.user) {
            return (
                <div id="navibar" className={className}>
                    <ol>
                        {this.renderElement(<NavibarElement to="/dashboard" text="Dashboard" icon="tachometer-alt" />, AuthRoles.AUTHENTICATED)}
                        {this.renderElement(<NavibarElement to="/members" text="Mitglieder" icon="users" />, AuthRoles.MEMBERS_READ)}
                        {this.renderElement(<NavibarElement to="/orders" text="Aufträge" icon="file-alt" />, AuthRoles.ORDERS_READ)}
                        {this.renderElement(
                            <NavibarLevelHeader text="Verrechnungsrapporte" icon="file-signature" id="billingreports" level={1}>
                                {this.renderElement(<NavibarElement to="/billing-reports/add" icon="plus" text="Erstellen" />, AuthRoles.BILLINGREPORTS_CREATE)}
                                <NavibarElement to="/billing-reports" icon="list" text="Alle" />
                            </NavibarLevelHeader>
                            , AuthRoles.BILLINGREPORTS_READ
                        )}
                        {this.renderElement(
                            <NavibarLevelHeader text="Entschädigungen" icon="dollar-sign" id="compensations" level={1}>
                                {this.renderElement(<NavibarElement to="/compensations/add" icon="plus" text="Erstellen" />, AuthRoles.COMPENSATIONS_CREATE)}
                                <NavibarElement to="/compensations" icon="list" text="Alle" />
                            </NavibarLevelHeader>
                            , AuthRoles.COMPENSATIONS_READ
                        )}
                        {this.renderElement(<NavibarElement to="/users" text="Benutzer" icon="user" />, AuthRoles.ADMIN)}
                    </ol>
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

export const Navibar = connect(mapStateToProps, {}, null, { pure: false })(_Navibar)