import React, { Component } from 'react'
import UserModel from '../../shared/models/UserModel';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer';
import { AuthRoles } from '../../shared/AuthRoles';

export interface SecureRouteProps {
    user?: UserModel,
    exact: boolean,
    path: string,
    role: AuthRoles
    component: any
    location?: Location
}

export default class _SecureRoute extends Component<SecureRouteProps> {
    public render() {
        if (this.props.user && (this.props.user.roles.indexOf(this.props.role) > -1 || this.props.user.roles.indexOf(AuthRoles.ADMIN) > -1)) {
            return (
                <Route exact={this.props.exact} path={this.props.path} component={this.props.component} />
            )
        }

        return (
            <Route exact={this.props.exact} path={this.props.path} component={() => { return (<Redirect push to="/login" />) }} />
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        user: state.data.user.data
    }
}

export const SecureRoute = connect(mapStateToProps)(_SecureRoute)