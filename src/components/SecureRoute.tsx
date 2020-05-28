import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthRoles } from '../interfaces/AuthRoles'
import { RouteProps } from 'react-router'
import { Error403 } from './Errors/403'
import { useQuery } from 'react-apollo'
import { GET_MY_ROLES } from '../graphql/UserQueries'
import Loading from './Loading'

export interface SecureRouteProps extends RouteProps {
    exact: boolean,
    path: string,
    roles: Array<AuthRoles>
    component: any,
    showError?: boolean
}

export default function SecureRoute(props: SecureRouteProps) {
    const { loading, error, data } = useQuery(GET_MY_ROLES)

    if (loading || !data) {
        return <Loading fullscreen={true} />
    }

    for (let role of props.roles) {
        if (data.me.roles.includes(role) || data.me.roles.includes(AuthRoles.ADMIN)) {
            return (
                <Route exact={props.exact} path={props.path} component={props.component} />
            )
        }
    }

    if (props.showError) {
        return <Route exact={props.exact} path={props.path} component={Error403} />
    }

    return (
        <Route exact={props.exact} path={props.path} component={() => {
            return (<Redirect push to={{
                pathname: "/login",
                state: {
                    prevLocation: (props.location || { pathname: '' }).pathname
                },
            }} />)
        }} />
    )
}
