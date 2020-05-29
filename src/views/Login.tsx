import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Loading from "../components/Loading"
import Config from "../Config"
import { useQuery } from "react-apollo"
import { GET_ME } from "../graphql/UserQueries"
import { RouteComponentProps } from "react-router-dom"

export default function Login(props: RouteComponentProps<{}, {}, { prevLocation: string, errorShown: boolean }>) {
    const me = useQuery(GET_ME)

    if (me.loading) {
        return <Loading />
    }

    if (me.data) {
        if (props.location.state && props.location.state.prevLocation) {
            props.history.push(props.location.state.prevLocation)
        } else {
            props.history.push('/dashboard')
        }
        return null
    }

    if (props.location.state && !props.location.state.errorShown) {
        props.history.replace(props.location.pathname, Object.assign({}, props.location.state, { errorShown: true }))
    }

    return (
        <div className="d-flex vw-100 vh-100" id="login-container">
            <div id="login">
                <h2>Login</h2>
                <div className="form-group" >
                    <a className="btn btn-secondary btn-block d-flex justify-content-between" href={Config.apiEndpoint + "/api/auth/azure"}>
                        <span className="icon">
                            <FontAwesomeIcon icon={['fab', 'microsoft']} ></FontAwesomeIcon>
                        </span>
                        <span>
                            VK-Login
                        </span>
                        <span></span>
                    </a>
                </div >
            </div >
        </div>
    )
}