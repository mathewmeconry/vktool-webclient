import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer';
import { AuthRoles } from '../interfaces/AuthRoles';
import User from '../entities/User';
import { RouteProps } from 'react-router';

export interface SecureRouteProps {
    user?: User,
    exact: boolean,
    path: string,
    roles: Array<AuthRoles>
    component: any
}

export default class _SecureRoute extends Component<RouteProps & SecureRouteProps> {
    public render() {
        for (let role of this.props.roles) {
            if (this.props.user && (this.props.user.roles.includes(role) || this.props.user.roles.includes(AuthRoles.ADMIN))) {
                return (
                    <Route exact={this.props.exact} path={this.props.path} component={this.props.component} />
                )
            }
        }

        return (
            <Route exact={this.props.exact} path={this.props.path} component={() => {
                return (<Redirect push to={{
                    pathname: "/login",
                    state: {
                        prevLocation: (this.props.location || { pathname: '' }).pathname
                    },
                }} />)
            }} />
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        user: state.data.user.data
    }
}

export const SecureRoute = connect(mapStateToProps)(_SecureRoute)