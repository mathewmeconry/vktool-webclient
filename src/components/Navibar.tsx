import React, { Component } from "react";
import { NavibarElement } from "./NavibarElement";
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer'
import { NavibarLevelHeader } from "./NavibarLevelHeader";
import { AuthRoles } from "../interfaces/AuthRoles";
import User from "../entities/User";
import Config from "../Config";

export class _Navibar extends Component<{ open: boolean, user?: User }> {
    public renderElement(element: JSX.Element, roles?: Array<AuthRoles>) {
        if (roles) {
            for (let role of roles) {
                if (this.props.user && (this.props.user.roles.includes(role) || this.props.user.roles.includes(AuthRoles.ADMIN))) {
                    return element
                }
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
                        {this.renderElement(<NavibarElement to="/dashboard" text="Dashboard" leftIcon="tachometer-alt" />, [AuthRoles.AUTHENTICATED])}
                        {this.renderElement(<NavibarElement to="/members" text="Mitglieder" leftIcon="users" />, [AuthRoles.MEMBERS_READ])}
                        {this.renderElement(<NavibarElement to="/mailing-lists" text="Verteiler" leftIcon="mail-bulk" />, [AuthRoles.MEMBERS_READ])}
                        {this.renderElement(
                            <NavibarLevelHeader text="Aufgebot" leftIcon="address-book" id="draft" level={1}>
                                <NavibarElement to="/draft/collection-points" leftIcon="map-marker-alt" text="Abholpunkte" />
                            </NavibarLevelHeader>
                            , [AuthRoles.DRAFT_READ, AuthRoles.DRAFT_CREATE]
                        )}
                        {this.renderElement(<NavibarElement to="/orders" text="Aufträge" leftIcon="file-alt" />, [AuthRoles.ORDERS_READ])}
                        {this.renderElement(
                            <NavibarLevelHeader text="Verrechnungsrapporte" leftIcon="file-signature" id="billingreports" level={1}>
                                {this.renderElement(<NavibarElement to="/billing-reports/add" leftIcon="plus" text="Erstellen" />, [AuthRoles.BILLINGREPORTS_CREATE])}
                                <NavibarElement to="/billing-reports" leftIcon="list" text="Alle" />
                                <NavibarElement to="https://vkazu.sharepoint.com/:w:/r/Vorlagen/Verrechungsrapport.docx?d=w66977fb79dfd4ab3832ca05fd6d9b8d2&csf=1&e=Spme13" text="Word Vorlage" leftIcon="file-word" />
                            </NavibarLevelHeader>
                            , [AuthRoles.BILLINGREPORTS_READ, AuthRoles.BILLINGREPORTS_CREATE]
                        )}
                        {this.renderElement(
                            <NavibarLevelHeader text="Entschädigungen" leftIcon="dollar-sign" id="compensations" level={1}>
                                {this.renderElement(<NavibarElement to="/compensations/add" leftIcon="plus" text="Erstellen" />, [AuthRoles.COMPENSATIONS_CREATE])}
                                <NavibarElement to="/compensations" leftIcon="list" text="Alle" />
                            </NavibarLevelHeader>
                            , [AuthRoles.COMPENSATIONS_READ]
                        )}
                        {this.renderElement(<NavibarElement to="/users" text="Benutzer" leftIcon="user" />, [AuthRoles.ADMIN])}
                        <NavibarElement to="https://vkazu.sharepoint.com/Reglemente" text="Reglemente" leftIcon="external-link-alt"/>
                        <NavibarElement to={`${Config.apiEndpoint}/api/logout`} text="Abmelden" leftIcon="power-off" />
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