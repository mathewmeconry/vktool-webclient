import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer';
import { AuthRoles } from '../interfaces/AuthRoles';
import User from '../entities/User';
import { RouteProps } from 'react-router';
import { Dispatch } from 'redux';
import { UI } from '../actions/UIActions';
import { Error403 } from './Errors/403';

export interface SecureRouteProps {
    user?: User,
    showError?: (message: string) => void
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

        if (this.props.user && this.props.showError) {
            this.props.showError('Not Authorized!')
            return <Route exact={this.props.exact} path={this.props.path} component={Error403} />
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

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        showError: (message: string) => {
            dispatch(UI.showError(message))
        }
    }
}

const mapStateToProps = (state: State) => {
    return {
        user: state.data.user.data
    }
}

export const SecureRoute = connect(mapStateToProps, mapDispatchToProps)(_SecureRoute)